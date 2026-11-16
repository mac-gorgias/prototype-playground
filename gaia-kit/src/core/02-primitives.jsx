function AxButton({ variant = "primary", onClick, children, style }) {
  const [base, hover, leave] = {
    primary: [BTN_PRIMARY, BTN_PRIMARY_HOVER, BTN_PRIMARY_LEAVE],
    secondary: [BTN_SECONDARY, BTN_SECONDARY_HOVER, BTN_SECONDARY_LEAVE],
    tertiary: [BTN_TERTIARY, BTN_TERTIARY_HOVER, BTN_TERTIARY_LEAVE],
  }[variant];
  return (
    <button
      onClick={onClick}
      style={{ ...base, ...style }}
      onMouseEnter={(e) => { Object.assign(e.currentTarget.style, hover); }}
      onMouseLeave={(e) => { Object.assign(e.currentTarget.style, leave); }}
    >{children}</button>
  );
}

function AxTag({ leadingSlot, children, style }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: ACCENT_LIGHT, borderRadius: 6, padding: "5px 10px 5px 8px",
      ...style,
    }}>
      {leadingSlot}
      <span style={{ fontSize: 12, fontWeight: 500, color: ACCENT, whiteSpace: "nowrap" }}>{children}</span>
    </div>
  );
}

const GLOSSARY_TERMS_BASE = [
  { term: "automation rate", group: "automation-rate", tip: "The % of tickets AI Agent resolves without a human." },
  { term: "tone of voice", group: "tov", tip: "The style and personality AI Agent uses in replies." },
  { term: "channels", group: "channel", tip: "Where AI Agent talks to customers, like email or chat." },
  { term: "channel", group: "channel", tip: "Where AI Agent talks to customers, like email or chat." },
  { term: "intents", group: "intent", tip: "The type of request a customer is making, like an order question or return." },
  { term: "intent", group: "intent", tip: "The type of request a customer is making, like an order question or return." },
  { term: "skills", group: "skill", tip: "Step-by-step instructions AI Agent follows for a specific intent." },
  { term: "skill", group: "skill", tip: "Step-by-step instructions AI Agent follows for a specific intent." },
  { term: "actions", group: "action", tip: "Steps the AI agent can execute automatically in your connected apps, like editing an order or re-sending an item." },
];

function GlossaryTip({ tip, children }) {
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (show && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPos({ top: rect.top - 8, left: rect.left + rect.width / 2 });
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [show]);

  return (
    <span
      ref={ref}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      style={{ borderBottom: "1px dotted #8992A0", cursor: "help", position: "relative" }}
    >
      {children}
      {show && ReactDOM.createPortal(
        <div style={{
          position: "fixed", top: pos.top, left: pos.left,
          transform: "translate(-50%, " + (visible ? "-100%" : "calc(-100% + 4px)") + ")",
          opacity: visible ? 1 : 0,
          transition: "opacity .15s ease, transform .15s ease",
          background: "#1E242E", color: "#fff",
          fontSize: 12, lineHeight: 1.4, fontWeight: 450,
          padding: "6px 10px", borderRadius: 8,
          maxWidth: 260, pointerEvents: "none",
          zIndex: 99999, fontFamily: "'Inter', sans-serif",
          boxShadow: "0 4px 12px rgba(0,0,0,.15)",
        }}>{tip}</div>,
        document.body
      )}
    </span>
  );
}

function renderThreadText(text, seenTerms) {
  if (!text) return text;
  const lower = text.toLowerCase();
  const matches = [];
  GLOSSARY_TERMS_BASE.forEach((g) => {
    const key = g.group || g.term;
    if (seenTerms && seenTerms.has(key)) return;
    const idx = lower.indexOf(g.term);
    if (idx < 0) return;
    const end = idx + g.term.length;
    const before = idx === 0 ? " " : text[idx - 1];
    const after = end >= text.length ? " " : text[end];
    if (/\W/.test(before) && /\W|$/.test(after)) {
      matches.push({ start: idx, end: end, tip: g.tip, term: g.term, group: key });
    }
  });
  if (matches.length === 0) return text;
  matches.sort((a, b) => a.start - b.start);
  const filtered = [];
  for (const m of matches) {
    if (filtered.length === 0 || m.start >= filtered[filtered.length - 1].end) {
      filtered.push(m);
      if (seenTerms) seenTerms.add(m.group);
    }
  }
  const out = [];
  let cursor = 0;
  filtered.forEach((m, idx) => {
    if (cursor < m.start) out.push(<React.Fragment key={"t" + idx}>{text.slice(cursor, m.start)}</React.Fragment>);
    out.push(<GlossaryTip key={"g" + idx} tip={m.tip}>{text.slice(m.start, m.end)}</GlossaryTip>);
    cursor = m.end;
  });
  if (cursor < text.length) out.push(<React.Fragment key="tend">{text.slice(cursor)}</React.Fragment>);
  return <React.Fragment>{out}</React.Fragment>;
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (_) {
    const input = document.createElement("textarea");
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  }
}

function useCopied(duration = 1600) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);
  useEffect(() => () => clearTimeout(timerRef.current), []);
  const copy = (text) => {
    copyToClipboard(text);
    setCopied(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), duration);
  };
  return [copied, copy];
}

const CopyGlyph = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="5.5" y="5.5" width="7" height="7" rx="1.4" stroke="currentColor" strokeWidth="1.3"/><path d="M10.5 5.2V4.4A1.4 1.4 0 0 0 9.1 3H4.4A1.4 1.4 0 0 0 3 4.4v4.7a1.4 1.4 0 0 0 1.4 1.4h.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
);

const CheckGlyph = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m3.5 8.3 2.8 2.8 6.2-6.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

function UserBubble({ text }) {
  return (
    <div style={{
      marginBottom: 16, display: "flex", flexDirection: "column",
      alignItems: "flex-end", animation: "fadeInUp .35s ease-out",
    }}>
      <div style={{
        fontSize: 14, lineHeight: 1.45, color: TEXT,
        maxWidth: "85%", padding: "11px 16px", borderRadius: 14,
        background: SURFACE, fontFamily: "'Inter', sans-serif",
      }}>{text}</div>
    </div>
  );
}

/* Types several Gaia lines one after another, then calls onComplete. */

function CopyChip({ value }) {
  const [copied, copy] = useCopied();
  return (
    <button
      type="button"
      onClick={() => copy(value)}
      title={copied ? "Copied" : "Copy forwarding address"}
      aria-label={copied ? "Copied" : "Copy forwarding address " + value}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "1px 6px", margin: "0 2px", borderRadius: 4, border: 0,
        background: copied ? "#EAF7F1" : "#F2F3F5",
        color: copied ? "#147656" : ACCENT,
        fontFamily: MONO_FONT, fontSize: 13, fontWeight: 500, lineHeight: "20px",
        cursor: "pointer", verticalAlign: "baseline", transition: "background .15s, color .15s",
      }}
    >
      {value}
      <span style={{ display: "inline-flex", opacity: 0.8 }}>{copied ? <CheckGlyph /> : <CopyGlyph />}</span>
    </button>
  );
}

function VideoPlaceholder({ label }) {
  return (
    <div role="img" aria-label={label} style={{
      width: 400, height: 232, margin: "0 0 16px", borderRadius: 8, background: "#E9EAED",
      display: "grid", placeItems: "center", animation: "fadeInUp .4s cubic-bezier(.16,1,.3,1) both",
    }}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,.12))" }}><circle cx="16" cy="16" r="16" fill="#505762"/><path d="m13 10.7 8 5.3-8 5.3V10.7Z" fill="white"/></svg>
    </div>
  );
}

function SupportLine({ href, linkText }) {
  return (
    <div style={{ ...THREAD_TEXT_STYLE, marginBottom: 16, animation: "fadeInUp .35s ease-out both" }}>
      Need additional support? View{" "}
      <a href={href} target="_blank" rel="noreferrer" style={{ color: ACCENT, textUnderlineOffset: 3 }}>{linkText}</a>.
    </div>
  );
}
