/* Module: __NAME__ (v__VERSION__)
 * __ONE_LINE_PURPOSE__
 * Win: __WIN__. Payoff: __PAYOFF__.
 * Notion: __NOTION_URL__
 * Plain JS (no JSX) so it loads from file://. Never edit after it's published — add __ID__.v<N+1>.js instead.
 * Answers it sets: __ANSWER_IDS__
 */
GaiaKit.defineModule({
  id: "__ID__", version: __VERSION__,
  name: "__NAME__",                 // verb-led, same as the Notion catalog
  checklist: "__CHECKLIST_LABEL__", // short merchant-facing label for the floating checklist
  type: "configure",                // or "educate"
  ui: "full",                       // "sidebar" when the step shows real product UI (tours, settings with preview)
  // surface: { title: "Inbox", note: "What the real product screen shows here." },   // sidebar only
  win: "__WIN__",
  payoff: "__PAYOFF__",
  requires: [],                     // hard requirements (module ids) — the planner adds them first
  unlocks: [],                      // modules this makes possible — feeds the best next action
  // available: (ctx) => true,      // false at start → lockedSteps run, no win
  // lockedSteps: [],
  // offer: { line, title, yes, no, intro },   // copy when offered as the best next action
  notion: "__NOTION_URL__",
  steps: [
    { type: "ai", delay: 600, text: "__FIRST_GAIA_LINE__" },
    // …steps (reference/step-types.md + reference/modules.md)…
  ],
});
