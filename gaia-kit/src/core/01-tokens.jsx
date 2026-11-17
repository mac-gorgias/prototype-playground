/* ─── Constants ─── */
const ACCENT = "#7E55F6";
const ACCENT_LIGHT = "#EDE8F8";
const BG = "#FAFAFA";
const CARD_BG = "#FFFFFF";
const BORDER = "#E5E5E5";
const TEXT = "#1a1a1a";
const TEXT_MUTED = "#8A8A8A";
const SURFACE = "#F2F2F2";

/* ─── Axiom button styles ─── */
const BTN_BASE = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  gap: 6, fontFamily: "'Inter', sans-serif", fontWeight: 600,
  borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap",
  boxSizing: "border-box", transition: "background .15s, box-shadow .15s, border-color .15s",
};
const BTN_MD = { ...BTN_BASE, height: 32, fontSize: 14, lineHeight: "20px", padding: "0 12px" };
const BTN_SM = { ...BTN_BASE, height: 24, fontSize: 12, lineHeight: "16px", padding: "0 8px", borderRadius: 6 };
const BTN_PRIMARY = {
  ...BTN_MD, color: "#fff", background: "#1E242E",
  border: "1px solid transparent",
  boxShadow: "0px 2px 3px 0px rgba(0,0,0,0.05)",
};
const BTN_PRIMARY_HOVER = { background: "#333" };
const BTN_PRIMARY_LEAVE = { background: "#1E242E" };
const BTN_SECONDARY = {
  ...BTN_MD, color: "#1E242E", background: "rgba(255,255,255,0.5)",
  border: "1px solid rgba(103,113,131,0.5)",
  boxShadow: "0px 2px 3px 0px rgba(0,0,0,0.05)",
};
const BTN_SECONDARY_HOVER = { background: "rgba(27,35,50,0.03)", boxShadow: "none" };
const BTN_SECONDARY_LEAVE = { background: "rgba(255,255,255,0.5)", boxShadow: "0px 2px 3px 0px rgba(0,0,0,0.05)" };
const BTN_TERTIARY = {
  ...BTN_MD, color: "#1E242E", background: "transparent",
  border: "1px solid transparent", boxShadow: "none",
};
const BTN_TERTIARY_HOVER = { background: "rgba(27,35,50,0.03)" };
const BTN_TERTIARY_LEAVE = { background: "transparent" };
const BTN_SECONDARY_SM = { ...BTN_SM, color: "#1E242E", background: "rgba(255,255,255,0.5)", border: "1px solid rgba(103,113,131,0.5)", boxShadow: "0px 2px 3px 0px rgba(0,0,0,0.05)" };
const BTN_TERTIARY_SM = { ...BTN_SM, color: "#1E242E", background: "transparent", border: "1px solid transparent", boxShadow: "none" };

const THREAD_TEXT_STYLE = {
  fontSize: 14, lineHeight: 1.55, color: "#1E242E",
  fontFamily: "'Inter', sans-serif", fontWeight: 450,
};

const MONO_FONT = "'Red Hat Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

/* ─── Layout tokens (values lifted from the email-forwarding prototype's IntakePage) ─── */
const LAYOUT = {
  threadMaxWidth: 740,          // thread column + composer column
  threadPadding: "48px 0 36px", // scroller padding (top / bottom)
  columnPadX: 24,               // horizontal padding inside the column
  contentInset: 16,             // white content card margin from the window edge
  contentRadius: 16,
  contentBorder: "1px solid #EBECEF",
  panelWidth: 500,              // PreviewPanel / EditPanel width (fixed, inset 16)
  contentRightMarginOpen: 532,  // panelWidth + 2 × inset — content shifts left when a panel opens
  fadeHeight: 24,               // white gradient above the composer
  composerPadding: "16px 24px 24px",
  checklistWidth: 280,
  stickToBottomThreshold: 80,   // px from bottom that still counts as "following" the thread
  gaiaSidebarWidth: 420,        // Gaia docked as a sidebar (UI mode "sidebar")
  sidebarGap: 12,               // gap between the product placeholder and the Gaia sidebar
};

/* ─── Timing tokens ─── */
const TIMING = {
  typeMs: 8,            // GaiaTypedLine default (newest refinement)
  legacyTypeMs: 10,     // unused: narration always types at typeMs (step.speed is ignored)
  panelClose: 180,      // side panel slide-out before unmount
  introClose: 500,      // WelcomeIntro fade-out before the thread starts
  researchSourceMs: 1800,
  researchTransitionMs: 300,
  researchSettleMs: 400,
  freeChatReplyMs: 1000,
  editChatReplyMs: 800,
  afterUserMs: 650,     // min gap between a user bubble and the next thing Gaia shows (bubble floats in over .35s)
};

/* ─── Brand + asset helpers ─── */
const brand = () => GaiaKit.brand || {};
const asset = (name) => ASSET_BASE + name;
