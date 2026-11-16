/* ─── Gaia narration ───
 * GaiaTypedLine types `text` one character per `speed` ms, then renders it with glossary
 * tooltips (same as committed messages in the source prototype). `instant` skips typing. */
function GaiaTypedLine({ text, onComplete, speed = TIMING.typeMs, instant = false, seenTerms, style }) {
  const [typedText, setTypedText] = useState(instant ? text : "");
  const [complete, setComplete] = useState(instant);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  useEffect(() => {
    let charIndex = 0;
    let interval = null;
    let cancelled = false;
    const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finish = () => {
      if (cancelled) return;
      setTypedText(text);
      setComplete(true);
      onCompleteRef.current && onCompleteRef.current();
    };
    if (instant || reducedMotion) {
      finish();
      return () => { cancelled = true; };
    }
    setTypedText("");
    setComplete(false);
    interval = setInterval(() => {
      charIndex += 1;
      setTypedText(text.substring(0, charIndex));
      if (charIndex >= text.length) {
        clearInterval(interval);
        finish();
      }
    }, speed);
    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
    };
  }, [text, speed, instant]);

  return (
    <div style={{ marginBottom: 16, ...style }}>
      <div style={{ ...THREAD_TEXT_STYLE, whiteSpace: "pre-wrap" }}>
        {complete ? renderThreadText(text, seenTerms || new Set()) : typedText}
        {!complete && <span style={{ opacity: 0.3, animation: "pulse 1s infinite" }}>|</span>}
      </div>
    </div>
  );
}

/* Types several Gaia lines one after another, then calls onComplete. */
function GaiaTypedSequence({ lines, onComplete, speed, seenTerms }) {
  const [shownCount, setShownCount] = useState(1);
  return (
    <React.Fragment>
      {lines.slice(0, shownCount).map((line, i) => (
        <GaiaTypedLine
          key={i}
          text={line}
          speed={speed}
          seenTerms={seenTerms}
          onComplete={() => {
            if (i < lines.length - 1) setShownCount((count) => Math.max(count, i + 2));
            else if (onComplete) onComplete();
          }}
        />
      ))}
    </React.Fragment>
  );
}
