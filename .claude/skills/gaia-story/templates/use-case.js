/* Use case: __TITLE__ (v__VERSION__)
 * __ONE_LINE_PURPOSE__
 * Payoff: __PAYOFF__. Spec: __NOTION_URL__
 * Never edit after it's published — add __ID__.v<N+1>.js (same id) and load that file instead.
 */
GaiaKit.defineUseCase({
  id: "__ID__",
  title: "__TITLE__",              // an outcome, never a module name
  pitch: "__PITCH__",              // one line under the option in the goal question
  payoff: "__PAYOFF__",
  notion: "__NOTION_URL__",
  ask: [
    // Clarifying question(s) that fill a parameter, only if the answer changes which modules run.
  ],
  modules: [
    // "module-id", or { module: "module-id", when: (ctx) => … }
  ],
  intro: (ctx, modules) => "Here's the plan: " + modules.map((m) => m.name.toLowerCase()).join(", then ") + ".",
  complete: [
    // { type: "confirm", label: "…" },
  ],
});
