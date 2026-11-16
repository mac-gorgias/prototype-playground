function TovHitlCard({ onApprove, onReject, approved }) {
  const PRESET_TEXTS = {
    Friendly: "Write in a warm, friendly, and approachable way. Use emojis naturally throughout replies to add personality and make conversations feel more human. Keep the tone conversational and upbeat, like a helpful friend rather than a formal support agent.",
    Professional: "Write in a clear, direct, and professional manner. Use precise language and maintain a polished tone throughout all communications. Be authoritative yet approachable, focusing on efficiency and clarity in every response.",
    Sophisticated: "Write with an elevated, refined tone that conveys elegance and expertise. Use rich vocabulary and thoughtful phrasing. Maintain a premium feel that reflects sophistication while remaining warm and accessible to customers.",
  };
  const presets = [
    { name: "Custom", desc: "Customize your personality" },
    { name: "Friendly", desc: "Warm, inviting, encouraging" },
    { name: "Professional", desc: "Precise, polished, authoritative" },
    { name: "Sophisticated", desc: "Elevated, elegant, refined" },
  ];
  const [selectedPreset, setSelectedPreset] = useState("Custom");
  const [personalityText, setPersonalityText] = useState(brand().toneOfVoice);

  const handlePresetClick = (name) => {
    setSelectedPreset(name);
    if (name === "Custom") setPersonalityText(brand().toneOfVoice);
    else setPersonalityText("");
  };

  const isPresetSelected = selectedPreset !== "Custom";

  return (
    <div style={{
      border: "1px solid rgba(0,0,0,0.08)",
      boxShadow: "0px 2px 20px 0px rgba(0,0,0,0.04)",
      borderRadius: 8, background: "#fff", padding: "20px",
      fontFamily: "'Inter', sans-serif",
      animation: "fadeInUp .5s cubic-bezier(.16,1,.3,1) forwards",
    }}>
      {/* Tone of Voice tag */}
      <AxTag
        style={{ marginBottom: 14 }}
        leadingSlot={
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5.5 6.5a2.5 2.5 0 1 1 5 0" stroke={ACCENT} strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="8" cy="4" r="2" stroke={ACCENT} strokeWidth="1.2" />
            <path d="M3 13.5c0-2.5 2.2-4.5 5-4.5s5 2 5 4.5" stroke={ACCENT} strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        }
      >Tone of Voice</AxTag>

      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", margin: "0 0 16px", lineHeight: 1.3 }}>
        Review Tone of Voice changes
      </h3>

      <div style={{ fontSize: 13, fontWeight: 600, color: "#1E242E", marginBottom: 8 }}>AI Agent personality</div>

      <textarea
        ref={(el) => { if (el) { el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; } }}
        value={personalityText}
        onChange={(e) => { setPersonalityText(e.target.value); setSelectedPreset("Custom"); }}
        disabled={approved || isPresetSelected}
        maxLength={3000}
        style={{
          width: "100%", padding: "12px 14px", fontSize: 13, lineHeight: 1.65,
          fontFamily: "'Inter', sans-serif",
          color: (approved || isPresetSelected) ? TEXT_MUTED : TEXT,
          background: (approved || isPresetSelected) ? "#F8F8F8" : "#fff",
          border: "1px solid " + BORDER, borderRadius: 8, resize: "vertical",
          outline: "none", boxSizing: "border-box", minHeight: 80,
          opacity: (approved || isPresetSelected) ? 0.6 : 1,
          transition: "opacity .2s, background .2s, color .2s",
          cursor: (approved || isPresetSelected) ? "default" : "text",
        }}
        onInput={(e) => { e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }}
        onFocus={(e) => { if (!isPresetSelected) e.target.style.borderColor = ACCENT; }}
        onBlur={(e) => { e.target.style.borderColor = BORDER; }}
      />
      <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 4, marginBottom: 16 }}>
        {personalityText.length}/3000
      </div>

      {/* Preset grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {presets.map((p) => {
          const isSelected = selectedPreset === p.name;
          return (
            <div key={p.name}
              onClick={() => { if (!approved) handlePresetClick(p.name); }}
              style={{
                border: isSelected ? "2px solid " + ACCENT : "1px solid rgba(0,0,0,0.08)",
                borderRadius: 10, padding: "12px 14px", cursor: approved ? "default" : "pointer",
                transition: "border-color .15s, box-shadow .15s",
                background: "#fff", position: "relative",
              }}
              onMouseEnter={(e) => { if (!isSelected && !approved) { e.currentTarget.style.borderColor = "#D0D0D0"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,.04)"; } }}
              onMouseLeave={(e) => { if (!isSelected && !approved) { e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)"; e.currentTarget.style.boxShadow = "none"; } }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{p.name}</span>
                {isSelected && (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="9" stroke={ACCENT} strokeWidth="1.5" fill="white" />
                    <path d="M6.5 10.5l2 2 5-5" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div style={{ fontSize: 13, color: "#5C6370", marginTop: 4, lineHeight: 1.4 }}>{p.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Approve / Reject */}
      <div aria-hidden={approved} style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20, visibility: approved ? "hidden" : "visible" }}>
        <AxButton variant="primary" onClick={onApprove}>Approve</AxButton>
        <AxButton variant="tertiary" onClick={onReject}>Reject</AxButton>
      </div>
    </div>
  );
}

function SkillCard({ skill, index, isActive, onPreview, onEdit, needsInfo, answeredSkillKeys, actionDeclinedKeys, draftKeys, staggerIndex = 0 }) {
  const isAnswered = answeredSkillKeys && answeredSkillKeys.has(skill.key);
  const isActionDeclined = actionDeclinedKeys && actionDeclinedKeys.has(skill.key);
  return (
    <div style={{
      border: isActive ? "1px solid " + ACCENT : "1px solid " + BORDER,
      borderRadius: 12,
      background: CARD_BG, overflow: "hidden",
      display: "flex", alignItems: "center", gap: 14,
      padding: "14px 16px",
      transition: "border-color .15s, box-shadow .15s",
      animation: "fadeInUp .4s cubic-bezier(.16,1,.3,1) " + (staggerIndex * 0.12) + "s both",
      marginBottom: 10,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 10, background: "#EDE8F8", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>{skill.icon}</div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div style={{ minWidth: 0, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{
              fontSize: 11, fontWeight: 500, color: "#6B7280",
              border: "1px solid " + BORDER, padding: "2px 8px", borderRadius: 6,
              lineHeight: 1.3, whiteSpace: "nowrap",
              display: "inline-flex", alignItems: "center", gap: 4,
            }}>
              <span style={{ color: "#9CA3AF", fontSize: 8 }}>&#9679;</span> Draft
            </span>
            {needsInfo && !isAnswered && (
              <span style={{
                fontSize: 11, fontWeight: 500, color: "#A94F13",
                border: "1px solid " + BORDER, padding: "2px 8px", borderRadius: 6,
                lineHeight: 1.3, whiteSpace: "nowrap",
                display: "inline-flex", alignItems: "center", gap: 4,
              }}>
                <span style={{ color: "#E8912D", fontSize: 8 }}>&#9679;</span> Needs review
              </span>
            )}
            {skill.takesAction && !isActionDeclined && (
              <span style={{
                fontSize: 11, fontWeight: 500, color: "#555",
                border: "1px solid " + BORDER, padding: "2px 8px 2px 5px", borderRadius: 6,
                lineHeight: 1.3, whiteSpace: "nowrap",
                display: "inline-flex", alignItems: "center", gap: 4,
              }}>
                <span style={{ width: 14, height: 14, borderRadius: 3, background: "#E8F5E9", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="9" height="10" viewBox="0 0 11 12" fill="none"><path d="M7.5 2.5C7.5 2.5 7 2 6 2S4.5 2.8 4.5 2.8L4 4H3L2 11h7l-1-7H7l-.5-1.5z" fill="#95BF47" /><path d="M7 4L7.5 2.5C7.5 2.5 7 2 6 2v9l3 0-1-7H7z" fill="#5E8E3E" /></svg>
                </span>
                Takes action
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(index); }}
              style={BTN_TERTIARY_SM}
              onMouseEnter={(e) => { Object.assign(e.currentTarget.style, BTN_TERTIARY_HOVER); }}
              onMouseLeave={(e) => { Object.assign(e.currentTarget.style, BTN_TERTIARY_LEAVE); }}
            >View</button>
            {(() => { const testDisabled = needsInfo && !isAnswered; return (
            <button
              onClick={(e) => { e.stopPropagation(); if (!testDisabled) onPreview(index); }}
              disabled={testDisabled}
              style={{ ...BTN_SECONDARY_SM, opacity: testDisabled ? 0.4 : 1, cursor: testDisabled ? "default" : "pointer" }}
              onMouseEnter={(e) => { if (!testDisabled) Object.assign(e.currentTarget.style, BTN_SECONDARY_HOVER); }}
              onMouseLeave={(e) => { if (!testDisabled) Object.assign(e.currentTarget.style, BTN_SECONDARY_LEAVE); }}
            >Test</button>
            ); })()}
          </div>
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: TEXT, lineHeight: 1.3 }}>{skill.title}</span>
      </div>
    </div>
  );
}

function SkillListCard({ skills = brand().skills, startIndex = 0, visibleCount = 3, needsInfo = false, answeredSkillKeys, actionDeclinedKeys, activeSkillIdx, expanded, onToggleExpanded, onPreview, onEdit, draftKeys }) {
  const hiddenCount = skills.length - visibleCount;
  const peekSkill = !expanded && hiddenCount > 0 ? skills[visibleCount] : null;

  return (
    <div style={{ marginTop: 8 }}>
      {(expanded ? skills : skills.slice(0, visibleCount)).map((skill, i) => (
        <SkillCard
          key={skill.key}
          skill={skill}
          index={startIndex + i}
          staggerIndex={i}
          isActive={activeSkillIdx === startIndex + i}
          onPreview={onPreview}
          onEdit={onEdit}
          needsInfo={needsInfo}
          answeredSkillKeys={answeredSkillKeys}
          actionDeclinedKeys={actionDeclinedKeys}
          draftKeys={draftKeys}
        />
      ))}
      {peekSkill && (
        <div style={{ position: "relative", maxHeight: 38, overflow: "hidden" }}>
          <div style={{ pointerEvents: "none", opacity: 0.7 }}>
            <SkillCard
              skill={peekSkill}
              index={startIndex + visibleCount}
              staggerIndex={visibleCount}
              isActive={false}
              onPreview={() => {}}
              onEdit={() => {}}
              needsInfo={needsInfo}
              answeredSkillKeys={answeredSkillKeys}
              actionDeclinedKeys={actionDeclinedKeys}
              draftKeys={draftKeys}
            />
          </div>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
            pointerEvents: "none",
          }} />
        </div>
      )}
      {hiddenCount > 0 && (
        <div
          onClick={onToggleExpanded}
          style={{
            display: "inline-flex", alignSelf: "flex-start",
            alignItems: "center", gap: 6, padding: "5px 8px",
            cursor: "pointer", borderRadius: 8,
            marginTop: 2, marginBottom: 8,
            width: "fit-content",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = SURFACE; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d={expanded ? "M4 8.5l3-3 3 3" : "M4 5.5l3 3 3-3"} stroke={TEXT_MUTED} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 12, color: TEXT_MUTED }}>
            {expanded ? "Show less" : "Show " + hiddenCount + " more skill" + (hiddenCount !== 1 ? "s" : "")}
          </span>
        </div>
      )}
    </div>
  );
}

function IntentConceptCard() {
  const rootRef = useRef(null);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    let isVisible = true;
    const updatePlayback = () => setIsRunning(isVisible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      updatePlayback();
    }, { threshold: 0.15 });
    observer.observe(node);
    document.addEventListener("visibilitychange", updatePlayback);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updatePlayback);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={"edu" + (isRunning ? " is-running" : "")}
      aria-label="How AI Agent handles incoming tickets"
    >
      <div className="edu-stage">
        <div className="edu-col">
          <span className="qb q1">Where is my order?</span>
          <span className="qb q2">An item is missing from my order</span>
          <span className="qb q3">Do you ship to Canada?</span>
        </div>
        <span className="wire" aria-hidden="true"><span className="pulse" /></span>
        <div className="edu-brain">
          <span className="agent-mark" aria-hidden="true">
            <img src={asset("ai-agent-icon.svg")} alt="" />
          </span>
          <span className="intent-stack" aria-hidden="true">
            <span className="intent i1">Intent: order status</span>
            <span className="intent i2">Intent: missing item</span>
            <span className="intent i3">Intent: international shipping</span>
          </span>
        </div>
        <span className="fork" aria-hidden="true">
          <svg viewBox="0 0 42 144" preserveAspectRatio="none" fill="none">
            <path d="M0 72H10" stroke="#B9AEDF" strokeWidth="1.4" />
            <path d="M10 72C16 72 16 34 23 34H42" stroke="#76B9A2" strokeWidth="1.4" />
            <path d="M10 72C16 72 16 110 23 110H42" stroke="#A98CF8" strokeWidth="1.4" />
          </svg>
          <span className="fork-dot response" />
          <span className="fork-dot handover" />
        </span>
        <div className="edu-col">
          <span className="out auto"><svg className="out-icon" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3" /><path d="M5.8 9.2l2 2 4.4-4.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg><span className="out-copy"><span className="out-title">Response</span><strong>When a skill matches the intent</strong><small>AI Agent handles the conversation</small></span></span>
          <span className="out hand"><svg className="out-icon" viewBox="0 0 18 18" fill="none"><circle cx="6.5" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.3" /><path d="M2.5 13c.5-2 1.9-3 4-3s3.5 1 4 3M11 4.5a2.3 2.3 0 0 1 0 4.2M11.5 10c1.7.3 2.8 1.3 3.2 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg><span className="out-copy"><span className="out-title">Handover</span><strong>When AI Agent can&apos;t answer</strong><small>Your team takes over</small></span></span>
        </div>
      </div>
      <div className="edu-caps">
        <span className="cap c1">Your customer submits a ticket.</span>
        <span className="cap c2">AI Agent determines the customer&apos;s intent.</span>
        <span className="cap c3">AI Agent responds using a matching skill or hands the ticket over to your team.</span>
      </div>
    </div>
  );
}

const DNS_PROVIDER_OPTIONS = [
  { key: "GoDaddy", title: "GoDaddy", badge: "AI detected" },
  { key: "Cloudflare", title: "Cloudflare" },
  { key: "Namecheap", title: "Namecheap" },
  { key: "Squarespace", title: "Squarespace" },
];

const DNS_PROVIDER_DOCS = {
  GoDaddy: "https://www.godaddy.com/help/add-a-cname-record-19236",
  Cloudflare: "https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/",
  Namecheap: "https://www.namecheap.com/support/knowledgebase/article.aspx/9646/2237/how-to-create-a-cname-record-for-your-domain/",
  Squarespace: "https://support.squarespace.com/hc/en-us/articles/360002101888",
};

function ForwardingInstructions() {
  return (
    <div style={{ animation: "fadeInUp .4s cubic-bezier(.16,1,.3,1) both" }}>
      <div style={{ ...THREAD_TEXT_STYLE, marginBottom: 16 }}>
        Copy this forwarding address and follow the video below: <CopyChip value={brand().forwarding.address} />
      </div>
      <VideoPlaceholder label="Email forwarding setup video placeholder" />
      <SupportLine href={brand().forwarding.helpUrl} linkText="Help Center documentation here" />
    </div>
  );
}

function DnsCopyButton({ value, label }) {
  const [copied, copy] = useCopied();
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={() => copy(value)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={copied ? "Copied" : label}
      style={{
        width: 28, height: 28, flex: "0 0 auto", padding: 0, display: "grid", placeItems: "center",
        borderRadius: 6, cursor: "pointer",
        border: "1px solid " + (hover && !copied ? "rgba(30,36,46,0.12)" : "transparent"),
        background: copied ? "#EAF7F1" : (hover ? "#F7F7F8" : "transparent"),
        color: copied ? "#147656" : (hover ? "#1E242E" : "#5C6370"),
      }}
    >
      {copied ? <CheckGlyph /> : <CopyGlyph />}
    </button>
  );
}

function DnsRecordsTable({ provider }) {
  const th = {
    padding: "10px 12px", color: "#5C6370", background: "#F7F7F8",
    fontSize: 11, fontWeight: 600, letterSpacing: ".04em", textAlign: "left", textTransform: "uppercase",
  };
  const td = { padding: "13px 12px", borderTop: "1px solid rgba(0,0,0,0.08)", verticalAlign: "middle" };
  const code = {
    display: "block", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
    color: "#1E242E", fontFamily: MONO_FONT, fontSize: 12, fontWeight: 500, lineHeight: 1.4,
  };
  const cell = (value, label) => (
    <div style={{ display: "flex", minWidth: 0, alignItems: "center", gap: 6 }}>
      <code title={value} style={code}>{value}</code>
      <DnsCopyButton value={value} label={label} />
    </div>
  );
  return (
    <div style={{
      marginBottom: 16, overflow: "hidden", borderRadius: 8, background: "#FFFFFF",
      border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0px 2px 20px 0px rgba(0,0,0,0.04)",
      animation: "fadeInUp .5s cubic-bezier(.16,1,.3,1) both",
    }}>
      <table aria-label={"DNS records to add in " + provider} style={{
        width: "100%", tableLayout: "fixed", borderCollapse: "collapse", fontFamily: "'Inter', sans-serif", fontSize: 14,
      }}>
        <thead>
          <tr>
            <th style={{ ...th, width: 84 }}>Type</th>
            <th style={{ ...th, width: 220 }}>Host</th>
            <th style={th}>Value</th>
          </tr>
        </thead>
        <tbody>
          {brand().forwarding.dnsRecords.map((record, index) => (
            <tr key={record.host}>
              <td style={{ ...td, fontWeight: 500, color: "#1E242E" }}>{record.type}</td>
              <td style={td}>{cell(record.host, "Copy host for record " + (index + 1))}</td>
              <td style={td}>{cell(record.value, "Copy value for record " + (index + 1))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SetupRecapCard({ enabledSkills, channelConnectMethod, forwardingEmail, domainVerified }) {
  const [expandedKey, setExpandedKey] = useState(null);
  const linkedIntents = enabledSkills.flatMap((skill) => skill.edit.intents);
  const provider = channelConnectMethod === "microsoft" ? "Outlook" : "Gmail";
  const emailAddress = brand().inboxEmail;
  const channelDetails = channelConnectMethod === "forwarding"
    ? [
        "Email forwarding · " + (forwardingEmail || brand().forwarding.supportEmail),
        (domainVerified ? "Domain verified" : "Domain verification pending") + " · " + brand().forwarding.domain,
      ]
    : [provider + " · " + emailAddress];
  const rows = [
    { key: "channel", label: "Channel connected", value: "Email", details: channelDetails },
    { key: "tone", label: "Tone of voice", value: "Custom", details: [brand().toneOfVoice] },
    { key: "skills", label: "Skills drafted", value: String(enabledSkills.length), details: enabledSkills.map((skill) => skill.title) },
    { key: "intents", label: "Intents linked to drafted skills", value: String(linkedIntents.length) + "/48", details: linkedIntents },
    { key: "knowledge", label: "Knowledge", value: brand().knowledgeSources.length + " sources", details: brand().knowledgeSources },
  ];
  return (
    <div style={{
      marginBottom: 16, border: "1px solid rgba(0,0,0,0.08)", borderRadius: 8,
      background: "#FFFFFF", boxShadow: "0px 2px 20px rgba(0,0,0,0.04)", overflow: "hidden",
      animation: "fadeInUp .5s cubic-bezier(.16,1,.3,1) both",
    }}>
      {rows.map((row, index) => {
        const expanded = expandedKey === row.key;
        return (
          <div key={row.key} style={{ borderTop: index === 0 ? "none" : "1px solid " + BORDER }}>
            <button
              type="button"
              onClick={() => setExpandedKey(expanded ? null : row.key)}
              aria-expanded={expanded}
              style={{
                width: "100%", padding: "12px 16px", border: 0, background: "#FFFFFF", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 10, textAlign: "left", fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#FAFAFA"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#FFFFFF"; }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}><circle cx="9" cy="9" r="7" stroke="#147656" strokeWidth="1.3"/><path d="M5.8 9.2l2 2 4.4-4.4" stroke="#147656" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: "#1E242E" }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#1E242E" }}>{row.value}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s", flexShrink: 0 }}><path d="M4 5.5l3 3 3-3" stroke="#8992A0" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            {expanded && (
              <div style={{ padding: "0 16px 12px 44px", display: "flex", flexWrap: "wrap", gap: 6 }}>
                {row.details.map((detail) => (
                  <span key={detail} style={{
                    padding: row.key === "tone" ? "10px 12px" : "4px 8px",
                    borderRadius: 6, background: "#F2F3F5", color: "#5C6370",
                    fontSize: 12, lineHeight: row.key === "tone" ? "18px" : "16px",
                    whiteSpace: row.key === "tone" ? "pre-wrap" : "normal",
                    width: row.key === "tone" ? "100%" : "auto",
                  }}>{detail}</span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
