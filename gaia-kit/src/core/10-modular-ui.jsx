/* ─── Modular onboarding UI ─── */

/* The use-case plan shown after the intro ("big picture of the modules to come, in order"). */
function PlanCard({ title, modules, isDone, active }) {
  return (
    <div style={{
      marginBottom: 16, border: "1px solid rgba(0,0,0,0.08)", borderRadius: 8, background: "#FFFFFF",
      boxShadow: "0px 2px 20px 0px rgba(0,0,0,0.04)", overflow: "hidden", animation: "fadeInUp .5s cubic-bezier(.16,1,.3,1) both",
    }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid " + BORDER, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#1E242E", flex: 1 }}>{title}</span>
        <span style={{ fontSize: 12, color: "#5C6370" }}>{modules.length} steps</span>
      </div>
      {modules.map((mod, i) => {
        const done = isDone && isDone(mod.id);
        const isActive = active === mod.id;
        return (
          <div key={mod.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderTop: i === 0 ? "none" : "1px solid #F2F3F5" }}>
            {done ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}><circle cx="9" cy="9" r="7" stroke="#147656" strokeWidth="1.3" /><path d="M5.8 9.2l2 2 4.4-4.4" stroke="#147656" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            ) : (
              <span style={{
                width: 18, height: 18, borderRadius: "50%", flexShrink: 0, fontSize: 11, fontWeight: 600,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                color: isActive ? "#fff" : "#5C6370", background: isActive ? ACCENT : "#F2F3F5",
              }}>{i + 1}</span>
            )}
            <span style={{ fontSize: 13, color: done ? TEXT_MUTED : "#1E242E", fontWeight: isActive ? 500 : 400, flex: 1 }}>{mod.name}</span>
            {mod.ui === "sidebar" && <span style={{ fontSize: 12, color: "#8992A0" }}>In product</span>}
          </div>
        );
      })}
    </div>
  );
}

/* Sidebar mode: placeholder for the real product UI Gaia is guiding the merchant through. */
function SurfacePlaceholder({ surface }) {
  const s = surface || {};
  return (
    <div style={{ position: "absolute", inset: 24, display: "flex", flexDirection: "column", gap: 16, animation: "fadeIn .4s ease both" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 20, fontWeight: 600, color: "#1E242E" }}>{s.title || "Product"}</span>
        <AxTag>Placeholder</AxTag>
      </div>
      <div style={{
        flex: 1, borderRadius: 12, border: "1.5px dashed #D5D8DE", background: "#FAFAFB",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 32, textAlign: "center",
      }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect x="5" y="8" width="30" height="24" rx="3" stroke="#B4B9C2" strokeWidth="1.5" /><path d="M5 14h30M12 20h10M12 25h16" stroke="#B4B9C2" strokeWidth="1.5" strokeLinecap="round" /></svg>
        <div style={{ fontSize: 14, color: "#5C6370", maxWidth: 420, lineHeight: 1.5 }}>{s.note || "The real product screen appears here while Gaia guides the merchant from the sidebar."}</div>
        {s.highlight && (
          <div key={s.highlight} style={{
            marginTop: 8, padding: "8px 14px", borderRadius: 8, border: "1.5px solid " + ACCENT, background: ACCENT_LIGHT,
            color: ACCENT, fontSize: 13, fontWeight: 500, animation: "fadeInUp .35s ease-out both",
          }}>Highlighted: {s.highlight}</div>
        )}
      </div>
    </div>
  );
}
