/* ─── Stick-to-bottom autoscroll ───
 * Verbatim behaviour from the 9/30 fix: follow the thread unless the user deliberately scrolled
 * up (wheel / touch / keys), snap with scrollTop (no smooth-scroll restarts per typed char),
 * and observe layout size so child-owned typing keeps the thread pinned. */
function useStickToBottom(deps) {
  const scrollRef = useRef(null);
  const contentRef = useRef(null);
  const scrolledUpRef = useRef(false);
  const intentRef = useRef(false);

  const scrollToEnd = () => {
    const el = scrollRef.current;
    if (!el || scrolledUpRef.current) return;
    intentRef.current = false;
    el.scrollTop = el.scrollHeight - el.clientHeight;
  };
  useLayoutEffect(scrollToEnd);

  useEffect(() => {
    const content = contentRef.current;
    const scroller = scrollRef.current;
    if (!content || !scroller || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(scrollToEnd);
    observer.observe(content);
    observer.observe(scroller);
    return () => observer.disconnect();
  }, deps);

  const reset = () => { scrolledUpRef.current = false; intentRef.current = false; };
  const scrollerProps = {
    ref: scrollRef,
    "data-chat-scroll": true,
    onScroll: (event) => {
      const el = event.currentTarget;
      if (el.scrollHeight - el.scrollTop - el.clientHeight <= LAYOUT.stickToBottomThreshold) reset();
      else if (intentRef.current) scrolledUpRef.current = true;
    },
    onWheel: () => { intentRef.current = true; },
    onTouchMove: () => { intentRef.current = true; },
    onKeyDown: (e) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(e.key)) intentRef.current = true;
    },
  };
  return { scrollerProps, contentRef, reset };
}

/* ─── Dev jump menu (bottom-right pill) — built from the story's chapter markers ─── */
function DevMenu({ chapters, onJump, extra }) {
  const [open, setOpen] = useState(false);
  const items = chapters.map((c) => ({ key: c.key, label: c.title, depth: c.depth, onClick: () => onJump(c.key) }))
    .concat(extra || []);
  return (
    <div style={{
      position: "fixed", bottom: 16, right: 16, zIndex: 9999,
      display: "flex", alignItems: "center", gap: 8,
      background: "rgba(30,36,46,0.92)", color: "#fff",
      fontSize: 12, fontWeight: 500, fontFamily: "'Inter', sans-serif",
      padding: "8px 14px", borderRadius: 999,
      boxShadow: "0 4px 16px rgba(0,0,0,.25)", userSelect: "none",
    }}>
      <div style={{ position: "relative" }}>
        <span
          onClick={() => setOpen((p) => !p)}
          style={{ cursor: "pointer", opacity: open ? 1 : 0.7, transition: "opacity .15s" }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
          onMouseLeave={(e) => { if (!open) e.currentTarget.style.opacity = "0.7"; }}
        >Jump to ▾</span>
        {open && (
          <div style={{
            position: "absolute", bottom: "calc(100% + 10px)", right: 0,
            background: "rgba(30,36,46,0.96)", borderRadius: 10,
            padding: "6px 0", minWidth: 220, maxHeight: "70vh", overflowY: "auto",
            boxShadow: "0 8px 24px rgba(0,0,0,.35)",
          }}>
            {items.map((item) => item.header ? (
              <div key={item.key} style={{ padding: "10px 16px 4px", fontSize: 10, letterSpacing: ".06em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>{item.label}</div>
            ) : (
              <div
                key={item.key}
                onClick={() => { setOpen(false); item.onClick(); }}
                style={{ padding: "8px 16px", paddingLeft: 16 + (item.depth || 0) * 12, cursor: "pointer", fontSize: 12, color: "#fff", transition: "background .1s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >{item.label}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Floating setup checklist (bottom-left) ─── */
function FloatingChecklist({ items, checklist, title = "Get started" }) {
  const [expanded, setExpanded] = useState(true);
  const completedCount = items.filter((item) => checklist[item.key]).length;
  const total = items.length;
  const radius = 7;
  const circumference = 2 * Math.PI * radius;
  const dashLength = (completedCount / total) * circumference;
  const allDone = completedCount === total;
  return (
    <div className="floating-checklist" style={{ position: "fixed", bottom: 40, left: 40, zIndex: 900, width: LAYOUT.checklistWidth }}>
      <div style={{
        background: "#ffffff", border: "1px solid #EBECEF", borderRadius: 14,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)", overflow: "hidden",
      }}>
        <div
          onClick={() => setExpanded((e) => !e)}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: expanded ? "14px 16px 12px" : "10px 14px",
            cursor: "pointer", userSelect: "none",
            borderBottom: expanded ? "1px solid #EBECEF" : "none",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" style={{ flexShrink: 0 }}>
            <circle cx="10" cy="10" r={radius} fill="none" stroke={allDone ? "#DFF3E6" : "#EDE8F8"} strokeWidth="2.2" />
            <circle cx="10" cy="10" r={radius} fill="none" stroke={allDone ? "#1F8A4C" : "#7E55F6"} strokeWidth="2.2"
              strokeDasharray={dashLength + " " + circumference} strokeLinecap="round" transform="rotate(-90 10 10)"
              style={{ transition: "stroke-dasharray .35s ease, stroke .25s ease" }}
            />
          </svg>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1918", fontFamily: "'Inter', sans-serif", flex: 1 }}>{title}</span>
          <span style={{ fontSize: 12, fontWeight: 400, color: "#8A8A8A", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap" }}>{completedCount} of {total}</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, transition: "transform .2s ease", transform: expanded ? "rotate(0deg)" : "rotate(-90deg)" }}>
            <path d="M3.5 5l3.5 3.5 3.5-3.5" stroke="#8A8A8A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{
          maxHeight: expanded ? 400 : 0, opacity: expanded ? 1 : 0, overflow: "hidden",
          transition: expanded ? "max-height .32s cubic-bezier(.16,1,.3,1), opacity .22s ease .06s" : "max-height .26s cubic-bezier(.7,0,.84,0), opacity .14s ease",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "14px 16px 16px" }}>
            {items.map((item) => {
              const checked = checklist[item.key];
              return (
                <div key={item.key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                    {checked ? <React.Fragment><circle cx="8" cy="8" r="7" fill="#7E55F6" /><path d="M5 8.2l2 2 4-4.4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></React.Fragment> : <circle cx="8" cy="8" r="7" fill="none" stroke="#C4C7CD" strokeWidth="1.4" />}
                  </svg>
                  <span style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.4, fontFamily: "'Inter', sans-serif", color: checked ? "#8A8A8A" : "#1E242E", textDecoration: checked ? "line-through" : "none" }}>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Thread items ─── */
function resolveComponent(c) { return typeof c === "string" ? GaiaKit[c] : c; }

function CardItem({ item, m }) {
  const step = item.step;
  const ctx = m.makeCtx();
  const resolve = (outcome) => m.resolveCard(item, outcome);
  const resolved = item.status === "resolved";
  let content = null;
  if (step.render) {
    content = step.render({ ctx, resolve, resolved, value: item.value, item });
  } else {
    const Component = resolveComponent(step.component);
    if (!Component) {
      console.warn("[gaia-kit] card component not loaded:", step.component);
      return null;
    }
    const props = { ...(resolveValue(step.props, ctx) || {}) };
    Object.entries(step.events || {}).forEach(([prop, outcome]) => { props[prop] = () => resolve(outcome); });
    if (step.resolvedProp) props[step.resolvedProp] = resolved;
    content = <Component {...props} />;
  }
  return <div style={step.style} onClick={(e) => e.stopPropagation()}>{content}</div>;
}

function ThreadItem({ item, m, seenTerms }) {
  switch (item.kind) {
    case "ai":
      return <GaiaTypedLine text={item.text} speed={item.speed} instant={item.instant} seenTerms={seenTerms} onComplete={item.onDone} />;
    case "user":
      return <UserBubble text={item.text} />;
    case "confirm":
      return <ConfirmationRow label={item.label} compact={item.compact} />;
    case "research":
      return <ResearchRow sources={item.sources} summary={item.summary} instant={item.instant} onDone={item.onDone} done={item.controlled ? !!item.done : undefined} />;
    case "card":
      return <CardItem item={item} m={m} />;
    case "connect": {
      const s = item.step;
      const ctx = m.makeCtx();
      const icon = s.icon === "shopify" ? CONNECT_PILL_ICON_SHOPIFY : s.icon === "email" ? CONNECT_PILL_ICON_EMAIL : s.icon;
      return (
        <ConnectStepCard
          pillLabel={resolveValue(s.pill, ctx)}
          pillIcon={icon}
          heading={resolveValue(s.heading, ctx)}
          body={resolveValue(s.body, ctx)}
          connectLabel={resolveValue(s.connectLabel, ctx)}
          doneLabel={resolveValue(s.doneLabel, ctx) || "I'm done"}
          url={resolveValue(s.url, ctx)}
          secondaryLabel={resolveValue(s.secondaryLabel, ctx)}
          onSecondary={s.onSecondary ? () => m.connectSecondary(item) : undefined}
          onConnected={() => m.finishConnect(item)}
        />
      );
    }
    default:
      return null;
  }
}

/* ─── Composer slot ─── */
const WAIT_KEYS = new WeakMap();
let waitKeySeq = 0;
function waitKey(w) {
  if (!WAIT_KEYS.has(w)) WAIT_KEYS.set(w, "w" + (++waitKeySeq));
  return WAIT_KEYS.get(w);
}

function Composer({ m, story }) {
  const w = m.waiting || { kind: "timer" };
  const ctx = m.makeCtx();
  const [text, setText] = useState("");
  const [freeform, setFreeform] = useState("");
  const stepKey = waitKey(w);
  useEffect(() => { setFreeform(""); }, [w.step]);

  // Put the cursor in the composer when Gaia asks for typed input.
  useEffect(() => {
    if (w.kind !== "input") return;
    const t = setTimeout(() => {
      const input = document.querySelector("input[data-chat-input]");
      if (input) input.focus();
    }, 50);
    return () => clearTimeout(t);
  }, [w.kind, w.step]);

  const panel = m.panel && !m.panel.closing ? m.panel : null;
  const thinking = ["typing", "timer", "research"].includes(w.kind) || (w.kind === "card" && w.hold);

  const chatBar = ({ placeholder, onSubmit, isThinking }) => {
    const sendDisabled = isThinking || !text.trim();
    const submit = () => { if (sendDisabled) return; const t = text.trim(); setText(""); onSubmit(t); };
    return (
      <ChatInputBar
        value={text}
        onChange={(e) => setText(e.target.value)}
        onSend={submit}
        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
        placeholder={placeholder}
        sendDisabled={sendDisabled}
        thinking={isThinking}
      />
    );
  };

  if (panel && panel.name === "edit") {
    const skill = brand().skills && brand().skills[panel.props.skillIdx];
    return chatBar({
      placeholder: (skill && skill.editPlaceholder) || GaiaKit.EDIT_PLACEHOLDER_DEFAULT || "Tell us how you'd like AI Agent to handle this use case…",
      isThinking: false,
      onSubmit: (t) => m.freeChat(t, "Got it — I'll update the skill instructions to reflect that.", TIMING.editChatReplyMs),
    });
  }

  if (w.kind === "choice") {
    const step = w.step;
    if (step.variant === "yesno") {
      return <YesNoCard title={resolveValue(step.title, ctx)} options={w.options} onSelect={(key) => m.respond(key)} />;
    }
    const allowFreeform = step.freeform !== false;
    return (
      <QuestionCard
        key={stepKey}
        title={resolveValue(step.title, ctx)}
        subtitle={resolveValue(step.subtitle, ctx)}
        options={w.options}
        onSelect={(key) => m.respond(key)}
        onClose={null}
        hideFreeform={!allowFreeform}
        freeformValue={freeform}
        onFreeformChange={setFreeform}
        onFreeformSubmit={() => { const t = freeform.trim(); if (t) { setFreeform(""); m.respond(null, t); } }}
      />
    );
  }

  if (w.kind === "multi") {
    const step = w.step;
    const selected = Object.values(w.toggles).filter(Boolean).length;
    const confirm = () => { if (selected) m.respond(); };
    return (
      <SkillPickerCard
        title={resolveValue(step.title, ctx) || undefined}
        confirmLabel={resolveValue(step.confirmLabel, ctx) || null}
        options={w.options.map((o) => ({ key: o.key, label: o.label || o.title }))}
        toggles={w.toggles}
        onToggle={(key) => m.toggle(key)}
        onConfirm={confirm}
        onClose={null}
        frozen={false}
        hideFreeform={step.freeform === false}
        freeformValue={freeform}
        onFreeformChange={setFreeform}
        onFreeformSubmit={confirm}
      />
    );
  }

  if (w.kind === "input") {
    return chatBar({
      placeholder: resolveValue(w.step.placeholder, ctx) || "Type your answer...",
      isThinking: false,
      onSubmit: (t) => m.respond(t),
    });
  }

  return chatBar({
    placeholder: "Send a message...",
    isThinking: thinking,
    onSubmit: (t) => m.freeChat(t, story.freeChatReply || "Got it — I'll factor that in. Want to keep going?", TIMING.freeChatReplyMs),
  });
}

/* ─── App shell ─── */
function GaiaApp({ story, brand: brandData, startAt, scenario }) {
  const [, force] = useState(0);
  const machineRef = useRef(null);
  if (!machineRef.current) {
    machineRef.current = new StoryMachine({ story, brand: brandData, onChange: () => force((v) => v + 1) });
    machineRef.current.options = { planDisplay: story.planDisplay || "card" };
    const sc = (story.scenarios || []).find((x) => x.key === scenario);
    if (sc) { machineRef.current.setScenario(sc); machineRef.current.reset(); }
  }
  const [showEvents, setShowEvents] = useState(false);
  const m = machineRef.current;
  const chapters = React.useMemo(() => chaptersOf(story), [story]);
  const scroll = useStickToBottom([m.epoch, !!m.screen, m.overlay && m.overlay.name]);

  useEffect(() => {
    if (startAt) m.jump(startAt); else m.run();
    return () => m.dispose();
  }, []);

  const jump = (key) => { scroll.reset(); m.jump(key); };
  const ctx = m.makeCtx();
  const homeConfig = story.home || {};
  const hasHome = !!GaiaKit.HomePage && story.home !== false;
  const devExtra = [];
  if (hasHome) devExtra.push({ key: "__home", label: "Home (Finish later)", onClick: () => m.showHome({ resume: null }) });
  if (story.scenarios && story.scenarios.length) {
    devExtra.push({ key: "__sc", header: true, label: "Account state" });
    story.scenarios.forEach((sc) => devExtra.push({
      key: "__sc:" + sc.key,
      label: ((m.scenario ? m.scenario.key : story.scenarios[0].key) === sc.key ? "● " : "○ ") + sc.title,
      onClick: () => { m.setScenario(sc); jump(chapters.some((c) => c.key === (story.scenarioRestartAt || "goal")) ? (story.scenarioRestartAt || "goal") : null); },
    }));
  }
  devExtra.push({ key: "__opt", header: true, label: "Prototype options" });
  devExtra.push({ key: "__plan", label: "Plan display: " + m.options.planDisplay + " (switch)", onClick: () => { m.options = { ...m.options, planDisplay: m.options.planDisplay === "card" ? "line" : "card" }; m.emit(); } });
  devExtra.push({ key: "__events", label: (showEvents ? "Hide" : "Show") + " module events", onClick: () => setShowEvents((v) => !v) });
  const devMenu = story.devMenu === false ? null : <DevMenu chapters={chapters} onJump={jump} extra={devExtra} />;

  // Full-page screens
  if (m.screen && m.screen.name === "signup") {
    const Signup = GaiaKit.SignupScreen;
    return <React.Fragment>{devMenu}<Signup onSubmit={() => m.finishScreen()} /></React.Fragment>;
  }
  // Home sits on top of the thread instead of replacing it, so in-flight typing keeps going.
  let homeLayer = null;
  if (m.overlay && m.overlay.name === "home" && hasHome) {
    const props = m.overlay.props || {};
    const notShopify = homeConfig.onNotShopify;
    const Home = GaiaKit.HomePage;
    homeLayer = (
      <div style={{ position: "fixed", inset: 0, zIndex: 1000, width: "100vw", height: "100vh", display: "flex", background: "#fafafa", overflow: "hidden" }}>
        <Home
          onContinueSetup={() => { scroll.reset(); m.continueFromHome(); }}
          onNotShopify={() => { scroll.reset(); if (notShopify) m.overlayAction(notShopify); else m.continueFromHome(); }}
          hideSetupBanner={props.hideSetupBanner != null ? props.hideSetupBanner : !!resolveValue(homeConfig.hideSetupBanner, ctx)}
        />
      </div>
    );
  }

  const panel = m.panel;
  const panelOpen = !!panel && !panel.closing;
  const contentRightMargin = panelOpen ? LAYOUT.contentRightMarginOpen + "px" : LAYOUT.contentInset + "px";
  const introShowing = m.screen && m.screen.name === "intro";
  const closingShown = m.overlay && m.overlay.name === "closing";
  const seenTerms = new Set();
  const planItems = m.plan ? m.plan.modules.map((id) => { const mod = getModule(id); return { key: id, label: mod.checklist || mod.name }; }) : null;
  const checklistItems = planItems || story.checklist || [];
  const checklistState = planItems ? Object.fromEntries(m.plan.modules.map((id) => [id, m.done.has(id)])) : m.checklist;
  const showChecklist = checklistItems.length > 0 && !introShowing && !closingShown && !panel
    && (planItems ? true : (story.showChecklist ? story.showChecklist(ctx) : true));
  const sidebar = m.ui && m.ui.mode === "sidebar" && !introShowing && !closingShown;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
  const PanelComponent = panel ? GaiaKit[{ preview: "PreviewPanel", edit: "EditPanel" }[panel.name] || panel.name] : null;

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", background: "#fafafa", overflow: "hidden" }}>
      {devMenu}
      {homeLayer}
      {showEvents && <EventsPanel events={m.events} />}

      {/* Sidebar mode: product placeholder takes the middle, Gaia docks to the right. */}
      <div style={{
        flexGrow: sidebar ? 1 : 0, flexShrink: 1, flexBasis: 0, minWidth: 0, overflow: "hidden", position: "relative",
        background: "#ffffff", borderRadius: LAYOUT.contentRadius, border: sidebar ? LAYOUT.contentBorder : "none",
        marginTop: LAYOUT.contentInset, marginBottom: LAYOUT.contentInset, marginLeft: sidebar ? LAYOUT.contentInset : 0,
        opacity: sidebar ? 1 : 0, transition: "flex-grow .45s cubic-bezier(.16,1,.3,1), opacity .3s ease, margin .45s ease",
      }}>
        {sidebar && <SurfacePlaceholder surface={m.ui.surface} />}
      </div>

      <div
        onClick={() => { if (panel && !panel.closing) m.closePanel(); }}
        style={{
          flex: 1, maxWidth: sidebar ? LAYOUT.gaiaSidebarWidth : vw,
          display: "flex", flexDirection: "column", overflow: "hidden",
          background: "#ffffff", borderRadius: LAYOUT.contentRadius,
          marginTop: LAYOUT.contentInset, marginBottom: LAYOUT.contentInset, marginLeft: sidebar ? LAYOUT.sidebarGap : LAYOUT.contentInset,
          marginRight: contentRightMargin,
          transition: "margin-right .2s ease, max-width .45s cubic-bezier(.16,1,.3,1), margin-left .45s ease",
          border: LAYOUT.contentBorder,
          position: "relative",
        }}
      >
        {introShowing && (
          <WelcomeIntroGate onDone={() => m.finishScreen()} />
        )}

        {!introShowing && !closingShown && hasHome && story.finishLater !== false && (
          <div
            onClick={() => m.showHome({ resume: null })}
            style={{
              position: "absolute", top: 16, right: 20, zIndex: 4,
              fontSize: 14, fontWeight: 600, color: "#1E242E", fontFamily: "'Inter', sans-serif",
              cursor: "pointer", padding: "0 12px", height: 32, lineHeight: "32px", borderRadius: 8,
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
              border: "none", transition: "background .15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.95)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.85)"; }}
          >Finish later</div>
        )}

        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: LAYOUT.fadeHeight, background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.72) 100%)", zIndex: 2, pointerEvents: "none" }} />
          <div {...scroll.scrollerProps} style={{ height: "100%", overflowY: "auto", overflowAnchor: "none", padding: LAYOUT.threadPadding }}>
            <div ref={scroll.contentRef} style={{ maxWidth: LAYOUT.threadMaxWidth, margin: "0 auto", padding: "0 " + LAYOUT.columnPadX + "px" }}>
              {m.items.map((item) => <ThreadItem key={item.id} item={item} m={m} seenTerms={seenTerms} />)}
            </div>
          </div>
        </div>

        {!closingShown && (
          <div onClick={(e) => e.stopPropagation()} style={{ padding: LAYOUT.composerPadding, position: "relative", background: "#ffffff" }}>
            <div style={{ maxWidth: LAYOUT.threadMaxWidth, margin: "0 auto" }}>
              {m.canSkip() && (
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                  <span
                    onClick={() => m.skipModule()}
                    style={{ fontSize: 13, color: TEXT_MUTED, cursor: "pointer", fontFamily: "'Inter', sans-serif" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#1E242E"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = TEXT_MUTED; }}
                  >Skip for now</span>
                </div>
              )}
              <Composer m={m} story={story} />
            </div>
          </div>
        )}

        {closingShown && GaiaKit.ClosingScreen && (
          <ClosingScreenSlot props={m.overlay.props} />
        )}
      </div>

      {showChecklist && <FloatingChecklist key={m.plan ? m.plan.key : "story"} items={checklistItems} checklist={checklistState} title={(m.plan && m.plan.useCase && m.plan.useCase.title) || story.checklistTitle} />}

      {panel && PanelComponent && (
        <PanelComponent
          key={panel.name + ":" + panel.props.skillIdx}
          {...panel.props}
          onClose={() => m.closePanel()}
          closing={panel.closing}
          skipSlideIn={!!m.prevPanel}
          skillAnswers={{}}
        />
      )}
    </div>
  );
}

/* Dev: module events (plan, start, win, skip, silent, fallback) — what the real product would log. */
function EventsPanel({ events }) {
  return (
    <div style={{
      position: "fixed", right: 16, bottom: 60, zIndex: 9998, width: 360, maxHeight: "45vh", overflowY: "auto",
      background: "rgba(30,36,46,0.94)", color: "#fff", borderRadius: 10, padding: "10px 12px",
      fontFamily: MONO_FONT, fontSize: 11, lineHeight: 1.5, boxShadow: "0 8px 24px rgba(0,0,0,.35)",
    }}>
      {events.length === 0 && <div style={{ opacity: 0.6 }}>No module events yet.</div>}
      {events.slice().reverse().map((e, i) => (
        <div key={i} style={{ marginBottom: 4 }}>
          <span style={{ color: e.type === "win" ? "#7CE0B0" : e.type === "skip" || e.type === "fallback" || e.type === "locked" ? "#FFC27A" : "#B9A6FF" }}>{e.type}</span>
          {e.id ? <span style={{ opacity: 0.7 }}> {e.id}</span> : null}
          {e.label ? <div style={{ opacity: 0.85, paddingLeft: 8 }}>{e.label}</div> : null}
        </div>
      ))}
    </div>
  );
}

/* WelcomeIntro + its 500ms fade-out, then the thread starts. */
function WelcomeIntroGate({ onDone }) {
  const [closing, setClosing] = useState(false);
  const Intro = GaiaKit.WelcomeIntro;
  return (
    <Intro
      closing={closing}
      onStartSetup={() => {
        if (closing) return;
        setClosing(true);
        setTimeout(onDone, TIMING.introClose);
      }}
    />
  );
}

function ClosingScreenSlot({ props }) {
  const Closing = GaiaKit.ClosingScreen;
  return <Closing onAction1={() => {}} onAction2={() => {}} {...props} />;
}

class GaiaErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) {
    console.error("REACT_CRASH:", error.message);
    console.error("COMPONENT_STACK:", info.componentStack);
  }
  render() {
    if (this.state.error) {
      return React.createElement("div", { style: { color: "red", padding: 40, fontSize: 16, fontFamily: "monospace", whiteSpace: "pre-wrap" } },
        "React Error: " + this.state.error.message + "\n\nCheck browser console for details.");
    }
    return this.props.children;
  }
}

/* ─── Public entry point ───
 * GaiaKit.mount({ story, brand, root?, startAt? })
 * `?chapter=<name>` in the URL also sets startAt, so you can share a link straight to a chapter. */
function mount({ story, brand: brandData, root = "#root", startAt, scenario } = {}) {
  if (!story) throw new Error("[gaia-kit] mount() needs a story");
  const b = brandData || (window.GaiaBrands && window.GaiaBrands.urbanstems) || {};
  GaiaKit.brand = b;
  if (story.title) document.title = story.title;
  const params = new URLSearchParams(window.location.search);
  const start = params.get("chapter") || startAt || story.startAt || null;
  const sc = params.get("scenario") || scenario || null;
  const el = typeof root === "string" ? document.querySelector(root) : root;
  window.addEventListener("error", (e) => {
    if (!e.lineno && !e.colno) return;
    const d = document.createElement("div");
    d.style.cssText = "position:fixed;top:0;left:0;right:0;padding:20px;background:red;color:white;font:14px monospace;z-index:99999;white-space:pre-wrap";
    d.textContent = "JS ERROR: " + e.message + " (line " + e.lineno + ")";
    document.body.appendChild(d);
  });
  ReactDOM.createRoot(el).render(
    <GaiaErrorBoundary><GaiaApp story={story} brand={b} startAt={start} scenario={sc} /></GaiaErrorBoundary>
  );
}
