/* Use case: Automate support (live). Payoff: first automated interaction.
 * OPEN (confirm with Julien): the planner now runs Connect email BEFORE Configure AI Agent Support, because
 * that module's win ("AI Agent enabled on a channel") requires a channel. The original onboarding did skills
 * first, then the inbox. To restore that order, drop "connect-email" from configure-ai-agent-support's
 * `requires` and move the enable step into its own module (or after Connect email).
 * Modules in order; the planner adds requirements (Generate tone of voice runs silently after the store
 * is connected) and drops anything already done on the account. */
GaiaKit.defineUseCase({
  id: "automate-support",
  title: "Automate support",
  pitch: "Let AI Agent answer your most common customer questions.",
  payoff: "First automated interaction",
  notion: "https://app.notion.com/p/4101ae2178f581379581c369227825df",
  modules: ["connect-ecommerce-platform", "connect-email", "configure-ai-agent-support"],
  intro: (ctx, modules) => modules.length === 1
    ? "Let's " + modules[0].name.toLowerCase() + "."
    : "Here's the plan: " + modules.map((m) => m.name.toLowerCase()).join(", then ") + ". AI Agent needs a Shopify store, so we'll start there.",
});
