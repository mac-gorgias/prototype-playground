function ConfirmationRow({ label, compact }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "flex-start",
      marginBottom: compact ? 4 : 16,
      animation: "fadeInUp .35s ease-out",
    }}>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: compact ? "4px 0" : "8px 0",
      }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="8" cy="8" r="7" fill={SURFACE} />
          <path d="M5 8.5l2 2 4-4" stroke={TEXT_MUTED} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize: 13, color: TEXT_MUTED, whiteSpace: "nowrap" }}>
          {label}
        </span>
      </div>
    </div>
  );
}

function ConnectCard({ pillLabel, pillIcon, heading, body, primaryLabel, onPrimary, secondaryLabel, onSecondary }) {
  return (
    <div style={{
      border: "1px solid rgba(0,0,0,0.08)",
      boxShadow: "0px 2px 20px 0px rgba(0,0,0,0.04)",
      borderRadius: 8, background: "#fff", padding: "20px",
      fontFamily: "'Inter', sans-serif",
      animation: "fadeInUp .5s cubic-bezier(.16,1,.3,1) forwards",
    }}>
      <AxTag style={{ marginBottom: 14 }} leadingSlot={pillIcon}>{pillLabel}</AxTag>

      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", margin: "0 0 8px", lineHeight: 1.3 }}>
        {heading}
      </h3>

      <div style={{ fontSize: 14, lineHeight: 1.55, color: "#5C6370", fontWeight: 450 }}>
        {body}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20 }}>
        <AxButton variant="primary" onClick={onPrimary}>{primaryLabel}</AxButton>
        <AxButton variant="secondary" onClick={onSecondary}>{secondaryLabel}</AxButton>
      </div>
    </div>
  );
}

const CONNECT_PILL_ICON_SHOPIFY = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3.5 5.5h9l-.7 7a1.5 1.5 0 0 1-1.5 1.3H5.7a1.5 1.5 0 0 1-1.5-1.3l-.7-7Z" stroke={ACCENT} strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M5.8 5.5V4.7a2.2 2.2 0 0 1 4.4 0v.8" stroke={ACCENT} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const CONNECT_PILL_ICON_EMAIL = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2.2" y="3.8" width="11.6" height="8.4" rx="1.5" stroke={ACCENT} strokeWidth="1.2" />
    <path d="m2.8 4.8 5.2 4 5.2-4" stroke={ACCENT} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
