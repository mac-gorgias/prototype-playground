/* ─── Research row ───
 * Slot-machine of sources while running, then a collapsible "Reviewed N sources" summary.
 * Lifted from IntakePage (research effect + thread JSX). Calls onDone once when finished. */
function ResearchRow({ sources, summary, instant = false, onDone, done }) {
  // `done` undefined → timed run (one pass through sources). Boolean → controlled: keep cycling until done.
  const controlled = done !== undefined;
  const [phase, setPhase] = useState(instant ? "done" : "running");
  const [expanded, setExpanded] = useState(!instant);
  const [rotatingIndex, setRotatingIndex] = useState(0);
  const [rotatingTransition, setRotatingTransition] = useState("in");
  const onDoneRef = useRef(onDone);
  useEffect(() => { onDoneRef.current = onDone; }, [onDone]);

  const settle = (cancelledRef) => {
    setTimeout(() => {
      if (cancelledRef.current) return;
      setRotatingTransition("in");
      setPhase("done");
      setExpanded(false);
      onDoneRef.current && onDoneRef.current();
    }, TIMING.researchSettleMs);
  };

  useEffect(() => {
    if (instant) { onDoneRef.current && onDoneRef.current(); return; }
    const cancelled = { current: false };
    let idx = 0;
    const reducedMotion = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;
    const DISPLAY_DURATION = reducedMotion ? 2000 : TIMING.researchSourceMs;
    const timers = [];
    const timer = setInterval(() => {
      if (cancelled.current) return;
      idx++;
      if (idx >= sources.length) {
        if (controlled) { idx = 0; } else {
          clearInterval(timer);
          setRotatingIndex(sources.length - 1);
          settle(cancelled);
          return;
        }
      }
      if (reducedMotion) {
        setRotatingIndex(idx);
      } else {
        setRotatingTransition("out");
        const next = idx;
        timers.push(setTimeout(() => {
          if (!cancelled.current) { setRotatingIndex(next); setRotatingTransition("in"); }
        }, TIMING.researchTransitionMs));
      }
    }, DISPLAY_DURATION);
    return () => { cancelled.current = true; clearInterval(timer); timers.forEach(clearTimeout); };
  }, []);

  // Controlled: the background task finished → settle into the summary.
  useEffect(() => {
    if (!controlled || !done || instant || phase === "done") return;
    const cancelled = { current: false };
    settle(cancelled);
    return () => { cancelled.current = true; };
  }, [done]);

  const favicon = (src, size, radius) => (
    <img
      src={"https://www.google.com/s2/favicons?domain=" + src.favicon + "&sz=32"}
      alt="" style={{ width: size, height: size, borderRadius: radius, flexShrink: 0, display: "block" }}
    />
  );

  return (
    <div style={{ marginBottom: 16, animation: "fadeInUp .4s cubic-bezier(.16,1,.3,1) forwards" }}>
      {phase === "running" && (() => {
        const src = sources[rotatingIndex] || sources[0];
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", height: 36, overflow: "hidden" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: "spin 1s linear infinite", flexShrink: 0 }}>
              <circle cx="8" cy="8" r="6" fill="none" stroke={BORDER} strokeWidth="1.5" />
              <path d="M8 2a6 6 0 0 1 6 6" fill="none" stroke={TEXT_MUTED} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div className="slot-rotate-item" style={{ flex: 1, minWidth: 0, height: 20, overflow: "hidden", position: "relative" }}>
              <div key={rotatingIndex} style={{
                display: "flex", alignItems: "center", gap: 8,
                position: "absolute", top: 0, left: 0, right: 0,
                animation: rotatingTransition === "in"
                  ? "slotSlideIn 0.3s cubic-bezier(.16,1,.3,1) forwards"
                  : "slotSlideOut 0.3s cubic-bezier(.5,0,.7,1) forwards",
              }}>
                {favicon(src, 16, 3)}
                <span style={{ fontSize: 13, color: TEXT_MUTED, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{src.title}</span>
              </div>
            </div>
          </div>
        );
      })()}

      {phase === "done" && (
        <div>
          <div
            onClick={() => setExpanded((p) => !p)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setExpanded((p) => !p); }
            }}
            aria-expanded={expanded}
            style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "8px 0", userSelect: "none" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="8" cy="8" r="7" fill={SURFACE} />
              <path d="M5 8.5l2 2 4-4" stroke={TEXT_MUTED} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 13, color: TEXT_MUTED, flex: 1 }}>{summary}</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{
              transition: "transform .2s", transform: expanded ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0,
            }}>
              <path d="M4 5.5l3 3 3-3" stroke={TEXT_MUTED} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {expanded && (
            <div style={{ padding: "4px 0 8px 4px", display: "flex", flexDirection: "column", gap: 2 }}>
              {sources.map((src, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 8px", borderRadius: 8 }}>
                  {favicon(src, 18, 4)}
                  <span style={{ fontSize: 13, color: TEXT_MUTED, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{src.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Yes / No confirm card (composer slot) ───
 * The "Does this look better?" card from the ToV revision loop. options: [{ key, title, icon: "check" | "cross" }] */
function YesNoCard({ title, options, onSelect }) {
  return (
    <div style={{
      animation: "fadeInUp .35s ease-out",
      border: "1px solid " + BORDER, borderRadius: 8, background: "#ffffff", overflow: "hidden",
    }}>
      <div style={{ padding: "14px 18px 12px", fontSize: 14, fontWeight: 600, color: TEXT, borderBottom: "1px solid " + BORDER }}>
        {title}
      </div>
      {options.map((opt, oi, arr) => (
        <div key={opt.key}
          onClick={() => onSelect(opt.key)}
          style={{
            padding: "12px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
            transition: "background .15s",
            borderBottom: oi < arr.length - 1 ? "1px solid " + BORDER : "none",
            background: CARD_BG,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = SURFACE; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = CARD_BG; }}
        >
          <div style={{
            width: 26, height: 26, borderRadius: 6, background: "transparent", border: "1px solid " + BORDER,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            {(opt.icon || (oi === 0 ? "check" : "cross")) === "check" ? (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5l3 3 6-6.5" stroke={TEXT_MUTED} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke={TEXT_MUTED} strokeWidth="1.4" strokeLinecap="round" /></svg>
            )}
          </div>
          <span style={{ fontSize: 14, color: TEXT, fontFamily: "'Inter', sans-serif" }}>{opt.title}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Connect step card ───
 * Two-click pattern from the source: first click opens the OAuth/app URL in a new tab and the
 * button becomes "I'm done"; second click confirms. */
function ConnectStepCard({ pillLabel, pillIcon, heading, body, connectLabel, doneLabel = "I'm done", url, secondaryLabel, onSecondary, onConnected }) {
  const [clicked, setClicked] = useState(false);
  return (
    <div style={{ marginBottom: 16 }} onClick={(e) => e.stopPropagation()}>
      <ConnectCard
        pillLabel={pillLabel}
        pillIcon={pillIcon}
        heading={heading}
        body={body}
        primaryLabel={clicked ? doneLabel : connectLabel}
        onPrimary={() => {
          if (clicked || !url) { onConnected(); return; }
          window.open(url, "_blank");
          setClicked(true);
        }}
        secondaryLabel={secondaryLabel}
        onSecondary={onSecondary}
      />
    </div>
  );
}
