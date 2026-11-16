function ChatInputBar({ value, onChange, onSend, onKeyDown, placeholder, sendDisabled, thinking }) {
  const [focused, setFocused] = useState(false);
  const filled = value && value.trim().length > 0;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      border: focused && !thinking ? "1px solid #8992A0" : "1px solid rgba(0,0,0,0.08)",
      borderRadius: 8,
      background: "#ffffff",
      padding: filled && !thinking ? "6px 8px" : "6px 4px 6px 8px",
      height: 40,
      transition: "border-color .15s ease, opacity .15s ease",
      opacity: thinking ? 0.6 : 1,
    }}>
      <input
        data-chat-input="true"
        value={thinking ? "" : value}
        onChange={thinking ? undefined : onChange}
        onKeyDown={thinking ? undefined : onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={thinking}
        placeholder={placeholder || "Send a message..."}
        style={{
          flex: 1, border: "none", outline: "none", background: "transparent",
          fontSize: 14, fontWeight: 400, lineHeight: "20px",
          fontFamily: "'Inter', sans-serif",
          color: thinking ? "#8992A0" : (filled ? "#1E242E" : "#8992A0"),
          minWidth: 0,
          cursor: thinking ? "default" : "text",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
        {thinking ? (
          <div style={{
            width: 24, height: 24, borderRadius: 12,
            border: "1.5px solid #1E242E",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "opacity .15s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="#1E242E">
              <rect x="1" y="1" width="8" height="8" rx="1.5" />
            </svg>
          </div>
        ) : (
          <>
            <div style={{
              width: 24, height: 24, borderRadius: 6,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3.5 8H8M8 8H12.5M8 8V12.5M8 8V3.5" stroke="#1E242E" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <button
              onClick={onSend}
              disabled={sendDisabled}
              style={{
                width: 24, height: 24, borderRadius: 6, border: "none",
                background: filled ? "#1E242E" : "transparent",
                boxShadow: filled ? "0px 2px 3px rgba(0,0,0,0.05)" : "none",
                cursor: sendDisabled ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background .15s", flexShrink: 0, padding: 0,
                opacity: filled ? 1 : 0.5,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M7.193 8.807l3.09-3.09M13.443 3.832l-2.608 8.476c-.234.759-.35 1.14-.55 1.265a.667.667 0 01-.581.049c-.22-.091-.398-.447-.753-1.158l-1.652-3.303a1.335 1.335 0 00-.122-.218.668.668 0 00-.115-.116 1.34 1.34 0 00-.227-.119L3.536 7.052c-.71-.355-.89-.533-.98-.753a.667.667 0 01.048-.582c.126-.201.506-.318 1.265-.552l8.475-2.608c.597-.183.896-.275 1.098-.201a.667.667 0 01.379.379c.074.201-.018.501-.201 1.097z" stroke={filled ? "white" : "#1E242E"} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function QuestionCard({ title, subtitle, options, onSelect, onClose, freeformValue, onFreeformChange, onFreeformSubmit, hideFreeform, onSkip }) {
  const opts = options || [
    { key: "all", title: "Turn on all ready to enable skills", desc: "AI Agent will follow skills in the same way, every time." },
    { key: "pick", title: "Let me pick", desc: "The rest will rely on background knowledge." },
  ];
  return (
    <div style={{
      animation: "fadeInUp .35s ease-out",
      border: "1px solid " + BORDER, borderRadius: 8, background: "#ffffff",
      overflow: "hidden", padding: "12px 0 0",
      marginTop: 0, position: "relative",
    }}>
      {/* Header */}
      <div style={{
        padding: "0 16px 12px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#1E242E", lineHeight: 1.35 }}>
            {title || "What use cases would you like AI Agent to handle?"}
          </div>
          {subtitle && <div style={{ fontSize: 13, color: "#5C6370", lineHeight: 1.45, marginTop: 4, maxWidth: 620 }}>{subtitle}</div>}
        </div>
        {onClose && (
          <div onClick={onClose} style={{
            width: 24, height: 24, borderRadius: 6, marginLeft: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M11.98 11.99L7.99 8M7.99 8L4 4.01M7.99 8l3.99-3.99M7.99 8L4 11.99" stroke="#1E242E" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>
      {opts.map((opt, oi) => (
        <div key={opt.key}
          onClick={() => onSelect(opt.key)}
          style={{
            padding: "16px 16px", cursor: "pointer",
            display: "flex", alignItems: opt.desc ? "flex-start" : "center", gap: 12,
            transition: "background .15s",
            borderTop: "1px solid " + BORDER,
            background: "#ffffff",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = SURFACE; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#ffffff"; }}
        >
          <div style={{
            width: 26, height: 26, borderRadius: 6,
            background: "transparent", border: "1px solid " + BORDER,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            fontSize: 12, fontWeight: 600, color: TEXT_MUTED, marginTop: 1,
          }}>{oi + 1}</div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: "#1E242E", lineHeight: 1.35 }}>{opt.title}</span>
              {opt.badge && (
                <span style={{
                  fontSize: 12, fontWeight: 500, color: ACCENT,
                  background: ACCENT_LIGHT, padding: "2px 8px", borderRadius: 6,
                  whiteSpace: "nowrap", flexShrink: 0, marginLeft: "auto",
                }}>{opt.badge}</span>
              )}
            </div>
            <span style={{ fontSize: 13, color: "#8992A0", lineHeight: 1.4 }}>{opt.desc}</span>
          </div>
        </div>
      ))}
      {/* Freeform */}
      {!hideFreeform && (
      <div style={{ padding: "16px 16px", display: "flex", alignItems: "center", gap: 12, borderTop: "1px solid " + BORDER }}>
        <div style={{
          width: 26, height: 26, borderRadius: 6,
          background: "transparent", border: "1px solid " + BORDER,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M11.2 1.8a1.6 1.6 0 0 1 2.3 0l.7.7a1.6 1.6 0 0 1 0 2.3L5.7 13.3l-3.4.9.9-3.4Z" stroke={TEXT_MUTED} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M9.5 3.5l3 3" stroke={TEXT_MUTED} strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
        <input
          value={freeformValue}
          onChange={(e) => onFreeformChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (freeformValue.trim()) onFreeformSubmit(); } }}
          placeholder="Something else..."
          style={{
            flex: 1, border: "none", outline: "none", background: "transparent",
            fontSize: 14, fontFamily: "'Inter', sans-serif", color: "#1E242E",
            fontStyle: freeformValue ? "normal" : "italic",
          }}
        />
      </div>
      )}
      {onSkip && (
        <div style={{
          padding: "10px 16px", borderTop: "1px solid " + BORDER,
          display: "flex", alignItems: "center", justifyContent: "flex-end",
        }}>
          <button onClick={onSkip} style={{
            fontSize: 12, fontWeight: 500, color: TEXT,
            background: "#fff", border: "1px solid " + BORDER, borderRadius: 6,
            padding: "4px 12px", cursor: "pointer", fontFamily: "'Inter', sans-serif",
          }}>Skip</button>
        </div>
      )}
    </div>
  );
}

function SkillPickerCard({ toggles, onToggle, onConfirm, onClose, freeformValue, onFreeformChange, onFreeformSubmit, frozen, options, disabledKeys, title = "Which skills would you like to enable?", hideFreeform = false, confirmLabel = null }) {
  const pickerOptions = options || [];
  const selectedCount = Object.values(toggles).filter(Boolean).length;
  const hasSelection = selectedCount > 0;
  const handleSubmit = () => { if (frozen) return; onConfirm(); };
  return (
    <div style={{
      animation: "fadeInUp .35s ease-out",
      border: "1px solid " + BORDER, borderRadius: 8, background: "#ffffff",
      overflow: "hidden", padding: "12px 0 0",
    }}>
      <div style={{
        padding: "0 16px 12px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#1E242E" }}>
          {title}
        </div>
        {onClose && (
          <div onClick={() => { if (!frozen) onClose(); }} style={{
            width: 24, height: 24, borderRadius: 6, marginLeft: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M11.98 11.99L7.99 8M7.99 8L4 4.01M7.99 8l3.99-3.99M7.99 8L4 11.99" stroke="#1E242E" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      {pickerOptions.map((s) => {
        const isDisabled = disabledKeys && disabledKeys.has(s.key);
        const checked = !isDisabled && !!toggles[s.key];
        return (
          <div key={s.key}
            onClick={() => { if (!frozen && !isDisabled) onToggle(s.key); }}
            style={{
              padding: "16px 16px",
              cursor: frozen || isDisabled ? "default" : "pointer",
              display: "flex", alignItems: "center", gap: 12,
              transition: "background .15s",
              borderTop: "1px solid " + BORDER,
              background: "#ffffff",
              opacity: isDisabled ? 0.45 : 1,
            }}
            onMouseEnter={(e) => { if (!frozen && !isDisabled) e.currentTarget.style.background = SURFACE; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#ffffff"; }}
          >
            <div style={{
              width: 24, height: 24, borderRadius: 6, flexShrink: 0,
              border: checked ? "none" : "1.5px solid #C9CDD4",
              background: checked ? ACCENT : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all .15s",
            }}>
              {checked && (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3.5 8.5l3 3 6-6.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span style={{ fontSize: 14, color: "#1E242E", lineHeight: 1.4, flex: 1, minWidth: 0 }}>{s.label}</span>
          </div>
        );
      })}

      {!hideFreeform && <div style={{ padding: "16px 16px", display: "flex", alignItems: "center", gap: 12, borderTop: "1px solid " + BORDER }}>
        <div style={{
          width: 26, height: 26, borderRadius: 6,
          background: "transparent", border: "1px solid " + BORDER,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M11.2 1.8a1.6 1.6 0 0 1 2.3 0l.7.7a1.6 1.6 0 0 1 0 2.3L5.7 13.3l-3.4.9.9-3.4Z" stroke={TEXT_MUTED} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M9.5 3.5l3 3" stroke={TEXT_MUTED} strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
        <input
          value={freeformValue || ""}
          onChange={(e) => { if (!frozen) onFreeformChange && onFreeformChange(e.target.value); }}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (!frozen && (freeformValue || "").trim() && onFreeformSubmit) onFreeformSubmit(); } }}
          placeholder="Something else..."
          disabled={frozen}
          style={{
            flex: 1, border: "none", outline: "none", background: "transparent",
            fontSize: 14, fontFamily: "'Inter', sans-serif", color: "#1E242E",
            fontStyle: (freeformValue || "").trim() ? "normal" : "italic",
          }}
        />
      </div>}

      <div style={{
        padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
        borderTop: "1px solid " + BORDER,
      }}>
        <span style={{ fontSize: 13, color: "#8992A0", fontFamily: "'Inter', sans-serif" }}>
          {selectedCount > 0 ? selectedCount + " selected" : "None selected"}
        </span>
        <button
          onClick={handleSubmit}
          disabled={frozen || !hasSelection}
          style={{
            width: confirmLabel ? "auto" : 32, height: 32, borderRadius: 8, border: "none",
            background: (frozen || !hasSelection) ? "#E0E0E0" : "#1E242E",
            cursor: (frozen || !hasSelection) ? "default" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background .15s", flexShrink: 0, padding: confirmLabel ? "0 12px" : 0,
            color: "#fff", fontSize: 13, fontWeight: 600, fontFamily: "'Inter', sans-serif",
          }}
        >
          {confirmLabel || <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M7.193 8.807l3.09-3.09M13.443 3.832l-2.608 8.476c-.234.759-.35 1.14-.55 1.265a.667.667 0 01-.581.049c-.22-.091-.398-.447-.753-1.158l-1.652-3.303a1.335 1.335 0 00-.122-.218.668.668 0 00-.115-.116 1.34 1.34 0 00-.227-.119L3.536 7.052c-.71-.355-.89-.533-.98-.753a.667.667 0 01.048-.582c.126-.201.506-.318 1.265-.552l8.475-2.608c.597-.183.896-.275 1.098-.201a.667.667 0 01.379.379c.074.201-.018.501-.201 1.097z" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>}
        </button>
      </div>
    </div>
  );
}
