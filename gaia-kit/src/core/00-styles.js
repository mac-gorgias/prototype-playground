/* Fonts + global CSS (verbatim from the source prototype; edu* CSS lives in onboarding-cards). */
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;450;500;600;700&family=DM+Sans:wght@700&family=Feature+Deck:wght@400&family=Red+Hat+Mono:wght@500&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const styleEl = document.createElement("style");
styleEl.setAttribute("data-gaia-kit", "core");
styleEl.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: #FAFAF8; color: #1a1a1a; -webkit-font-smoothing: antialiased; overflow: hidden; }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
  @keyframes pulse { 0%, 100% { opacity: .4; } 50% { opacity: 1; } }
  @keyframes slideInRight { from { transform: translateX(100%); opacity:0; } to { transform: translateX(0); opacity:1; } }
  @keyframes slideOutRight { from { transform: translateX(0); opacity:1; } to { transform: translateX(100%); opacity:0; } }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes modalBackdropIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes shimmerSlide { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  @keyframes dotBounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-4px); } }
  @keyframes bubblePop { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  @keyframes cinematicWordIn {
    0% { opacity: 0; transform: translateY(20px); filter: blur(8px); }
    60% { opacity: 1; filter: blur(0); }
    100% { opacity: 1; transform: translateY(0); filter: blur(0); }
  }
  @keyframes cinematicIconPop {
    0% { opacity: 0; transform: scale(0.5) rotate(-12deg); }
    60% { opacity: 1; transform: scale(1.08) rotate(4deg); }
    100% { opacity: 1; transform: scale(1) rotate(0deg); }
  }
  @keyframes cinematicSlideUp {
    0% { opacity: 0; transform: translateY(24px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes overlayBackdropIn {
    0% { opacity: 0; backdrop-filter: blur(0px); -webkit-backdrop-filter: blur(0px); }
    100% { opacity: 1; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
  }
  @keyframes fullscreenConfettiFall {
    0%   { transform: translateY(-20px) rotate(0deg); opacity: 0; }
    8%   { opacity: 1; }
    100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
  }
  @keyframes welcomeLogoReveal {
    from { opacity: 0; transform: scale(0.94); filter: blur(12px); }
    to   { opacity: 1; transform: scale(1);    filter: blur(0px); }
  }
  @keyframes welcomeFlash {
    0%   { transform: translate(-50%, -50%) scale(0);  opacity: 0; }
    35%  { transform: translate(-50%, -50%) scale(8);  opacity: 0.9; }
    100% { transform: translate(-50%, -50%) scale(50); opacity: 0; }
  }
  @keyframes welcomeFadeUp {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slotSlideIn {
    from { transform: translateY(100%); opacity: 0; }
    to   { transform: translateY(0); opacity: 1; }
  }
  @keyframes slotSlideOut {
    from { transform: translateY(0); opacity: 1; }
    to   { transform: translateY(-100%); opacity: 0; }
  }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  @media (max-width: 900px) {
    .floating-checklist { display: none !important; }
  }

  .shimmer-text {
    background: linear-gradient(90deg, #8a8f99 0%, #d6d9de 50%, #8a8f99 100%);
    background-size: 200% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    animation: shimmerSlide 2.4s linear infinite;
  }

  /* Cinematic welcome entrance */
  .cinematic-welcome {
    position: absolute;
    inset: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    font-family: 'Inter', sans-serif;
    font-size: 56px;
    font-weight: 500;
    color: #1A1918;
    letter-spacing: -0.5px;
    background: #ffffff;
    z-index: 5;
    pointer-events: none;
    padding: 24px;
    text-align: center;
  }

  /* Toggle switch */
  .toggle-switch {
    position: relative;
    width: 36px;
    height: 20px;
    flex-shrink: 0;
    border-radius: 10px;
    background: #D1D5DB;
    cursor: pointer;
    transition: background .15s ease;
  }
  .toggle-switch.on { background: #7E55F6; }
  .toggle-switch.disabled { cursor: not-allowed; opacity: 0.85; }
  .toggle-switch-knob {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    transition: transform .18s ease;
    box-shadow: 0 1px 2px rgba(0,0,0,.2);
  }
  .toggle-switch.on .toggle-switch-knob {
    transform: translateX(16px);
  }

  /* Confetti */
  .fullscreen-confetti {
    position: fixed;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 2500;
  }
  .fullscreen-confetti span {
    position: absolute;
    top: -20px;
    width: 8px;
    height: 14px;
    border-radius: 1px;
    opacity: 0;
    animation: fullscreenConfettiFall 4s cubic-bezier(.16,1,.3,1) forwards;
  }

  input::placeholder, textarea::placeholder { color: #B0B0B0; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: transparent; border-radius: 10px; transition: background .3s; }
  *:hover::-webkit-scrollbar-thumb { background: #d5d5d0; }
  ::-webkit-scrollbar-track { background: transparent; }
`;
document.head.appendChild(styleEl);
