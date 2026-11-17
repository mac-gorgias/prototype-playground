/* ─── Modular onboarding ───
 * Mirrors the Notion model "Make onboarding modular": use case → module → step → Gaia tool.
 *   - A module is a reusable unit with one win. Defined once (GaiaKit.defineModule), used by many use cases.
 *   - A use case is an ordered list of modules plus an intro, clarifying questions and a completion.
 *   - The planner expands a use case: drops modules the account already has, adds hard requirements
 *     before the modules that need them, starts silent modules in the background, ends with the
 *     best next action.
 * Reference: .claude/skills/gaia-story/reference/modules.md */

const MODULES = {};   // "id@version" → module
const USE_CASES = {};

function defineModule(def) {
  const mod = { version: 1, ui: "full", requires: [], unlocks: [], steps: [], ...def };
  if (!mod.id) throw new Error("[gaia-kit] defineModule needs an id");
  MODULES[mod.id + "@" + mod.version] = mod;
  return mod;
}

/* "connect-email" → highest loaded version; "connect-email@1" → that version. */
function getModule(ref) {
  if (!ref) return null;
  if (typeof ref === "object") return ref;
  if (MODULES[ref]) return MODULES[ref];
  if (ref.includes("@")) return null;
  const versions = Object.values(MODULES).filter((m) => m.id === ref).sort((a, b) => b.version - a.version);
  return versions[0] || null;
}

function defineUseCase(def) {
  if (!def.id) throw new Error("[gaia-kit] defineUseCase needs an id");
  USE_CASES[def.id] = { ask: [], modules: [], ...def };
  return USE_CASES[def.id];
}
function getUseCase(id) { return USE_CASES[id] || null; }

const moduleKey = (planKey, mod) => planKey + "/" + mod.id;

/* Goal question: "What do you want to get done first?" with one option per live use case. */
function goalQuestion(useCaseIds, overrides = {}) {
  return {
    type: "choice", id: "goal", label: "goal", freeform: false,
    title: "What do you want to get done first?",
    ...overrides,
    options: useCaseIds.map((id) => {
      const uc = getUseCase(id) || { id, title: id };
      return { key: id, title: uc.title, desc: uc.pitch, reply: uc.title, then: [{ type: "usecase", id }] };
    }),
  };
}

/* The planner. Deterministic: same answers + account state → same plan. */
function computePlan({ useCase, modules: refs }, m, ctx) {
  const uc = useCase ? getUseCase(useCase) : null;
  const key = uc ? uc.id : "plan";
  const entries = (uc ? uc.modules : refs || []).map((e) => (typeof e === "string" ? { module: e } : e));
  const wanted = [];
  entries.forEach((e) => {
    const mod = getModule(e.module);
    if (!mod) { console.warn("[gaia-kit] module not loaded:", e.module); return; }
    const forced = m.target && m.target === moduleKey(key, mod);
    if (e.when && !forced && !(ctx ? e.when(ctx) : true)) return;
    wanted.push(mod);
  });
  // Requirements first (depth-first), in use-case order otherwise.
  const ordered = [];
  const seen = new Set();
  const visit = (mod) => {
    if (seen.has(mod.id)) return;
    seen.add(mod.id);
    (mod.requires || []).forEach((r) => { const dep = getModule(r); if (dep) visit(dep); });
    ordered.push(mod);
  };
  wanted.forEach(visit);
  const remaining = ordered.filter((mod) => !m.done || !m.done.has(mod.id));
  return { key, useCase: uc, visible: remaining.filter((x) => !x.silent), silent: remaining.filter((x) => x.silent) };
}

function moduleSteps(mod, key) {
  return [
    { type: "module-start", chapter: moduleKey(key, mod), title: mod.name, module: mod.id },
    { type: "group", steps: mod.steps || [] },
    { type: "win", module: mod.id },
    { label: "__end:" + mod.id },
    { type: "module-end", module: mod.id },
  ];
}

function planSteps(plan, step, m) {
  const uc = plan.useCase;
  const steps = [];
  const intro = step.intro || (uc && uc.intro);
  if (intro) steps.push({ type: "ai", delay: 400, text: (c) => (typeof intro === "function" ? intro(c, plan.visible) : resolveValue(intro, c)) });
  const display = (m && m.options && m.options.planDisplay) || (uc && uc.planDisplay) || "card";
  if (display === "card" && plan.visible.length > 1) {
    steps.push({ type: "card", component: "PlanCard", props: (c) => ({ title: uc ? uc.title : "Your plan", modules: plan.visible, isDone: c.isDone, active: c.module }) });
  }
  steps.push({ type: "do", run: () => m && m.startEligibleSilent() });
  plan.visible.forEach((mod) => steps.push(...moduleSteps(mod, plan.key)));
  if (uc && uc.complete) steps.push(...uc.complete);
  if (step.next !== false) steps.push({ type: "next-action" });
  return steps;
}

/* Static expansions (dev menu + jump path-finding): every module, ignoring `when`. */
EXPANDERS.usecase = (step) => {
  const uc = getUseCase(step.id);
  if (!uc) return null;
  return [{ chapter: uc.id, title: uc.title }, ...(uc.ask || []), { type: "plan", useCase: uc.id }];
};
EXPANDERS.plan = (step) => {
  const fake = { done: null, target: null };
  const plan = computePlan(step, fake, null);
  return plan.visible.flatMap((mod) => moduleSteps(mod, plan.key));
};

registerStep("usecase", (step, m, ctx) => {
  const uc = getUseCase(step.id);
  if (!uc) { console.error("[gaia-kit] use case not loaded:", step.id); return NEXT; }
  m.answers.useCase = uc.id;
  m.log("use case", uc.id, uc.title);
  m.enter([{ chapter: uc.id, title: uc.title }, ...(uc.ask || []), { type: "plan", useCase: uc.id }]);
  return JUMPED;
});

registerStep("plan", (step, m, ctx) => {
  const plan = computePlan(step, m, ctx);
  m.plan = {
    key: plan.key,
    useCase: plan.useCase,
    modules: plan.visible.map((x) => x.id),
    silent: plan.silent.map((x) => x.id),
  };
  m.log("plan", plan.key, plan.visible.map((x) => x.name).join(" → ") + (plan.silent.length ? "  (silent: " + plan.silent.map((x) => x.name).join(", ") + ")" : ""));
  m.enter(planSteps(plan, step, m));
  return JUMPED;
});

registerStep("module-start", (step, m, ctx) => {
  const mod = getModule(step.module);
  m.module = mod.id;
  m.ui = { mode: mod.ui || "full", surface: mod.surface || null };
  if (mod.available && !mod.available(m.makeCtx())) {
    m.log("locked", mod.id, mod.name);
    m.enter([...(mod.lockedSteps || []), { type: "goto", to: "__end:" + mod.id }]);
    return JUMPED;
  }
  m.log("start", mod.id, mod.name);
  return NEXT;
});

registerStep("module-end", (step, m) => { m.module = null; return NEXT; });

registerStep("win", (step, m) => {
  const id = step.module || m.module;
  if (!id || m.done.has(id)) return NEXT;
  const mod = getModule(id);
  m.done.add(id);
  m.complete(id);
  m.log("win", id, (mod && mod.win) || "done");
  m.startEligibleSilent();
  return NEXT;
});

/* Leave the current module without a win (e.g. "I'll do it later"). */
registerStep("exit-module", (step, m) => {
  const id = step.module || m.module;
  m.log("exit", id, step.reason || "no win");
  return m.goto("__end:" + id) ? JUMPED : NEXT;
});

/* Wait for a silent module's result at the point of use. Shows the rotating-sources row while it runs.
 * replay: true → if the module already finished, still play one pass of the sources before moving on. */
registerStep("await", (step, m, ctx) => {
  const mod = getModule(step.module);
  if (!mod) { console.warn("[gaia-kit] await: module not loaded:", step.module); return NEXT; }
  if (!m.bg[mod.id] && !m.done.has(mod.id)) m.startBackground(mod);
  const done = m.done.has(mod.id);
  const sources = resolveValue(step.sources, ctx) || m.brand.researchSources || [];
  const summary = resolveValue(step.summary, ctx) || ("Reviewed " + sources.length + " sources for " + (m.brand.name || "your store"));
  if (step.show === false && done) return NEXT;
  if (done && step.replay && !m.instant) {
    const replay = m.push({ kind: "research", sources, summary, tag: step.tag });
    let replayed = false;
    replay.onDone = () => { if (replayed) return; replayed = true; m.advance(); };
    m.waiting = { kind: "research" };
    return WAIT;
  }
  const item = m.push({ kind: "research", sources, summary, controlled: true, done, tag: step.tag });
  if (done || m.instant) { item.instant = true; item.done = true; return NEXT; }
  let finished = false;
  item.onDone = () => { if (finished) return; finished = true; m.advance(); };
  m.waiting = { kind: "research", bgId: mod.id, item };
  if (step.timeout) {
    m.later(() => {
      if (finished || m.done.has(mod.id)) return;
      finished = true;
      item.done = true;
      item.summary = resolveValue(step.fallbackSummary, ctx) || "Using default settings for now";
      m.log("fallback", mod.id, "silent module not ready — default used");
      m.waiting = null;
      m.enter(step.fallback || []);
      m.run();
    }, step.timeout);
  }
  return WAIT;
});

/* Switch between the full-width conversation and the Gaia sidebar (with a product placeholder). */
registerStep("ui", (step, m, ctx) => {
  m.ui = { mode: step.mode || m.ui.mode, surface: step.surface !== undefined ? resolveValue(step.surface, ctx) : m.ui.surface };
  return NEXT;
});
/* Update what the product placeholder shows / highlights (tours). */
registerStep("surface", (step, m, ctx) => {
  const prev = m.ui.surface || {};
  m.ui = { ...m.ui, surface: { ...prev, ...(resolveValue(step.surface, ctx) || {}), highlight: resolveValue(step.highlight, ctx) } };
  return NEXT;
});

/* Best next action — one plan-level rule after the last win (Notion: "Best next action").
 * 1. The use case's own `next` steps, if any.
 * 2. The first module unlocked by what was just done (path to AI Agent).  3. Otherwise end on Home.
 * (Leaving mid-flow is "Finish later" in the top bar; there's no per-module skip.) */
registerStep("next-action", (step, m, ctx) => {
  m.module = null;
  m.ui = { mode: "full", surface: null };
  const plan = m.plan || { modules: [] };
  const steps = [];
  if (plan.useCase && plan.useCase.next) {
    steps.push(...resolveValue(plan.useCase.next, ctx));
  } else {
    const offer = plan.modules
      .filter((id) => m.done.has(id))
      .flatMap((id) => (getModule(id).unlocks || []))
      .map(getModule)
      // Not done, not already attempted in this plan (declined / locked), and its preconditions hold.
      .find((mod) => mod && !m.done.has(mod.id) && mod.offer && !plan.modules.includes(mod.id)
        && (mod.offerable ? mod.offerable(m.makeCtx()) : (!mod.available || mod.available(m.makeCtx()))));
    if (offer) {
      const o = offer.offer;
      m.log("next action", offer.id, "offer " + offer.name);
      if (o.line) steps.push({ type: "ai", delay: 600, text: o.line });
      steps.push({
        type: "choice", id: "nextAction", freeform: false, delay: o.line ? 0 : 600,
        title: o.title || "Want to set up " + offer.name + " next?",
        options: [
          { key: "yes", title: o.yes || "Yes, let's do it", badge: "Recommended", then: [{ type: "plan", modules: [offer.id], intro: o.intro }] },
          { key: "no", title: o.no || "Not now", then: [{ type: "end", screen: "home" }] },
        ],
      });
    } else {
      steps.push({ type: "end", screen: "home", delay: 600 });
    }
  }
  m.enter(steps);
  return JUMPED;
});

/* ── StoryMachine additions ── */
Object.assign(StoryMachine.prototype, {
  log(type, id, label) {
    const e = { type, id, label, at: Date.now() };
    this.events = this.events.concat([e]).slice(-60);
    if (!this.instant) console.info("[gaia] " + type + (id ? " · " + id : "") + (label ? " — " + label : ""));
  },

  startBackground(mod) {
    if (this.bg[mod.id] || this.done.has(mod.id)) return;
    this.bg = { ...this.bg, [mod.id]: "running" };
    this.log("silent start", mod.id, mod.name);
    const finish = () => {
      this.bg = { ...this.bg, [mod.id]: "done" };
      this.done.add(mod.id);
      this.log("win", mod.id, (mod.win || "done") + " (silent)");
      this.startEligibleSilent();
      const w = this.waiting;
      if (w && w.bgId === mod.id && w.item) w.item.done = true; // ResearchRow settles, then advances
      this.emit();
    };
    if (this.instant) finish(); else this.later(finish, mod.duration || 5000);
  },

  startEligibleSilent() {
    if (!this.plan) return;
    this.plan.silent.forEach((id) => {
      const mod = getModule(id);
      if (!mod || this.bg[id] || this.done.has(id)) return;
      if ((mod.requires || []).every((r) => this.done.has((getModule(r) || {}).id || r))) this.startBackground(mod);
    });
  },

  setScenario(scenario) {
    this.scenario = scenario || null;
  },
});
