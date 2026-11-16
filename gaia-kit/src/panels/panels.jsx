const EDIT_PLACEHOLDER_DEFAULT = "Tell us how you'd like AI Agent to handle this use case…";

function matchScriptedIntent(text) {
  if (!text) return null;
  const lower = text.toLowerCase();
  for (let i = 0; i < (brand().scriptedIntents || []).length; i++) {
    const intent = (brand().scriptedIntents || [])[i];
    for (let j = 0; j < intent.keywords.length; j++) {
      if (lower.indexOf(intent.keywords[j]) !== -1) return intent;
    }
  }
  return null;
}

/* Render plain text with one substring bolded (used for the "9 skills" inline bold) */

function PreviewPanel({ skillIdx, onClose, closing, skipSlideIn }) {
  const skill = brand().skills[skillIdx];
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState([]);
  const [thinkingStepIdx, setThinkingStepIdx] = useState(0);
  const [expandedReasoning, setExpandedReasoning] = useState({});
  const pendingIntentRef = useRef(null);
  const threadRef = useRef(null);
  const preloadFiredRef = useRef(false);

  useEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [messages, sending]);

  const doAssistantReply = useCallback((text) => {
    const intent = matchScriptedIntent(text);
    pendingIntentRef.current = intent;
    const sk = skill.thinkingSteps ? skill : null;
    const steps = sk && sk.thinkingSteps && sk.thinkingSteps.length ? sk.thinkingSteps : ["Thinking..."];
    setThinkingSteps(steps);
    setThinkingStepIdx(0);
    setSending(true);
  }, [skill.skillId]);

  useEffect(() => {
    if (!sending || thinkingSteps.length === 0) return;
    const timer = setTimeout(() => {
      if (thinkingStepIdx < thinkingSteps.length - 1) {
        setThinkingStepIdx((i) => i + 1);
      } else {
        const intent = pendingIntentRef.current;
        const response = intent === null
          ? "I'm not able to answer that just yet — but I'll get smarter the more you teach me."
          : intent.response;
        setMessages((prev) => [...prev, { role: "assistant", text: response }]);
        setSending(false);
        setThinkingSteps([]);
        setThinkingStepIdx(0);
        pendingIntentRef.current = null;
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [sending, thinkingStepIdx, thinkingSteps]);

  const sendMessage = useCallback((text) => {
    if (!text || sending) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setTimeout(() => doAssistantReply(text), 80);
  }, [sending, doAssistantReply]);

  useEffect(() => {
    if (!skill.preload || preloadFiredRef.current) return;
    preloadFiredRef.current = true;
    setMessages([{ role: "user", text: skill.preload }]);
    setTimeout(() => doAssistantReply(skill.preload), 80);
  }, [skill.preload, doAssistantReply]);

  const resetConversation = () => {
    setMessages([]);
    setSending(false);
    setThinkingSteps([]);
    setThinkingStepIdx(0);
    setExpandedReasoning({});
    setInput("");
    preloadFiredRef.current = false;
    setTimeout(() => {
      if (skill.preload) {
        preloadFiredRef.current = true;
        setMessages([{ role: "user", text: skill.preload }]);
        setTimeout(() => doAssistantReply(skill.preload), 80);
      }
    }, 100);
  };

  const iconBtnStyle = {
    width: 28, height: 28, borderRadius: 6, border: "none", background: "transparent",
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0,
    color: TEXT_MUTED, transition: "background .15s",
  };

  return (
    <div style={{
      position: "fixed", top: 16, right: 16, bottom: 16, width: 500,
      zIndex: 1000, background: "#ffffff",
      border: "1px solid #EBECEF", borderRadius: 16,
      display: "flex", flexDirection: "column",
      animation: closing
        ? "slideOutRight .2s ease forwards"
        : (skipSlideIn ? "none" : "slideInRight .2s ease-out forwards"),
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 16px", borderBottom: "1px solid #EBECEF", flexShrink: 0,
      }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: TEXT }}>Test</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button style={iconBtnStyle}
            onMouseEnter={(e) => { e.currentTarget.style.background = SURFACE; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 10a2 2 0 100-4 2 2 0 000 4z" stroke={TEXT_MUTED} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13.05 10a1.14 1.14 0 00.23 1.26l.04.04a1.38 1.38 0 11-1.96 1.96l-.04-.04a1.14 1.14 0 00-1.26-.23 1.14 1.14 0 00-.69 1.05v.11a1.38 1.38 0 11-2.76 0v-.06A1.14 1.14 0 005.95 13a1.14 1.14 0 00-1.26.23l-.04.04a1.38 1.38 0 11-1.96-1.96l.04-.04A1.14 1.14 0 002.96 10a1.14 1.14 0 00-1.05-.69h-.11a1.38 1.38 0 110-2.76h.06A1.14 1.14 0 003 5.95a1.14 1.14 0 00-.23-1.26l-.04-.04A1.38 1.38 0 114.7 2.7l.04.04a1.14 1.14 0 001.26.23h.06a1.14 1.14 0 00.69-1.05v-.11a1.38 1.38 0 112.76 0v.06a1.14 1.14 0 00.69 1.05 1.14 1.14 0 001.26-.23l.04-.04a1.38 1.38 0 111.96 1.96l-.04.04a1.14 1.14 0 00-.23 1.26v.06a1.14 1.14 0 001.05.69h.11a1.38 1.38 0 110 2.76h-.06a1.14 1.14 0 00-1.05.69z" stroke={TEXT_MUTED} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button onClick={resetConversation} style={iconBtnStyle}
            onMouseEnter={(e) => { e.currentTarget.style.background = SURFACE; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1.33 2.67v4h4" stroke={TEXT_MUTED} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2.34 10a5.33 5.33 0 109.18-4.52 5.33 5.33 0 00-8.17-.83L1.33 6.67" stroke={TEXT_MUTED} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button onClick={onClose} style={iconBtnStyle}
            onMouseEnter={(e) => { e.currentTarget.style.background = SURFACE; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 3l8 8M11 3l-8 8" stroke={TEXT_MUTED} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={threadRef} style={{ flex: 1, overflowY: "auto", padding: "20px 20px 12px", display: "flex", flexDirection: "column", gap: 0 }}>
        <div style={{ flex: 1 }} />

        {messages.map((msg, i) => {
          const isLastAssistant = msg.role === "assistant" && !messages.slice(i + 1).some(m => m.role === "assistant");
          return (
            <div key={i}>
              {msg.role === "user" ? (
                <div style={{ padding: "12px 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", background: "#E8E8E8",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 600, color: TEXT_MUTED, flexShrink: 0,
                    }}>S</div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>Sarah</span>
                  </div>
                  <div style={{ fontSize: 14, color: TEXT, lineHeight: "20px", paddingLeft: 36 }}>{msg.text}</div>
                </div>
              ) : (
                <div style={{ padding: "12px 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <img src={asset("ai-agent-avatar.png")} alt="" style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0 }} draggable={false} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: ACCENT }}>AI Agent</span>
                  </div>
                  <div style={{ fontSize: 14, color: TEXT, lineHeight: "20px", paddingLeft: 36 }}>{msg.text}</div>

                  {isLastAssistant && (
                    <React.Fragment>
                      {/* Show reasoning toggle */}
                      <div
                        onClick={() => setExpandedReasoning((prev) => ({ ...prev, [i]: !prev[i] }))}
                        style={{
                          display: "flex", alignItems: "center", gap: 4, marginTop: 12, paddingLeft: 36,
                          cursor: "pointer", fontSize: 13, color: TEXT_MUTED, userSelect: "none",
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                          style={{ transform: expandedReasoning[i] ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .15s" }}>
                          <path d="M3 4.5l3 3 3-3" stroke={TEXT_MUTED} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Show reasoning
                      </div>
                      {expandedReasoning[i] && (
                        <div style={{
                          marginTop: 8, marginLeft: 36, padding: "8px 12px", background: "#F8F8F8", borderRadius: 8,
                          fontSize: 13, color: TEXT_MUTED, lineHeight: "18px",
                        }}>
                          The AI Agent matched the customer's message to the "{skill.title}" skill and generated a response based on the configured instructions and connected data sources.
                        </div>
                      )}
                    </React.Fragment>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Thinking indicator */}
        {sending && thinkingSteps.length > 0 && (
          <div style={{ padding: "12px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <img src={asset("ai-agent-avatar.png")} alt="" style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0 }} draggable={false} />
              <span style={{ fontSize: 13, fontWeight: 600, color: ACCENT }}>AI Agent</span>
            </div>
            <div style={{
              fontSize: 14, fontStyle: "italic", paddingLeft: 36,
              background: "linear-gradient(90deg, " + TEXT_MUTED + " 40%, rgba(138,138,138,0.3) 50%, " + TEXT_MUTED + " 60%)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              animation: "shimmerSlide 2s linear infinite",
            }}>Thinking...</div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div style={{ padding: "12px 16px 16px", borderTop: "1px solid #EBECEF", flexShrink: 0 }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input.trim()); } }}
          placeholder="Write your message..."
          disabled={sending}
          rows={3}
          style={{
            width: "100%", border: "1px solid #EBECEF", borderRadius: 8, padding: "10px 12px",
            fontSize: 14, fontFamily: "'Inter', sans-serif", color: TEXT, resize: "none",
            outline: "none", background: "#fff", lineHeight: "20px",
          }}
          onFocus={(e) => { e.target.style.borderColor = "#C4C4C4"; }}
          onBlur={(e) => { e.target.style.borderColor = "#EBECEF"; }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
          <button
            onClick={() => { if (input.trim()) sendMessage(input.trim()); }}
            disabled={sending || !input.trim()}
            style={{
              padding: "4px 12px", borderRadius: 6, border: "none",
              background: sending || !input.trim() ? "#E8E8E8" : ACCENT,
              color: sending || !input.trim() ? TEXT_MUTED : "#fff",
              fontSize: 13, fontWeight: 600, cursor: sending || !input.trim() ? "default" : "pointer",
              fontFamily: "'Inter', sans-serif",
            }}
          >Send</button>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ cursor: "pointer", color: TEXT_MUTED }}>
            <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="6.5" cy="7.5" r="1" fill="currentColor" />
            <circle cx="11.5" cy="7.5" r="1" fill="currentColor" />
            <path d="M6 11.5a3.5 3.5 0 006 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ cursor: "pointer", color: TEXT_MUTED }}>
            <path d="M14.5 8.5l-5.8 5.8a3.2 3.2 0 01-4.5-4.5l5.8-5.8a2.1 2.1 0 013 3L7.2 12.8a1.1 1.1 0 01-1.5-1.5L11 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function EditPanel({ skillIdx, onClose, closing, skipSlideIn, skillAnswers }) {
  const skill = brand().skills[skillIdx];
  const isOrderTracking = skill.key === "tracking";
  const isOrderCancellation = skill.key === "cancellations";
  const isPromo = skill.key === "promo";
  const isDamaged = skill.key === "damaged";
  const isReturns = skill.key === "returns";
  const isMissing = skill.key === "items-missing";
  const isProductEdits = skill.key === "product-edits";
  const isFeedback = skill.key === "feedback";
  const isMarketing = skill.key === "marketing";
  const hasInstructions = isOrderCancellation || isOrderTracking || isPromo || isDamaged || isReturns || isMissing || isProductEdits || isFeedback || isMarketing;
  const confirmedStyle = { background: "#DFF3E6", color: "#1F8A4C", padding: "1px 6px", borderRadius: 4, fontWeight: 500 };
  const placeholderStyle = { background: "#FFF3E6", color: "#E67E22", padding: "1px 6px", borderRadius: 4, fontWeight: 500, fontSize: 13 };
  const dataFieldStyle = { background: SURFACE, padding: "1px 6px", borderRadius: 4, fontSize: 13 };
  const [isEditingInstructions, setIsEditingInstructions] = useState(false);

  const cancellationWindow = skillAnswers.cancellation_window_hours;
  const cancellationWindowDisplay = cancellationWindow || "set value";
  const cancellationWindowStyle = cancellationWindow ? confirmedStyle : placeholderStyle;

  const claimWindow = skillAnswers.claim_window_days;
  const claimWindowDisplay = claimWindow || "set value";
  const claimWindowStyle = claimWindow ? confirmedStyle : placeholderStyle;
  const damageResolution = skillAnswers.damage_resolution;
  const damageResolutionDisplay = damageResolution || "set value";
  const damageResolutionStyle = damageResolution ? confirmedStyle : placeholderStyle;

  const returnWindow = skillAnswers.return_window_days;
  const returnWindowDisplay = returnWindow || "set value";
  const returnWindowStyle = returnWindow ? confirmedStyle : placeholderStyle;

  const returnsPlatform = skillAnswers.returns_platform;
  const hasPlatform = returnsPlatform && returnsPlatform !== "I don't use one";

  const editWindow = skillAnswers.edit_window_hours;
  const editWindowDisplay = editWindow || "set value";
  const editWindowStyle = editWindow ? confirmedStyle : placeholderStyle;

  const sectionStyle = { paddingBottom: 18, borderBottom: "1px solid " + BORDER, marginBottom: 18 };
  const stepTitleStyle = { fontSize: 16, fontWeight: 600, marginBottom: 8 };
  const varTagStyle = { display: "inline-flex", alignItems: "center", gap: 4, background: SURFACE, padding: "2px 8px 2px 4px", borderRadius: 6, fontSize: 13, fontWeight: 500, verticalAlign: "middle", lineHeight: "20px", border: "1px solid " + BORDER };
  const actionTagStyle = { display: "inline-flex", alignItems: "center", gap: 4, background: SURFACE, padding: "2px 8px 2px 4px", borderRadius: 6, fontSize: 13, fontWeight: 500, verticalAlign: "middle", lineHeight: "20px", border: "1px solid " + BORDER };
  const shopifyIcon = (
    <span style={{ width: 18, height: 18, borderRadius: 4, background: "#E8F5E9", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width="11" height="12" viewBox="0 0 11 12" fill="none"><path d="M7.5 2.5C7.5 2.5 7 2 6 2S4.5 2.8 4.5 2.8L4 4H3L2 11h7l-1-7H7l-.5-1.5z" fill="#95BF47" /><path d="M7 4L7.5 2.5C7.5 2.5 7 2 6 2v9l3 0-1-7H7z" fill="#5E8E3E" /></svg>
    </span>
  );
  const actionIcon = (
    <span style={{ width: 18, height: 18, borderRadius: 4, background: "#EDE8F8", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width="10" height="12" viewBox="0 0 10 12" fill="none"><path d="M6 1L2 7h3l-1 4 4-6H5l1-4z" fill="#7E55F6" /></svg>
    </span>
  );
  const renderVar = (label) => <span style={varTagStyle}>{shopifyIcon}{label}</span>;
  const renderAction = (label) => <span style={actionTagStyle}>{actionIcon}{label}</span>;

  const cancellationInstructionsText = "Hard handover rule: IF the customer wants to cancel an order because of fraud, unauthorized purchases, or payment issues, THEN acknowledge the concern and hand over the ticket immediately.\n\n1. Order identification\nIF the customer doesn't mention any specific order, assume they are referring to their last order. IF no order data is found, ask the customer for their order number, name, email, or shipping address and attempt to locate the order again.\n\n2. Cancellation eligibility\nIF the order fulfillment status contains Fulfilled, Shipped, Delivered, or Partially Fulfilled, THEN inform the customer that cancellation is no longer possible and let them know they may return the item once delivered.\nIF the order is Unfulfilled AND was placed more than " + cancellationWindowDisplay + " ago, THEN proceed to step 3.\n\n3. Cancellation execution\nIF the order is eligible for cancellation, cancel the order.";

  const renderOrderIdentification = () => (
    <div style={sectionStyle}>
      <div style={stepTitleStyle}>1. Order identification</div>
      <div><strong>IF</strong> the customer doesn't mention any specific order, <strong>THEN</strong> assume they are referring to their last order.</div>
      <div style={{ marginTop: 6 }}><strong>IF</strong> no order data is found using the information available in the conversation, <strong>THEN</strong>:</div>
      <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
        <li>Ask the customer for their order number, name, email, or shipping address.</li>
        <li>Attempt to locate the order again.</li>
      </ul>
    </div>
  );

  return (
    <div style={{
      position: "fixed", top: 16, right: 16, bottom: 16, width: 500,
      zIndex: 1000,
      background: "#ffffff",
      border: "1px solid #EBECEF",
      borderRadius: 16,
      animation: closing
        ? "slideOutRight .2s ease forwards"
        : (skipSlideIn ? "none" : "slideInRight .2s ease-out forwards"),
      display: "flex", flexDirection: "column",
    }}>
      {/* Close button */}
      <div onClick={onClose}
        style={{
          position: "absolute", top: 20, right: 20, zIndex: 2,
          width: 32, height: 32, borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", transition: "background .15s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = SURFACE; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
      >
        <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
          <path d="M3 3l8 8M11 3l-8 8" stroke={TEXT_MUTED} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "32px 36px 24px" }}>
        {/* Title */}
        <h2 style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 20, fontWeight: 700, color: TEXT,
          marginBottom: 6, paddingRight: 40,
        }}>{skill.title}</h2>
        <p style={{ fontSize: 13, color: TEXT_MUTED, marginBottom: isReturns && hasPlatform ? 10 : 28 }}>{skill.subtitle}</p>
        {isReturns && hasPlatform && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "4px 10px", borderRadius: 6,
            background: "#F0F5FF", border: "1px solid #D6E4FF",
            marginBottom: 28,
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v4M8 10v.01M3.5 5.5L8 8l4.5-2.5M2 5.5v5l6 3.5 6-3.5v-5L8 2 2 5.5z" stroke="#3B82F6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 12, fontWeight: 500, color: "#1E40AF" }}>Powered by {returnsPlatform}</span>
          </div>
        )}

        {/* Intents */}
        <h3 style={{
          fontSize: 14, fontWeight: 600, color: "#000000",
          letterSpacing: "normal", lineHeight: "20px",
          marginBottom: 10,
        }}>Intents this skill handles</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
          {skill.edit.intents.map((intent, i) => (
            <span key={i} style={{
              fontSize: 13, fontWeight: 500, color: TEXT,
              padding: "5px 12px", borderRadius: 999,
              background: SURFACE, border: "1px solid " + BORDER,
            }}>{intent}</span>
          ))}
        </div>

        {/* Actions — only for skills with takesAction */}
        {skill.takesAction && skill.actions && skill.actions.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, position: "relative" }}>
              <h3 style={{
                fontSize: 14, fontWeight: 600, color: "#000000",
                letterSpacing: "normal", lineHeight: "20px",
                margin: 0,
              }}>Actions inserted in this skill's instructions</h3>
              <span
                style={{ cursor: "pointer", display: "inline-flex", position: "relative" }}
                onMouseEnter={(e) => { e.currentTarget.querySelector('[data-tooltip]').style.opacity = "1"; e.currentTarget.querySelector('[data-tooltip]').style.pointerEvents = "auto"; }}
                onMouseLeave={(e) => { e.currentTarget.querySelector('[data-tooltip]').style.opacity = "0"; e.currentTarget.querySelector('[data-tooltip]').style.pointerEvents = "none"; }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.4 }}>
                  <circle cx="8" cy="8" r="6.5" stroke="#6B7280" strokeWidth="1.2" />
                  <path d="M8 7v3.5M8 5.5v.01" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                <div data-tooltip style={{
                  position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
                  background: "#1E242E", color: "#fff", fontSize: 12, fontWeight: 400, lineHeight: 1.45,
                  padding: "8px 12px", borderRadius: 8, width: 240,
                  boxShadow: "0 4px 12px rgba(0,0,0,.2)",
                  opacity: 0, pointerEvents: "none", transition: "opacity .15s",
                  fontFamily: "'Inter', sans-serif",
                }}>Actions are operations AI Agent performs in connected apps (e.g. Shopify) to fulfill a customer request.</div>
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {skill.actions.map((action, i) => (
                <span key={i} style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  fontSize: 13, fontWeight: 500, color: TEXT,
                  padding: "5px 10px 5px 6px", borderRadius: 999,
                  background: SURFACE, border: "1px solid " + BORDER,
                }}>
                  <span style={{ width: 18, height: 18, borderRadius: 4, background: "#E8F5E9", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="11" height="12" viewBox="0 0 11 12" fill="none"><path d="M7.5 2.5C7.5 2.5 7 2 6 2S4.5 2.8 4.5 2.8L4 4H3L2 11h7l-1-7H7l-.5-1.5z" fill="#95BF47" /><path d="M7 4L7.5 2.5C7.5 2.5 7 2 6 2v9l3 0-1-7H7z" fill="#5E8E3E" /></svg>
                  </span>
                  {action}
                  <span style={{ fontSize: 12, color: TEXT_MUTED, fontWeight: 400, marginLeft: 2 }}>in</span>
                  <span style={{ width: 16, height: 16, borderRadius: 3, background: "#E8F5E9", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="9" height="10" viewBox="0 0 11 12" fill="none"><path d="M7.5 2.5C7.5 2.5 7 2 6 2S4.5 2.8 4.5 2.8L4 4H3L2 11h7l-1-7H7l-.5-1.5z" fill="#95BF47" /><path d="M7 4L7.5 2.5C7.5 2.5 7 2 6 2v9l3 0-1-7H7z" fill="#5E8E3E" /></svg>
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>Shopify</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Instructions header with pencil toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <h3 style={{
            fontSize: 14, fontWeight: 600, color: "#000000",
            letterSpacing: "normal", lineHeight: "20px",
            margin: 0,
          }}>Instructions</h3>
          {hasInstructions && (
            <div
              onClick={() => setIsEditingInstructions((p) => !p)}
              title={isEditingInstructions ? "Lock instructions" : "Edit instructions"}
              style={{
                width: 26, height: 26, borderRadius: 6,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "background .15s",
                background: isEditingInstructions ? ACCENT_LIGHT : "transparent",
              }}
              onMouseEnter={(e) => { if (!isEditingInstructions) e.currentTarget.style.background = SURFACE; }}
              onMouseLeave={(e) => { if (!isEditingInstructions) e.currentTarget.style.background = "transparent"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M14 4l6 6-10 10H4v-6z" stroke={isEditingInstructions ? ACCENT : TEXT_MUTED} strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M11 7l6 6" stroke={isEditingInstructions ? ACCENT : TEXT_MUTED} strokeWidth="1.6" />
              </svg>
            </div>
          )}
        </div>

        {/* Instructions container — looks like a large textarea */}
        <div style={{
          border: "1px solid " + (isEditingInstructions ? "#8992A0" : BORDER),
          borderRadius: 10,
          background: "#fff",
          transition: "border-color .15s",
        }}>

        {/* ── Order Cancellation ── */}
        {isOrderCancellation ? (
          isEditingInstructions ? (
            <textarea
              defaultValue={cancellationInstructionsText}
              style={{
                width: "100%", minHeight: 420, padding: "20px 22px",
                fontSize: 14, lineHeight: 1.6, fontFamily: "'Inter', sans-serif",
                color: TEXT, border: "none", borderRadius: 10,
                background: "transparent", resize: "vertical", outline: "none",
              }}
            />
          ) : (
            <div style={{ fontSize: 14, color: TEXT, lineHeight: 1.6, padding: "20px 22px" }}>
              <div style={{ paddingBottom: 18, borderBottom: "1px solid " + BORDER, marginBottom: 18 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: "#B91C1C" }}>Hard handover rule</div>
                <div><strong>IF</strong> the customer wants to cancel an order because of fraud, unauthorized purchases, or payment issues, <strong>THEN</strong> acknowledge the concern and hand over the ticket immediately.</div>
              </div>
              <div style={sectionStyle}>
                <div style={stepTitleStyle}>1. Order identification</div>
                <div><strong>IF</strong> the customer doesn't mention any specific order, assume they are referring to their last order.</div>
                <div style={{ marginTop: 6 }}><strong>IF</strong> no order data is found, <strong>THEN</strong>:</div>
                <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                  <li>Ask the customer for their order number, name, email, or shipping address.</li>
                  <li>Attempt to locate the order again.</li>
                </ul>
              </div>
              <div style={sectionStyle}>
                <div style={stepTitleStyle}>2. Cancellation eligibility</div>
                <div><strong>IF</strong> the order fulfillment status contains <span style={dataFieldStyle}>Fulfilled</span>, <span style={dataFieldStyle}>Shipped</span>, <span style={dataFieldStyle}>Delivered</span>, or <span style={dataFieldStyle}>Partially Fulfilled</span>, <strong>THEN</strong>:</div>
                <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                  <li>Inform the customer that cancellation is no longer possible.</li>
                  <li>Let them know they may return the item once delivered.</li>
                </ul>
                <div style={{ marginTop: 10 }}><strong>IF</strong> the order is <span style={dataFieldStyle}>Unfulfilled</span> <strong>AND</strong> was placed more than <span style={cancellationWindowStyle}>{cancellationWindowDisplay}</span> ago, <strong>THEN</strong> proceed to step 3.</div>
              </div>
              <div>
                <div style={stepTitleStyle}>3. Cancellation execution</div>
                <div><strong>IF</strong> the order is eligible for cancellation, <strong>THEN:</strong> {renderAction("Cancel Order")}</div>
              </div>
            </div>
          )

        /* ── Order Status / Tracking ── */
        ) : isOrderTracking ? (
          <div style={{ fontSize: 14, color: TEXT, lineHeight: 1.6, padding: "20px 22px" }}>
            <div style={sectionStyle}>
              <div style={stepTitleStyle}>1. Order identification</div>
              <div><strong>IF</strong> the customer doesn't mention any specific order, <strong>THEN</strong> assume they are referring to their last order.</div>
              <div style={{ marginTop: 6 }}><strong>IF</strong> {renderVar("Order: Name")} is null, <strong>THEN</strong>:</div>
              <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                <li>Ask the customer for their order number, name, email, or shipping address.</li>
                <li>Attempt to locate the order again.</li>
              </ul>
            </div>
            <div style={sectionStyle}>
              <div style={stepTitleStyle}>2. Unfulfilled orders</div>
              <div><strong>IF</strong> {renderVar("Order: Fulfillment - Status")} = 'Unfulfilled', <strong>THEN</strong>:</div>
              <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                <li><strong>IF</strong> {renderVar("Order: Created datetime")} is 5 days ago or less, <strong>THEN:</strong> Inform the customer the order is being processed and they'll receive a shipping confirmation email with a tracking link once it ships.</li>
                <li><strong>IF</strong> {renderVar("Order: Created datetime")} is more than 5 days ago, <strong>THEN:</strong> Acknowledge the delay and hand over the ticket for investigation.</li>
              </ul>
            </div>
            <div style={sectionStyle}>
              <div style={stepTitleStyle}>3. Order fulfilled but not delivered</div>
              <div><strong>IF:</strong></div>
              <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                <li>{renderVar("Order: Fulfillment - Status")} = 'Fulfilled'</li>
                <li><strong>AND</strong> {renderVar("Order: Shipment - Status")} is not 'delivered'</li>
              </ul>
              <div style={{ marginTop: 6 }}><strong>THEN:</strong></div>
              <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                <li>Share {renderVar("Order: Fulfillment - Tracking URL")} with the customer.</li>
                <li>Explain the current shipment status based on {renderVar("Order: Shipment - Status")} in plain, customer-friendly language.</li>
              </ul>
              <div style={{ marginTop: 10 }}><strong>IF</strong> {renderVar("Order: Fulfillment - Time since order")} is more than 9 days, <strong>THEN:</strong> Apologize for the delay and hand over for investigation.</div>
            </div>
            <div>
              <div style={stepTitleStyle}>4. Order delivered</div>
              <div><strong>IF</strong> tracking indicates the order is delivered, <strong>THEN</strong>:</div>
              <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                <li>Confirm the delivery date and share {renderVar("Order: Fulfillment - Tracking URL")}.</li>
              </ul>
              <div style={{ marginTop: 10 }}><strong>IF</strong> the customer reports they haven't received the package, <strong>THEN</strong>:</div>
              <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                <li>Acknowledge the concern.</li>
                <li>Ask the customer to check with neighbors, building staff, or common delivery locations (porch, mailroom, parcel lockers).</li>
                <li>Confirm the shipping address: {renderVar("Order: Shipping address 1")}, {renderVar("Order: Shipping address 2")}, {renderVar("Order: Zip")}, {renderVar("Order: City")}.</li>
              </ul>
              <div style={{ marginTop: 10 }}><strong>IF</strong> the customer has confirmed they checked surrounding locations and can't find the package, <strong>THEN:</strong> Hand over the ticket for investigation.</div>
            </div>
          </div>

        /* ── Promo Codes ── */
        ) : isPromo ? (
          <div style={{ fontSize: 14, color: TEXT, lineHeight: 1.6, padding: "20px 22px" }}>
            <div style={sectionStyle}>
              <div style={stepTitleStyle}>1. Customer needs help applying a code</div>
              <div><strong>IF</strong> the customer is asking where or how to apply a discount code, <strong>THEN</strong>:</div>
              <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                <li>Walk them through the checkout flow: add items to cart, go to checkout, enter the code in the promo/discount field, and click Apply.</li>
                <li>Close the ticket.</li>
              </ul>
            </div>
            <div style={sectionStyle}>
              <div style={stepTitleStyle}>2. Code was not applied to a placed order</div>
              <div><strong>IF</strong> the customer reports a promo code wasn't reflected on their order, <strong>THEN:</strong> Check {renderVar("Order: Discount codes")}.</div>
              <ul style={{ marginLeft: 22, marginTop: 8, listStyle: "disc" }}>
                <li><strong>IF</strong> {renderVar("Order: Discount codes")} is not empty, <strong>THEN</strong>:
                  <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                    <li>Share the applied code and discount amount, and ask the customer to verify if it matches what they expected.</li>
                    <li>Close the ticket.</li>
                  </ul>
                </li>
                <li><strong>IF</strong> {renderVar("Order: Discount codes")} is empty, <strong>THEN</strong>:
                  <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                    <li>Confirm no code was applied and inform the customer that promo codes cannot be applied after an order is placed.</li>
                    <li>Escalate the ticket to investigate a possible partial refund.</li>
                  </ul>
                </li>
              </ul>
            </div>
            <div>
              <div style={stepTitleStyle}>3. Code is invalid or not working at checkout</div>
              <div><strong>IF</strong> the customer says a promo code isn't working during checkout, <strong>THEN</strong>:</div>
              <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                <li>Remind the customer that only one promo code can be used per order, but free shipping can be combined with one discount code.</li>
              </ul>
              <div style={{ marginTop: 10 }}><strong>IF</strong> the code should be valid but still isn't working, <strong>THEN:</strong> Suggest clearing browser cache, trying a desktop browser, or using an incognito/private window.</div>
              <div style={{ marginTop: 10 }}><strong>IF</strong> the customer is still having trouble applying a discount code, escalate the ticket for further investigation.</div>
            </div>
          </div>

        /* ── Damaged / Defective ── */
        ) : isDamaged ? (
          <div style={{ fontSize: 14, color: TEXT, lineHeight: 1.6, padding: "20px 22px" }}>
            {renderOrderIdentification()}
            <div style={sectionStyle}>
              <div style={stepTitleStyle}>2. Risk review</div>
              <div>Review {renderVar("Customer: Tags")} and {renderVar("Order: Tags")}.</div>
              <div style={{ marginTop: 6 }}><strong>IF</strong> fraud, high-risk, or repeat-claim tags are present (examples: <span style={dataFieldStyle}>fraud</span>, <span style={dataFieldStyle}>high_risk</span>, <span style={dataFieldStyle}>chargeback</span>, <span style={dataFieldStyle}>do_not_refund</span>, <span style={dataFieldStyle}>blacklist</span>, <span style={dataFieldStyle}>excessive_claims</span>, <span style={dataFieldStyle}>refund_abuse</span>), <strong>THEN</strong>:</div>
              <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                <li>Do not approve refunds, replacements, or store credit.</li>
                <li>Acknowledge the issue without referencing internal tags.</li>
                <li>Hand over the ticket.</li>
              </ul>
            </div>
            <div style={sectionStyle}>
              <div style={stepTitleStyle}>3. Claim eligibility</div>
              <div><strong>IF</strong> the delivery occurred more than <span style={claimWindowStyle}>{claimWindowDisplay}</span> ago, <strong>THEN</strong>:</div>
              <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                <li>Inform the customer the claim is outside eligibility.</li>
                <li>Close the ticket.</li>
              </ul>
              <div style={{ marginTop: 10 }}><strong>IF</strong> the delivery occurred within <span style={claimWindowStyle}>{claimWindowDisplay}</span>, <strong>THEN:</strong> proceed to the next step.</div>
            </div>
            <div style={sectionStyle}>
              <div style={stepTitleStyle}>4. Evidence collection</div>
              <div>Request a photo of the damaged or affected item clearly showing the issue.</div>
              <div style={{ marginTop: 6 }}><strong>IF</strong> the customer refuses or no longer has the item, <strong>THEN</strong>:</div>
              <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                <li>Inform the customer evidence is required to proceed.</li>
                <li>Hand over the ticket.</li>
              </ul>
            </div>
            <div>
              <div style={stepTitleStyle}>5. Resolution</div>
              <div><strong>IF</strong> only some items are affected, <strong>THEN</strong>:</div>
              <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                <li>Confirm the affected items with the customer.</li>
                <li>Hand over the ticket for a replacement to be arranged.</li>
              </ul>
              <div style={{ marginTop: 10 }}><strong>IF</strong> all items or the entire shipment is affected, <strong>THEN</strong>:</div>
              <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                <li>Ask the customer to confirm they want a free reshipment.</li>
                <li><strong>IF</strong> the customer confirms, <strong>THEN:</strong> {damageResolution ? <span style={confirmedStyle}>{damageResolutionDisplay}</span> : <span style={placeholderStyle}>{damageResolutionDisplay}</span>}</li>
              </ul>
              <div style={{ marginTop: 10 }}><strong>IF</strong> it's unclear how many items are affected, <strong>THEN:</strong> Ask the customer to clarify before taking action.</div>
            </div>
          </div>

        /* ── Returns & Exchanges ── */
        ) : isReturns ? (
          <div style={{ fontSize: 14, color: TEXT, lineHeight: 1.6, padding: "20px 22px" }}>
            <div style={{ paddingBottom: 18, borderBottom: "1px solid " + BORDER, marginBottom: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: "#B91C1C" }}>Hard handover rule</div>
              <div><strong>IF</strong> the customer wants to return or exchange products from at least 2 different orders, <strong>THEN</strong>:</div>
              <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                <li>Acknowledge the concern.</li>
                <li>Hand over the ticket immediately.</li>
              </ul>
            </div>
            {renderOrderIdentification()}
            <div style={sectionStyle}>
              <div style={stepTitleStyle}>2. Return/exchange eligibility</div>
              <div><strong>IF</strong> {renderVar("Order: Created datetime")} is more than <span style={returnWindowStyle}>{returnWindowDisplay}</span> ago, <strong>THEN</strong>:</div>
              <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                <li>Inform the customer that returns and exchanges are only accepted within <span style={returnWindowStyle}>{returnWindowDisplay}</span> of purchase.</li>
                <li>Do not reference policies, links, or exceptions.</li>
              </ul>
            </div>
            <div style={sectionStyle}>
              <div style={stepTitleStyle}>3. Initiate return or exchange</div>
              <div><strong>IF</strong> {renderVar("Order: Created datetime")} is <span style={returnWindowStyle}>{returnWindowDisplay}</span> ago or less, <strong>THEN</strong>:</div>
              <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                <li>Provide the return portal link: {renderAction("Send return portal link")}</li>
                <li>Inform the customer they will receive a prepaid return shipping label via email once the request is authorized.</li>
                <li>Inform the customer of the timeline:
                  <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                    <li>Processing takes up to 10 business days after the item is received.</li>
                    <li><strong>IF</strong> the customer requested a return: Refunds may take an additional 3–5 business days to appear in their account, issued to the original payment method.</li>
                    <li><strong>IF</strong> the customer requested an exchange: The new order will ship once the return is processed.</li>
                  </ul>
                </li>
              </ul>
            </div>
            <div>
              <div style={stepTitleStyle}>4. Refund status check</div>
              <div><strong>IF</strong> the customer asks about the status of a refund, <strong>THEN:</strong> Check {renderVar("Order: Return received at")}, {renderVar("Order: Return closed at")}, and {renderVar("Order: Refund processed at")}.</div>
              <ul style={{ marginLeft: 22, marginTop: 8, listStyle: "disc" }}>
                <li><strong>IF</strong> {renderVar("Order: Return received at")} is empty, <strong>THEN</strong>:
                  <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                    <li>Inform the customer the returned item(s) have not yet been received.</li>
                    <li>Advise them to check their return tracking for delivery confirmation.</li>
                  </ul>
                </li>
                <li style={{ marginTop: 8 }}><strong>IF</strong> {renderVar("Order: Return received at")} is not empty and {renderVar("Order: Refund processed at")} is empty, <strong>THEN</strong>:
                  <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                    <li>Inform the customer the return was received on {renderVar("Order: Return received at")} and is being processed.</li>
                    <li><strong>IF</strong> {renderVar("Order: Return received at")} is more than 10 business days ago, <strong>THEN:</strong> Apologize for the delay and hand over the ticket for investigation.</li>
                  </ul>
                </li>
                <li style={{ marginTop: 8 }}><strong>IF</strong> {renderVar("Order: Refund processed at")} is not empty, <strong>THEN</strong>:
                  <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                    <li>Inform the customer the refund was processed on {renderVar("Order: Refund processed at")}.</li>
                    <li>Advise that refunds may take 3–5 business days to appear depending on their financial institution.</li>
                  </ul>
                </li>
                <li style={{ marginTop: 8 }}><strong>IF</strong> {renderVar("Order: Refund processed at")} is more than 5 business days ago and the customer reports they haven't received it, <strong>THEN:</strong> Hand over the ticket for investigation.</li>
              </ul>
            </div>
          </div>

        /* ── Missing Items ── */
        ) : isMissing ? (
          <div style={{ fontSize: 14, color: TEXT, lineHeight: 1.6, padding: "20px 22px" }}>
            {renderOrderIdentification()}
            <div style={sectionStyle}>
              <div style={stepTitleStyle}>2. Claim eligibility</div>
              <div><strong>IF</strong> the delivery date is more than <span style={claimWindowStyle}>{claimWindowDisplay}</span> ago, <strong>THEN</strong>:</div>
              <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                <li>Inform the customer that delivery issues must be reported within <span style={claimWindowStyle}>{claimWindowDisplay}</span>.</li>
                <li>Close the ticket.</li>
              </ul>
            </div>
            <div style={sectionStyle}>
              <div style={stepTitleStyle}>3. Identify the missing items</div>
              <div><strong>IF</strong> the delivery date is <span style={claimWindowStyle}>{claimWindowDisplay}</span> ago or less, <strong>THEN</strong>:</div>
              <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                <li>Ask the customer for the full name of the missing item(s).</li>
                <li>Check fulfillment status for the reported items.</li>
              </ul>
            </div>
            <div>
              <div style={stepTitleStyle}>4. Resolution</div>
              <div>Check {renderVar("Order: Shipment - Status")} for the reported item(s).</div>
              <div style={{ marginTop: 10 }}><strong>IF</strong> the item hasn't been delivered yet (e.g., unfulfilled, in transit, or pending shipment), <strong>THEN</strong>:</div>
              <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                <li>Inform the customer the item hasn't been delivered yet and share any available tracking via {renderVar("Order: Fulfillment - Tracking URL")}.</li>
                <li>Close the ticket.</li>
              </ul>
              <div style={{ marginTop: 10 }}><strong>IF</strong> the item shows as delivered, <strong>THEN</strong>:</div>
              <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                <li>Ask the customer to double-check the package contents and check with neighbors or building staff.</li>
              </ul>
              <div style={{ marginTop: 10 }}><strong>IF</strong> the item is still missing, <strong>THEN:</strong> Hand over the ticket.</div>
            </div>
          </div>

        /* ── Product Edits ── */
        ) : isProductEdits ? (
          <div style={{ fontSize: 14, color: TEXT, lineHeight: 1.6, padding: "20px 22px" }}>
            {renderOrderIdentification()}
            <div style={sectionStyle}>
              <div style={stepTitleStyle}>2. Modification eligibility</div>
              <div><strong>IF</strong> {renderVar("Order: Fulfillment status")} is <span style={dataFieldStyle}>fulfilled</span> or <span style={dataFieldStyle}>shipped</span>, <strong>THEN</strong>:</div>
              <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                <li>Inform the customer that orders already shipped cannot be modified.</li>
                <li>Close the ticket.</li>
              </ul>
              <div style={{ marginTop: 10 }}><strong>IF</strong> {renderVar("Order: Created datetime")} is more than <span style={editWindowStyle}>{editWindowDisplay}</span> ago, <strong>THEN</strong>:</div>
              <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                <li>Inform the customer that the modification window has passed.</li>
                <li>Close the ticket.</li>
              </ul>
              <div style={{ marginTop: 10 }}><strong>IF</strong> the order is unfulfilled and within <span style={editWindowStyle}>{editWindowDisplay}</span>, <strong>THEN:</strong> proceed to the next step.</div>
            </div>
            <div style={sectionStyle}>
              <div style={stepTitleStyle}>3. Identify requested changes</div>
              <div>Ask the customer what they'd like to change. Supported actions:</div>
              <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                <li><strong>Remove a product</strong> — remove a specific item from the order</li>
                <li><strong>Replace a product</strong> — swap one item for another of equal or lesser value</li>
              </ul>
              <div style={{ marginTop: 10 }}><strong>IF</strong> the customer requests a change not listed above (e.g., add an item, change quantity), <strong>THEN:</strong> Hand over the ticket.</div>
            </div>
            <div style={sectionStyle}>
              <div style={stepTitleStyle}>4. Remove product</div>
              <div><strong>IF</strong> the customer wants to remove an item, <strong>THEN</strong>:</div>
              <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                <li>Confirm the item name and quantity to remove.</li>
                <li><strong>IF</strong> the customer confirms, <strong>THEN:</strong> {renderAction("Remove line item from order")}</li>
                <li>Inform the customer the item has been removed and a partial refund will be issued to their original payment method.</li>
              </ul>
            </div>
            <div>
              <div style={stepTitleStyle}>5. Replace product</div>
              <div><strong>IF</strong> the customer wants to swap an item, <strong>THEN</strong>:</div>
              <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                <li>Ask for the name of the item to remove and the name of the replacement item.</li>
                <li>Look up the replacement in {renderVar("Product: Title")} to confirm availability.</li>
                <li><strong>IF</strong> the replacement costs more than the original, <strong>THEN:</strong> Inform the customer of the price difference and hand over the ticket.</li>
                <li><strong>IF</strong> the replacement costs the same or less, <strong>THEN:</strong></li>
              </ul>
              <ul style={{ marginLeft: 44, marginTop: 4, listStyle: "disc" }}>
                <li>Confirm the swap with the customer.</li>
                <li><strong>IF</strong> the customer confirms, <strong>THEN:</strong> {renderAction("Remove line item from order")} then {renderAction("Add replacement item to order")}</li>
                <li>Inform the customer the swap is complete. If there is a price difference, a partial refund will be issued.</li>
              </ul>
            </div>
          </div>

        /* ── Marketing and promotions ── */
        ) : isMarketing ? (
          <div style={{ fontSize: 14, color: TEXT, lineHeight: 1.6, padding: "20px 22px" }}>
            <div style={sectionStyle}>
              <div style={stepTitleStyle}>1. Classify the request</div>
              <div><strong>IF</strong> the message is a collaboration, influencer, creator, PR, gifting, sponsorship, donation, or affiliate request, <strong>THEN</strong> go to section 2.</div>
              <div style={{ marginTop: 6 }}><strong>IF</strong> the message is an unsubscribe or marketing-frequency complaint, <strong>THEN</strong> go to section 3.</div>
              <div style={{ marginTop: 6 }}><strong>IF</strong> the message is a short reply to a marketing email or campaign (e.g., "yes please," "interested," "send me the code," a campaign keyword), <strong>THEN</strong> go to section 4.</div>
              <div style={{ marginTop: 6 }}><strong>IF</strong> the message is actually a support request misclassified as marketing (refund, order, tracking, returns, subscription, promo code), <strong>THEN</strong> acknowledge briefly and hand over.</div>
            </div>
            <div style={sectionStyle}>
              <div style={stepTitleStyle}>2. Collaboration, influencer, PR, gifting, sponsorship</div>
              <div>These rarely need a substantive response. Close in every case below.</div>
              <div style={{ marginTop: 6 }}><strong>IF</strong> the customer asks for a collaboration, partnership, PR package, sample, sponsorship, gifting, donation, or affiliate access, <strong>THEN:</strong></div>
              <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                <li>Thank them briefly for their interest.</li>
                <li>Let them know the team reviews these requests and will reach out if there's a fit.</li>
                <li><strong>DO NOT</strong> commit to product, partnerships, sponsorships, or discounts.</li>
                <li>Close the ticket.</li>
              </ul>
            </div>
            <div style={sectionStyle}>
              <div style={stepTitleStyle}>3. Unsubscribe and marketing-frequency requests</div>
              <div><strong>IF</strong> the customer asks to unsubscribe, stop receiving emails, be removed from a mailing list, or reduce marketing contact, <strong>THEN:</strong></div>
              <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                <li>Acknowledge the request.</li>
                <li>Point them to the unsubscribe link at the bottom of any marketing email.</li>
                <li><strong>IF</strong> the request is for postal mail removal, <strong>THEN</strong> ask the customer to confirm the name and address on the mailing label, then close.</li>
                <li>Otherwise, close the ticket.</li>
              </ul>
            </div>
            <div>
              <div style={stepTitleStyle}>4. Marketing campaign replies</div>
              <div>These are usually short replies to marketing emails or chat campaigns (giveaways, promos, back-in-stock alerts), not support requests. Close in every case below.</div>
              <div style={{ marginTop: 6 }}><strong>IF</strong> the customer sends a short reply to a marketing email or chat campaign, <strong>THEN:</strong></div>
              <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                <li>Respond briefly — point them to the website or relevant offer page if obvious.</li>
                <li><strong>DO NOT</strong> start a long conversation. <strong>DO NOT</strong> promise discounts, samples, or follow-ups.</li>
                <li>Close the ticket.</li>
              </ul>
            </div>
          </div>

        /* ── Customer Feedback ── */
        ) : isFeedback ? (
          <div style={{ fontSize: 14, color: TEXT, lineHeight: 1.6, padding: "20px 22px" }}>
            <div style={sectionStyle}>
              <div style={stepTitleStyle}>Hard handover rule</div>
              <div><strong>IF</strong> the customer threatens legal action, a chargeback, a public/social post, or references a regulator — or describes a safety issue, injury, or health incident, <strong>THEN</strong> acknowledge sincerely and hand over the ticket.</div>
            </div>
            <div style={sectionStyle}>
              <div style={stepTitleStyle}>1. Route the message</div>
              <div><strong>IF</strong> the message expresses positive sentiment (praise, thanks, compliment), <strong>THEN</strong> go to section 2.</div>
              <div style={{ marginTop: 6 }}><strong>IF</strong> the message expresses dissatisfaction, or is a forwarded 1–3 star review, <strong>THEN</strong> go to section 3.</div>
            </div>
            <div style={sectionStyle}>
              <div style={stepTitleStyle}>2. Positive feedback</div>
              <div>Respond warmly and specifically — reference what the customer actually said. Close the ticket in every case below.</div>
              <ul style={{ marginLeft: 22, marginTop: 4, listStyle: "disc" }}>
                <li><strong>IF</strong> the customer praises the product, brand, experience, or a team member, <strong>THEN</strong> thank them specifically; optionally invite a review or photo share — light, not pushy.</li>
                <li><strong>IF</strong> the customer mentions a personal milestone (graduation, wedding, birthday, new baby) and asks for a gift, discount, sponsorship, or partnership, <strong>THEN</strong> congratulate them warmly. <strong>DO NOT</strong> commit to free product, discounts, sponsorships, or partnerships.</li>
              </ul>
            </div>
            <div style={sectionStyle}>
              <div style={stepTitleStyle}>3. Negative feedback</div>
              <div>Open with specific acknowledgment — reference the actual issue. <strong>DO NOT</strong> lead with policy or generic "we value your feedback." Close the ticket in most cases.</div>
              <ul style={{ marginLeft: 22, marginTop: 8, listStyle: "disc" }}>
                <li style={{ marginBottom: 10 }}>
                  <strong>IF</strong> the complaint is about product quality, results, sizing, or fit, <strong>THEN:</strong>
                  <div style={{ marginTop: 4 }}>Acknowledge the specific issue.</div>
                  <ul style={{ marginLeft: 20, marginTop: 4, listStyle: "circle" }}>
                    <li><strong>IF</strong> the customer asks for a refund, replacement, or exchange, <strong>THEN</strong> hand over.</li>
                    <li>Otherwise, share simple self-serve help (product tips, sizing info, adjacent SKUs) and close. <strong>DO NOT</strong> promise outcomes the product hasn't been validated to deliver.</li>
                  </ul>
                </li>
                <li style={{ marginBottom: 10 }}>
                  <strong>IF</strong> the complaint is about the website, checkout, or ordering experience, <strong>THEN:</strong>
                  <div style={{ marginTop: 4 }}>Acknowledge the friction. Suggest simple self-serve fixes (refresh, different browser, clear cache, incognito).</div>
                  <ul style={{ marginLeft: 20, marginTop: 4, listStyle: "circle" }}>
                    <li><strong>IF</strong> the issue already caused a financial impact on a placed order, <strong>THEN</strong> hand over.</li>
                    <li>Otherwise, close.</li>
                  </ul>
                </li>
                <li>
                  <strong>IF</strong> the complaint is about service or communications (staff tone, email/SMS frequency, review-request frequency), <strong>THEN:</strong>
                  <div style={{ marginTop: 4 }}>Apologize sincerely. <strong>DO NOT</strong> defend the behavior.</div>
                  <ul style={{ marginLeft: 20, marginTop: 4, listStyle: "circle" }}>
                    <li><strong>IF</strong> a specific store, location, or employee is named, <strong>THEN</strong> hand over.</li>
                    <li><strong>IF</strong> the complaint is about marketing or review-request frequency, <strong>THEN</strong> point to the unsubscribe link and close.</li>
                    <li>Otherwise, close.</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>

        /* ── Placeholder for other skills ── */
        ) : (
          <div style={{ padding: "32px 22px", textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: TEXT_MUTED, marginBottom: 4 }}>No instructions yet</div>
            <div style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.5 }}>
              Instructions for this skill will be generated during setup.
            </div>
          </div>
        )}

        </div>{/* end instructions container */}
      </div>

    </div>
  );
}
