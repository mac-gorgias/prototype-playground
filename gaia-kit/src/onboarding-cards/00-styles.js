/* Intent-routing microanimation CSS (IntentConceptCard), verbatim from the source prototype. */
const eduStyleEl = document.createElement("style");
eduStyleEl.setAttribute("data-gaia-kit", "onboarding-cards");
eduStyleEl.textContent = `
  @keyframes eduQuestionIn {
    0%, 2% { opacity: 0; transform: translateX(-10px); filter: blur(3px); }
    8%, 82% { opacity: 1; transform: translateX(0); filter: blur(0); }
    90%, 100% { opacity: 0; transform: translateX(4px); filter: blur(0); }
  }
  @keyframes eduQuestionFocus1 {
    0%, 11% { border-color: #9f82f7; background: #f4f0ff; color: #5c3cc4; box-shadow: 0 3px 12px rgba(126,85,246,.14); }
    14%, 100% { border-color: #e5e7eb; background: #fff; color: #1e242e; box-shadow: 0 2px 5px rgba(30,36,46,.035); }
  }
  @keyframes eduQuestionFocus2 {
    0%, 32%, 47%, 100% { border-color: #e5e7eb; background: #fff; color: #1e242e; box-shadow: 0 2px 5px rgba(30,36,46,.035); }
    34%, 44% { border-color: #9f82f7; background: #f4f0ff; color: #5c3cc4; box-shadow: 0 3px 12px rgba(126,85,246,.14); }
  }
  @keyframes eduQuestionFocus3 {
    0%, 65%, 80%, 100% { border-color: #e5e7eb; background: #fff; color: #1e242e; box-shadow: 0 2px 5px rgba(30,36,46,.035); }
    67%, 77% { border-color: #9f82f7; background: #f4f0ff; color: #5c3cc4; box-shadow: 0 3px 12px rgba(126,85,246,.14); }
  }
  @keyframes eduWireDraw {
    0%, 17% { opacity: 0; transform: scaleX(0); }
    25%, 82% { opacity: 1; transform: scaleX(1); }
    90%, 100% { opacity: 0; transform: scaleX(1); }
  }
  @keyframes eduPulseLeft {
    0%, 3% { opacity: 0; transform: translate3d(-3px,-50%,0) scale(.6); }
    5% { opacity: 1; transform: translate3d(-3px,-50%,0) scale(1); }
    11% { opacity: 1; transform: translate3d(36px,-50%,0) scale(1); }
    13%, 36% { opacity: 0; transform: translate3d(36px,-50%,0) scale(.6); }
    36.01% { opacity: 0; transform: translate3d(-3px,-50%,0) scale(.6); }
    38% { opacity: 1; transform: translate3d(-3px,-50%,0) scale(1); }
    44% { opacity: 1; transform: translate3d(36px,-50%,0) scale(1); }
    46%, 69% { opacity: 0; transform: translate3d(36px,-50%,0) scale(.6); }
    69.01% { opacity: 0; transform: translate3d(-3px,-50%,0) scale(.6); }
    71% { opacity: 1; transform: translate3d(-3px,-50%,0) scale(1); }
    77% { opacity: 1; transform: translate3d(36px,-50%,0) scale(1); }
    79%, 100% { opacity: 0; transform: translate3d(36px,-50%,0) scale(.6); }
  }
  @keyframes eduPulseRight {
    0%, 17% { opacity: 0; transform: translate3d(-3px,-50%,0) scale(.6); }
    19% { opacity: 1; transform: translate3d(-3px,-50%,0) scale(1); }
    25% { opacity: 1; transform: translate3d(36px,-50%,0) scale(1); }
    27%, 50% { opacity: 0; transform: translate3d(36px,-50%,0) scale(.6); }
    50.01% { opacity: 0; transform: translate3d(-3px,-50%,0) scale(.6); }
    52% { opacity: 1; transform: translate3d(-3px,-50%,0) scale(1); }
    58% { opacity: 1; transform: translate3d(36px,-50%,0) scale(1); }
    60%, 83% { opacity: 0; transform: translate3d(36px,-50%,0) scale(.6); }
    83.01% { opacity: 0; transform: translate3d(-3px,-50%,0) scale(.6); }
    85% { opacity: 1; transform: translate3d(-3px,-50%,0) scale(1); }
    91% { opacity: 1; transform: translate3d(36px,-50%,0) scale(1); }
    93%, 100% { opacity: 0; transform: translate3d(36px,-50%,0) scale(.6); }
  }
  @keyframes eduForkResponse {
    0%, 17% { opacity: 0; offset-distance: 0%; }
    19% { opacity: 1; offset-distance: 0%; }
    25% { opacity: 1; offset-distance: 100%; }
    27%, 83% { opacity: 0; offset-distance: 100%; }
    83.01% { opacity: 0; offset-distance: 0%; }
    85% { opacity: 1; offset-distance: 0%; }
    91% { opacity: 1; offset-distance: 100%; }
    93%, 100% { opacity: 0; offset-distance: 100%; }
  }
  @keyframes eduForkHandover {
    0%, 50% { opacity: 0; offset-distance: 0%; }
    52% { opacity: 1; offset-distance: 0%; }
    58% { opacity: 1; offset-distance: 100%; }
    60%, 100% { opacity: 0; offset-distance: 100%; }
  }
  @keyframes eduBrainIn {
    0%, 31% { opacity: 0; transform: scale(.88); filter: blur(4px); }
    39%, 82% { opacity: 1; transform: scale(1); filter: blur(0); }
    90%, 100% { opacity: 0; transform: scale(.97); filter: blur(0); }
  }
  @keyframes eduMarkThink {
    0%, 10%, 18%, 43%, 51%, 76%, 84%, 100% { transform: rotate(0) scale(1); }
    13%, 46%, 79% { transform: rotate(8deg) scale(1.08); }
  }
  @keyframes eduIntentIn {
    0%, 42% { opacity: 0; transform: translateY(5px); }
    49%, 82% { opacity: 1; transform: translateY(0); }
    90%, 100% { opacity: 0; transform: translateY(0); }
  }
  @keyframes eduIntentOne {
    0%, 10%, 33%, 100% { opacity: 0; transform: translateY(4px); }
    13%, 31% { opacity: 1; transform: translateY(0); }
  }
  @keyframes eduIntentTwo {
    0%, 43%, 66%, 100% { opacity: 0; transform: translateY(4px); }
    46%, 64% { opacity: 1; transform: translateY(0); }
  }
  @keyframes eduIntentThree {
    0%, 76%, 99%, 100% { opacity: 0; transform: translateY(4px); }
    79%, 97% { opacity: 1; transform: translateY(0); }
  }
  @keyframes eduOutcomeIn {
    0%, 34% { opacity: 0; transform: translateX(10px); filter: blur(3px); }
    39%, 82% { opacity: 1; transform: translateX(0); filter: blur(0); }
    90%, 100% { opacity: 0; transform: translateX(-3px); filter: blur(0); }
  }
  @keyframes eduSkillsPathFocus {
    0%, 23%, 33%, 89%, 99%, 100% { border-color: rgba(20,118,86,.2); background: #f8fbfa; box-shadow: none; }
    26%, 31%, 92%, 97% { border-color: #2b8a6e; background: #e8f4ef; box-shadow: 0 3px 12px rgba(20,118,86,.16); }
  }
  @keyframes eduTeamPathFocus {
    0%, 56%, 66%, 100% { border-color: rgba(126,85,246,.2); background: #fbfaff; box-shadow: none; }
    59%, 64% { border-color: #8e6cf1; background: #eee8ff; box-shadow: 0 3px 12px rgba(126,85,246,.16); }
  }
  @keyframes eduCaptionIn {
    0%, 5% { opacity: 0; transform: translateY(4px); }
    11%, 82% { opacity: 1; transform: translateY(0); }
    90%, 100% { opacity: 0; transform: translateY(0); }
  }
  .edu {
    margin: 4px 0 20px;
    padding: 20px 16px 18px;
    border: 1px solid rgba(0,0,0,.08);
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 2px 20px rgba(0,0,0,.04);
    overflow: hidden;
  }
  .edu-stage {
    display: grid;
    grid-template-columns: minmax(150px,1fr) 42px minmax(144px,.8fr) 42px minmax(240px,1.25fr);
    align-items: center;
    gap: 8px;
    min-height: 160px;
  }
  .edu-col { display: flex; flex-direction: column; justify-content: center; gap: 7px; min-width: 0; }
  .qb, .out {
    display: flex;
    align-items: center;
    min-height: 42px;
    padding: 10px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 7px;
    background: #fff;
    color: #1e242e;
    font-size: 13px;
    font-weight: 500;
    line-height: 18px;
    box-shadow: 0 2px 6px rgba(30,36,46,.06);
  }
  .qb.q1 { animation: eduQuestionFocus1 12s linear infinite both; }
  .qb.q2 { animation: eduQuestionFocus2 12s linear infinite both; }
  .qb.q3 { animation: eduQuestionFocus3 12s linear infinite both; }
  .wire { position: relative; display: block; height: 1px; background: #e4e0ec; }
  .wire::before {
    content: "";
    position: absolute;
    inset: 0;
    background: #7e55f6;
    transform: scaleX(0);
    transform-origin: left center;
    opacity: 1;
    transform: scaleX(1);
  }
  .pulse {
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 0;
    width: 7px;
    height: 7px;
    border: 2px solid #fff;
    border-radius: 50%;
    background: #7e55f6;
    box-shadow: 0 0 0 3px rgba(126,85,246,.16);
    opacity: 0;
    animation: eduPulseLeft 12s linear infinite both;
  }
  .pulse.p2 { animation-name: eduPulseRight; }
  .fork {
    position: relative;
    display: block;
    width: 42px;
    height: 144px;
  }
  .fork svg { display: block; width: 100%; height: 100%; overflow: visible; }
  .fork-dot {
    position: absolute;
    top: 0;
    left: 0;
    width: 7px;
    height: 7px;
    border: 2px solid #fff;
    border-radius: 50%;
    opacity: 0;
    offset-anchor: center;
  }
  .fork-dot.response {
    background: #147656;
    box-shadow: 0 0 0 3px rgba(20,118,86,.16);
    offset-path: path("M 0 72 H 10 C 16 72 16 34 23 34 H 42");
    animation: eduForkResponse 12s linear infinite both;
  }
  .fork-dot.handover {
    background: #7e55f6;
    box-shadow: 0 0 0 3px rgba(126,85,246,.16);
    offset-path: path("M 0 72 H 10 C 16 72 16 110 23 110 H 42");
    animation: eduForkHandover 12s linear infinite both;
  }
  .edu-brain {
    min-height: 150px;
    padding: 18px 14px;
    border: 1px solid rgba(126,85,246,.28);
    border-radius: 10px;
    background: #f8f6fe;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 18px;
    text-align: center;
  }
  .agent-mark {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    color: #7e55f6;
    background: #ede8f8;
    animation: eduMarkThink 12s cubic-bezier(.16,1,.3,1) infinite both;
  }
  .agent-mark img { width: 30px; height: 30px; display: block; }
  .intent {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #5c3cc4;
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
  }
  .intent-stack { position: relative; width: 100%; height: 32px; }
  .intent.i1 { animation: eduIntentOne 12s cubic-bezier(.16,1,.3,1) infinite both; }
  .intent.i2 { animation: eduIntentTwo 12s cubic-bezier(.16,1,.3,1) infinite both; }
  .intent.i3 { animation: eduIntentThree 12s cubic-bezier(.16,1,.3,1) infinite both; }
  .out {
    min-height: 68px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 9px;
    padding: 10px 12px;
  }
  .out.auto { color: #147656; animation: eduSkillsPathFocus 12s linear infinite both; }
  .out.hand { color: #5c3cc4; animation: eduTeamPathFocus 12s linear infinite both; }
  .out-icon { width: 18px; height: 18px; flex-shrink: 0; }
  .out-copy { display: flex; flex: 1; min-width: 0; flex-direction: column; align-items: flex-start; gap: 1px; }
  .out-title { font-size: 13px; font-weight: 650; line-height: 17px; }
  .out strong { color: #1e242e; font-size: 10px; font-weight: 600; line-height: 14px; }
  .out small { color: #6b7280; font-size: 10px; font-weight: 400; line-height: 14px; }
  .out.hand small { color: #6b5a9e; }
  .edu-caps {
    display: grid;
    grid-template-columns: minmax(150px,1fr) minmax(144px,.8fr) minmax(240px,1.25fr);
    gap: 58px;
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid #e8e8e5;
  }
  .cap {
    color: #5c6370;
    font-size: 11px;
    line-height: 15px;
    text-align: center;
    opacity: 1;
  }
  .edu:not(.is-running) *, .edu:not(.is-running) *::before { animation-play-state: paused !important; }
  @media (prefers-reduced-motion: reduce) {
    .slot-rotate-item * { animation: none !important; }
    .edu *, .edu *::before { animation: none !important; }
    .edu .qb, .edu .edu-brain, .edu .intent, .edu .out, .edu .cap { opacity: 1; transform: none; filter: none; }
    .edu .wire::before { opacity: 1; transform: scaleX(1); }
    .edu .pulse { display: none; }
    .edu .fork-dot { display: none; }
    .edu .intent:not(:first-child) { display: none; }
  }
  @media (max-width: 640px) {
    .edu { padding: 18px 16px 16px; }
    .edu-stage { display: flex; flex-direction: column; min-height: 0; }
    .edu-col, .edu-brain { width: 100%; }
    .wire { width: 1px; height: 24px; }
    .wire::before { animation: none; opacity: 1; transform: scaleY(1); transform-origin: center top; }
    .pulse { display: none; }
    .fork { width: 1px; height: 28px; background: #d8d2eb; }
    .fork svg, .fork-dot { display: none; }
    .edu-caps { grid-template-columns: 1fr; gap: 6px; }
    .cap { text-align: left; padding-left: 12px; position: relative; }
    .cap::before { content: ""; position: absolute; left: 0; top: 6px; width: 4px; height: 4px; border-radius: 50%; background: #7e55f6; }
  }
`;
document.head.appendChild(eduStyleEl);
