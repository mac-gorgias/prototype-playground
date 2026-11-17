/* Use case: Automate support (live). Payoff: first automated interaction.
 * OPEN (confirm with Julien): the planner now runs Connect email BEFORE Configure AI Agent Support, because
 * that module's win ("AI Agent enabled on a channel") requires a channel. The original onboarding did skills
 * first, then the inbox. To restore that order, drop "connect-email" from configure-ai-agent-support's
 * `requires`, move the enable step into its own module (or after Connect email), and revisit the copy that
 * assumes the inbox is already connected (connect-email's "not until you say so", the skills sign-off and
 * the recap line in configure-ai-agent-support).
 * Modules in order; the planner adds requirements (Generate tone of voice runs silently after the store
 * is connected) and drops anything already done on the account. The intro adapts to what's left. */
GaiaKit.defineUseCase({
  id: "automate-support",
  title: "Automate support",
  pitch: "Let AI Agent answer your most common customer questions.",
  payoff: "First automated interaction",
  notion: "https://app.notion.com/p/4101ae2178f581379581c369227825df",
  modules: ["connect-ecommerce-platform", "connect-email", "configure-ai-agent-support"],
  intro: (ctx, modules) => {
    const has = (id) => modules.some((m) => m.id === id);
    const store = has("connect-ecommerce-platform");
    const email = has("connect-email");
    const lead = "Great, let's get AI Agent handling the questions your team answers over and over.\n\n";
    const STORE = "connect your store so it can look up orders";
    const EMAIL = "connect your support inbox so it can respond to customers";
    const TEACH = "instruct it on how to answer";
    if (!has("configure-ai-agent-support")) return "AI Agent is already set up, so there's nothing left to do here.";
    if (store && email) return lead + "There are three steps: " + STORE + ", " + EMAIL + ", then " + TEACH + ".";
    if (email) return lead + "Your " + (ctx.answers.platformText || "store") + " store is already connected, so there are two steps left: " + EMAIL + ", then " + TEACH + ".";
    if (store) return lead + "Your inbox is already connected, so there are two steps left: " + STORE + ", then " + TEACH + ".";
    return "Great, your store and inbox are already connected, so we can go straight to instructing AI Agent on how to answer.";
  },
});
