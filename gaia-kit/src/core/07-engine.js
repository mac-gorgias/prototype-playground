/* ─── Story engine ───
 * A story is an array of steps. StoryMachine walks them with a stack of frames (so branches,
 * option-level `then` steps and `goto` loops work), appends items to the transcript, and exposes
 * `waiting` so the shell knows what the composer should show.
 * Step reference: .claude/skills/gaia-story/reference/step-types.md */

const NEXT = 0;    // step finished synchronously → move to the following step
const WAIT = 1;    // something async (typing, timer, user input) will call advance()/respond()
const JUMPED = 2;  // the handler already moved the cursor (entered a frame or goto)

function getPath(obj, path) {
  return path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
}

/* Strings support {{brand.name}} / {{answers.inboxText}}; functions receive ctx. */
function resolveValue(v, ctx) {
  if (typeof v === "function") return v(ctx);
  if (typeof v === "string") {
    return v.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, p) => {
      const r = getPath(ctx, p);
      return r == null ? "" : String(r);
    });
  }
  return v;
}

/* Steps whose children are generated (use cases, plans) register a static expander here, so dev
 * jumps and the chapter menu can see inside them. compose() never patches generated lists. */
const EXPANDERS = {};

/* Child step-lists of a step (for deep search, chapter listing and compose). */
function childLists(step, expand = true) {
  if (!step || typeof step !== "object") return [];
  const out = [];
  if (expand && step.type && EXPANDERS[step.type]) {
    const generated = EXPANDERS[step.type](step);
    if (Array.isArray(generated)) out.push(generated);
  }
  ["then", "else", "steps", "onSecondary"].forEach((k) => { if (Array.isArray(step[k])) out.push(step[k]); });
  if (step.cases) Object.values(step.cases).forEach((s) => Array.isArray(s) && out.push(s));
  if (Array.isArray(step.default)) out.push(step.default);
  if (step.on && typeof step.on === "object") Object.values(step.on).forEach((s) => Array.isArray(s) && out.push(s));
  if (Array.isArray(step.options)) step.options.forEach((o) => o && Array.isArray(o.then) && out.push(o.then));
  if (step.freeform && Array.isArray(step.freeform.then)) out.push(step.freeform.then);
  return out;
}

function stepsContain(steps, label) {
  if (!Array.isArray(steps)) return false;
  return steps.some((s) => s && (s.chapter === label || s.label === label || childLists(s).some((l) => stepsContain(l, label))));
}

/* All chapter markers in story order (depth-first, first occurrence wins), for the dev menu. */
function listChapters(steps, depth = 0, out = [], seen = new Set()) {
  (steps || []).forEach((s) => {
    if (!s) return;
    if (s.chapter && !s.hidden && !seen.has(s.chapter)) {
      seen.add(s.chapter);
      out.push({ key: s.chapter, title: s.title || s.chapter, depth });
    }
    childLists(s).forEach((l) => listChapters(l, depth + 1, out, seen));
  });
  return out;
}

const STEP_TYPES = {};
function registerStep(type, handler) { STEP_TYPES[type] = handler; }

class StoryMachine {
  constructor({ story, brand, onChange }) {
    this.story = story;
    this.steps = story.steps || story;
    this.brand = brand || {};
    this.onChange = onChange;
    this.timers = new Set();
    this.version = 0;
    this.jumpCount = 0;
    this.reset();
  }

  reset() {
    this.timers.forEach(clearTimeout);
    this.timers.clear();
    this.items = [];
    this.answers = {};
    this.checklist = {};
    this.waiting = null;
    this.screen = null;
    this.overlay = null;
    this.panel = null;
    this.chapter = null;
    this.stack = [{ steps: this.steps, i: 0 }];
    this.delayPassed = false;
    this.instant = false;
    this.target = null;
    this.seq = 0;
    this.epoch = (this.epoch || 0) + 1; // bumps on every reset/jump so React remounts thread items
    this.userAt = 0;    // when the last user bubble was pushed (keeps Gaia from talking over it)
    // Modular onboarding state (see 09-modular.js)
    const sc = this.scenario || {};
    this.done = new Set(sc.done || []);   // modules done on the account
    Object.assign(this.answers, sc.answers || {});
    this.plan = null;
    this.module = null;
    this.bg = {};                         // silent module id → "running" | "done"
    this.ui = { mode: "full", surface: null };
    this.events = [];
  }

  dispose() { this.timers.forEach(clearTimeout); this.timers.clear(); this.onChange = null; }
  emit() { this.version++; if (this.onChange) this.onChange(); }
  later(fn, ms) {
    const t = setTimeout(() => { this.timers.delete(t); fn(); }, ms);
    this.timers.add(t);
  }

  makeCtx() {
    const m = this;
    return {
      brand: m.brand,
      answers: m.answers,
      checklist: m.checklist,
      chapter: m.chapter,
      panel: m.panel,
      instant: m.instant,
      module: m.module,
      isDone: (id) => m.done.has(id),
      plan: {
        useCase: m.plan && m.plan.useCase ? m.plan.useCase.id : null,
        modules: m.plan ? m.plan.modules : [],
        has: (id) => !!m.plan && (m.plan.modules.includes(id) || m.plan.silent.includes(id)),
      },
      set(key, value) { m.answers[key] = value; m.emit(); },
      complete(key) { m.complete(key); m.emit(); },
      openPanel(name, props) { m.openPanel(name, props); },
      closePanel() { m.closePanel(); },
      goto(label) { m.goto(label); if (!m.running) m.run(); },
      say(text) { m.push({ kind: "ai", text, instant: true }); m.emit(); },
    };
  }

  push(item) {
    item.id = this.epoch + ":" + (++this.seq);
    if (item.instant === undefined) item.instant = this.instant;
    if (item.kind === "user" && !this.instant) this.userAt = Date.now();
    this.items.push(item);
    return item;
  }
  removeItem(item) { this.items = this.items.filter((i) => i !== item); }
  complete(key) { if (key && !this.checklist[key]) this.checklist = { ...this.checklist, [key]: true }; }

  /* ── cursor ── */
  peek() {
    while (this.stack.length) {
      const top = this.stack[this.stack.length - 1];
      if (top.i < top.steps.length) return top.steps[top.i];
      this.stack.pop();
      this.delayPassed = false;
    }
    return null;
  }
  frameAdvance() {
    const top = this.stack[this.stack.length - 1];
    if (top) top.i++;
    this.delayPassed = false;
  }
  /* Run `steps` next, then continue after the current step. */
  enter(steps) {
    this.frameAdvance();
    if (steps && steps.length) this.stack.push({ steps, i: 0 });
  }
  /* Run `steps` now without consuming the current step (it re-runs afterwards unless steps goto). */
  interrupt(steps) {
    this.waiting = null;
    if (steps && steps.length) this.stack.push({ steps, i: 0 });
    this.delayPassed = false;
    this.run();
  }
  goto(label) {
    for (let d = this.stack.length - 1; d >= 0; d--) {
      const j = this.stack[d].steps.findIndex((s) => s && (s.label === label || s.chapter === label));
      if (j >= 0) {
        this.stack.length = d + 1;
        this.stack[d].i = j;
        this.delayPassed = false;
        this.waiting = null;
        this.jumpCount++;
        return true;
      }
    }
    // Not on the current path: fall back to a root-level label (e.g. jumping forward to another chapter).
    const j = this.steps.findIndex((s) => s && (s.label === label || s.chapter === label));
    if (j >= 0) {
      this.stack = [{ steps: this.steps, i: j }];
      this.delayPassed = false;
      this.waiting = null;
      this.jumpCount++;
      return true;
    }
    console.warn("[gaia-kit] goto: label not found:", label);
    return false;
  }

  stopInstant() { this.instant = false; this.target = null; }

  /* ── main loop ── */
  run() {
    if (this.running) return;
    this.running = true;
    try {
      let guard = 0;
      while (guard++ < 10000) {
        const step = this.peek();
        if (!step) { this.waiting = { kind: "end" }; this.stopInstant(); break; }
        const ctx = this.makeCtx();
        if (this.target && (step.chapter === this.target || step.label === this.target)) this.stopInstant();
        if (step.only && !step.only(ctx)) { this.frameAdvance(); continue; }
        let delay = step.delay ? resolveValue(step.delay, ctx) : 0;
        // Sequence after the user's bubble: nothing visible starts until it has floated in.
        if (this.userAt && SHOWS_AFTER_USER.has(step.type)) delay = Math.max(delay, TIMING.afterUserMs - (Date.now() - this.userAt));
        if (delay && !this.instant && !this.delayPassed) {
          this.waiting = { kind: "timer" };
          this.later(() => { this.delayPassed = true; this.run(); }, delay);
          break;
        }
        const r = this.exec(step, ctx);
        if (r === WAIT) break;
        if (r === NEXT) this.frameAdvance();
      }
      if (guard >= 10000) console.error("[gaia-kit] story loop guard tripped — check for a goto loop without a wait.");
    } finally {
      this.running = false;
    }
    this.emit();
  }

  exec(step, ctx) {
    if (step.chapter) this.chapter = step.chapter;
    const type = step.type || ((step.chapter || step.label) ? "marker" : null);
    const handler = STEP_TYPES[type];
    if (!handler) { console.warn("[gaia-kit] unknown step type:", type, step); return NEXT; }
    return handler(step, this, ctx);
  }

  /* Called by async items (typing done, timer, research done). */
  advance() { this.waiting = null; this.frameAdvance(); this.run(); }

  /* ── user responses ── */
  respond(value, freeText) {
    const w = this.waiting;
    if (!w) return;
    const step = w.step;
    const ctx = this.makeCtx();
    if (w.kind === "choice") {
      const options = resolveValue(step.options, ctx) || [];
      const opt = freeText != null ? null : options.find((o) => o.key === value);
      const display = freeText != null ? freeText : (opt ? (opt.reply || opt.title) : String(value));
      const bubble = step.bubble !== false && !(opt && opt.bubble === false);
      if (bubble) this.push({ kind: "user", text: display, tag: step.tag });
      if (step.id) {
        this.answers[step.id] = freeText != null ? (step.freeformKey || "other") : value;
        this.answers[step.id + "Text"] = display;
      }
      this.waiting = null;
      const then = freeText != null ? (step.freeform && step.freeform.then) : (opt && opt.then);
      if (then) this.enter(then); else this.frameAdvance();
    } else if (w.kind === "multi") {
      const keys = Object.keys(w.toggles).filter((k) => w.toggles[k]);
      if (step.id) this.answers[step.id] = keys;
      if (step.reply) this.push({ kind: "user", text: resolveValue(step.reply, this.makeCtx()), tag: step.tag });
      this.waiting = null;
      this.frameAdvance();
    } else if (w.kind === "input") {
      const text = String(value || "").trim();
      if (!text) return;
      if (step.bubble !== false) this.push({ kind: "user", text, tag: step.tag });
      if (step.id) this.answers[step.id] = text;
      this.waiting = null;
      this.frameAdvance();
    } else {
      return;
    }
    this.run();
  }

  toggle(key) {
    const w = this.waiting;
    if (!w || w.kind !== "multi") return;
    w.toggles = { ...w.toggles, [key]: !w.toggles[key] };
    this.emit();
  }

  resolveCard(item, outcome, { run = true } = {}) {
    if (item.status === "resolved") return;
    const step = item.step;
    item.status = "resolved";
    item.value = outcome;
    if (step.id) this.answers[step.id] = outcome;
    if (step.ephemeral) this.removeItem(item);
    if (this.waiting && this.waiting.item === item) this.waiting = null;
    const then = step.on && step.on[outcome];
    if (step.await) { if (then) this.enter(then); else this.frameAdvance(); }
    if (run) this.run(); else this.emit();
  }

  finishConnect(item, { run = true } = {}) {
    const step = item.step;
    this.removeItem(item);
    this.waiting = null;
    if (step.connectedLabel) this.push({ kind: "confirm", label: resolveValue(step.connectedLabel, this.makeCtx()), tag: step.tag });
    if (step.complete) this.complete(step.complete);
    if (step.then) this.enter(step.then); else this.frameAdvance();
    if (run) this.run();
  }
  connectSecondary(item) {
    const step = item.step;
    this.removeItem(item);
    this.waiting = null;
    this.enter(step.onSecondary || []);
    this.run();
  }

  finishScreen() { this.screen = null; this.advance(); }

  /* ── panels / overlays ── */
  openPanel(name, props) {
    this.prevPanel = this.panel && !this.panel.closing ? this.panel.name : null;
    this.panel = { name, props: props || {}, closing: false };
    this.emit();
  }
  closePanel() {
    if (!this.panel || this.panel.closing) return;
    this.panel = { ...this.panel, closing: true };
    this.emit();
    this.later(() => { this.panel = null; this.prevPanel = null; this.emit(); }, TIMING.panelClose);
  }
  showHome(config) { this.overlay = { name: "home", ...(config || {}) }; this.emit(); }
  continueFromHome() {
    const resume = this.overlay && this.overlay.resume;
    this.overlay = null;
    if (resume) { this.goto(resume); this.run(); } else this.emit();
  }
  overlayAction(steps) { this.overlay = null; this.interrupt(steps); }

  /* Free chat: user typed while Gaia wasn't asking for anything specific. */
  freeChat(text, reply, ms) {
    this.push({ kind: "user", text });
    this.emit();
    // Typed like every other narration line; waits at least until the user's bubble has landed.
    this.later(() => { this.push({ kind: "ai", text: reply, speed: TIMING.typeMs, instant: false }); this.emit(); }, Math.max(ms || 0, TIMING.afterUserMs));
  }

  /* Dev menu: rebuild the story instantly up to `target`, then continue live. */
  jump(target) {
    this.reset();
    if (target) { this.instant = true; this.target = target; }
    this.emit();
    this.run();
  }
}

/* Step types that put something on screen; they wait for TIMING.afterUserMs after a user bubble. */
const SHOWS_AFTER_USER = new Set(["ai", "confirm", "verify", "research", "await", "choice", "multi", "input", "card", "custom", "connect", "panel", "screen", "end"]);

/* ── Built-in step types ── */
registerStep("marker", () => NEXT);
registerStep("label", () => NEXT);

registerStep("ai", (step, m, ctx) => {
  if (step.lines) {
    const lines = resolveValue(step.lines, ctx);
    m.enter(lines.map((text) => ({ type: "ai", text, tag: step.tag })));
    return JUMPED;
  }
  // One typing rate for every narration line (step.speed is ignored), so longer lines simply take longer.
  const item = m.push({ kind: "ai", text: resolveValue(step.text, ctx), speed: TIMING.typeMs, tag: step.tag });
  if (m.instant || step.typed === false) { item.instant = true; return NEXT; }
  let done = false;
  item.onDone = () => { if (done) return; done = true; m.advance(); };
  m.waiting = { kind: "typing" };
  return WAIT;
});

registerStep("user", (step, m, ctx) => { m.push({ kind: "user", text: resolveValue(step.text, ctx), tag: step.tag }); return NEXT; });
registerStep("confirm", (step, m, ctx) => { m.push({ kind: "confirm", label: resolveValue(step.label, ctx), compact: step.compact, tag: step.tag }); return NEXT; });
registerStep("checklist", (step, m) => { m.complete(step.complete); return NEXT; });
registerStep("set", (step, m, ctx) => { Object.assign(m.answers, resolveValue(step.values, ctx) || {}); return NEXT; });
registerStep("do", (step, m, ctx) => { const before = m.jumpCount; step.run(ctx); return m.jumpCount !== before ? JUMPED : NEXT; });
registerStep("retract", (step, m) => {
  const tags = [].concat(step.tag);
  m.items = m.items.filter((i) => !tags.includes(i.tag));
  return NEXT;
});
registerStep("goto", (step, m) => (m.goto(step.to) ? JUMPED : NEXT));

const waitHandler = (step, m, ctx) => {
  if (m.instant) return NEXT;
  m.waiting = { kind: "timer" };
  m.later(() => m.advance(), resolveValue(step.ms, ctx) || 0);
  return WAIT;
};
registerStep("wait", waitHandler);
registerStep("verify", waitHandler);

registerStep("research", (step, m, ctx) => {
  const sources = resolveValue(step.sources, ctx) || m.brand.researchSources || [];
  const summary = resolveValue(step.summary, ctx) || ("Reviewed " + sources.length + " sources for " + (m.brand.name || "your store"));
  const item = m.push({ kind: "research", sources, summary, tag: step.tag });
  if (m.instant) return NEXT;
  let done = false;
  item.onDone = () => { if (done) return; done = true; m.advance(); };
  m.waiting = { kind: "research" };
  return WAIT;
});

/* Pick an option during an instant jump: the one leading to the target, else devAnswer, else the first. */
function devPick(step, m, ctx, options) {
  if (m.target) {
    const onPath = options.find((o) => o.then && stepsContain(o.then, m.target));
    if (onPath) return { key: onPath.key };
    if (step.freeform && stepsContain(step.freeform.then, m.target)) return { text: (step.devAnswer && step.devAnswer.text) || "Something else" };
  }
  const dev = resolveValue(step.devAnswer, ctx);
  if (dev && typeof dev === "object" && dev.text) return { text: dev.text };
  if (dev != null && options.some((o) => o.key === dev)) return { key: dev };
  return { key: options[0] && options[0].key };
}

registerStep("choice", (step, m, ctx) => {
  const options = resolveValue(step.options, ctx) || [];
  m.waiting = { kind: "choice", step, options };
  if (m.instant) {
    const pick = devPick(step, m, ctx, options);
    if (pick.text != null) m.respondSync(null, pick.text); else m.respondSync(pick.key);
    return JUMPED;
  }
  return WAIT;
});

registerStep("multi", (step, m, ctx) => {
  const options = resolveValue(step.options, ctx) || [];
  const initial = resolveValue(step.initial, ctx);
  const toggles = {};
  options.forEach((o) => { toggles[o.key] = initial ? initial.includes(o.key) : true; });
  m.waiting = { kind: "multi", step, options, toggles };
  if (m.instant) {
    const dev = resolveValue(step.devAnswer, ctx);
    if (Array.isArray(dev)) options.forEach((o) => { toggles[o.key] = dev.includes(o.key); });
    m.respondSync();
    return JUMPED;
  }
  return WAIT;
});

registerStep("input", (step, m, ctx) => {
  m.waiting = { kind: "input", step };
  if (m.instant) {
    const dev = resolveValue(step.devAnswer, ctx) || "Sample answer";
    m.respondSync(dev);
    return JUMPED;
  }
  return WAIT;
});

/* respond() without re-entering run() — used by instant jumps from inside the loop. */
StoryMachine.prototype.respondSync = function (value, freeText) {
  const run = this.run;
  this.run = () => {};
  try { this.respond(value, freeText); } finally { this.run = run; }
};

const cardHandler = (step, m, ctx) => {
  const item = m.push({ kind: "card", step, status: step.await ? "pending" : "static", tag: step.tag });
  if (!step.await) return NEXT;
  if (m.instant) {
    let outcome = resolveValue(step.devAnswer, ctx);
    if (m.target && step.on) {
      const onPath = Object.keys(step.on).find((k) => stepsContain(step.on[k], m.target));
      if (onPath) outcome = onPath;
    }
    if (outcome == null && step.on) outcome = Object.keys(step.on)[0];
    m.resolveCard(item, outcome, { run: false });
    return JUMPED;
  }
  m.waiting = { kind: "card", item, hold: !!step.holdComposer };
  return WAIT;
};
registerStep("card", cardHandler);
registerStep("custom", cardHandler);

registerStep("connect", (step, m) => {
  const item = m.push({ kind: "connect", step, tag: step.tag });
  if (m.instant) {
    if (m.target && step.onSecondary && stepsContain(step.onSecondary, m.target)) { m.connectSecondaryNoRun(item); return JUMPED; }
    m.finishConnect(item, { run: false });
    return JUMPED;
  }
  m.waiting = { kind: "card", item, hold: false };
  return WAIT;
});
StoryMachine.prototype.connectSecondaryNoRun = function (item) {
  this.removeItem(item);
  this.waiting = null;
  this.enter(item.step.onSecondary || []);
};

const branchHandler = (pickSteps) => (step, m, ctx) => {
  let steps = pickSteps(step, m, ctx);
  if (m.target) {
    const lists = step.cases ? Object.values(step.cases).concat(step.default ? [step.default] : []) : [step.then, step.else];
    const onPath = lists.find((l) => stepsContain(l, m.target));
    if (onPath) steps = onPath;
  }
  m.enter(steps || []);
  return JUMPED;
};
registerStep("branch", branchHandler((step, m, ctx) => {
  const value = typeof step.on === "function" ? step.on(ctx) : getPath(m.answers, step.on);
  return (step.cases && step.cases[value]) || step.default;
}));
registerStep("when", branchHandler((step, m, ctx) => (step.if(ctx) ? step.then : step.else)));
registerStep("group", (step, m) => { m.enter(step.steps); return JUMPED; });

registerStep("panel", (step, m, ctx) => {
  if (step.open) m.openPanel(step.open, resolveValue(step.props, ctx));
  else m.closePanel();
  return NEXT;
});

registerStep("screen", (step, m) => {
  const component = { signup: "SignupScreen", intro: "WelcomeIntro" }[step.screen] || step.screen;
  if (m.instant || !GaiaKit[component]) {
    if (!GaiaKit[component]) console.warn("[gaia-kit] screen needs gaia-kit.screens.js:", step.screen);
    return NEXT;
  }
  m.screen = { name: step.screen, step };
  m.waiting = { kind: "screen" };
  return WAIT;
});

registerStep("end", (step, m, ctx) => {
  m.stopInstant();
  const props = resolveValue(step.props, ctx) || {};
  if (step.screen === "home") m.overlay = { name: "home", props, resume: step.resume, step };
  else if (step.screen === "closing") m.overlay = { name: "closing", props, step };
  m.waiting = { kind: "end" };
  return WAIT;
});

/* ── compose(): splice stories at chapter boundaries ── */
function cloneSteps(steps) {
  return steps.map((s) => {
    if (!s || typeof s !== "object" || s.$$typeof) return s;
    const c = { ...s };
    ["then", "else", "steps", "onSecondary", "default"].forEach((k) => { if (Array.isArray(c[k])) c[k] = cloneSteps(c[k]); });
    if (c.cases) c.cases = Object.fromEntries(Object.entries(c.cases).map(([k, v]) => [k, Array.isArray(v) ? cloneSteps(v) : v]));
    if (c.on && typeof c.on === "object") c.on = Object.fromEntries(Object.entries(c.on).map(([k, v]) => [k, Array.isArray(v) ? cloneSteps(v) : v]));
    if (Array.isArray(c.options)) c.options = c.options.map((o) => (o && Array.isArray(o.then) ? { ...o, then: cloneSteps(o.then) } : o));
    if (c.freeform && Array.isArray(c.freeform.then)) c.freeform = { ...c.freeform, then: cloneSteps(c.freeform.then) };
    return c;
  });
}

/* Every array holding chapter `name`, with its [start, end) range (until the next chapter marker).
 * A step list can be reused in several branches (e.g. forwarding), so patches apply to each copy. */
function findChapters(steps, name, out = []) {
  const i = steps.findIndex((s) => s && s.chapter === name);
  if (i >= 0) {
    let end = steps.length;
    for (let j = i + 1; j < steps.length; j++) if (steps[j] && steps[j].chapter) { end = j; break; }
    out.push({ list: steps, start: i, end });
  }
  steps.forEach((s) => childLists(s, false).forEach((l) => findChapters(l, name, out)));
  return out;
}

/* patches: [{ after | before | replace: "chapter", steps: [...] }] */
function compose(base, patches) {
  const story = { ...base, steps: cloneSteps(base.steps || base) };
  (patches || []).forEach((p) => {
    const name = p.after || p.before || p.replace;
    const found = findChapters(story.steps, name);
    if (!found.length) { console.error("[gaia-kit] compose: chapter not found:", name); return; }
    found.forEach(({ list, start, end }) => {
      const add = cloneSteps(p.steps || []);
      if (p.before) list.splice(start, 0, ...add);
      else if (p.after) list.splice(end, 0, ...add);
      else {
        const keepMarker = add[0] && add[0].chapter ? [] : [list[start]];
        list.splice(start, end - start, ...keepMarker, ...add);
      }
    });
  });
  return story;
}

function chaptersOf(story) { return listChapters(story.steps || story); }
