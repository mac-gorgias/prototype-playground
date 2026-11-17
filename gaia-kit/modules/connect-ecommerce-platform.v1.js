/* Module: Connect ecommerce platform (v1) — re-cut from the Intent Enablement + Email Forwarding onboarding.
 * Copy adapts when AI Agent is in the plan (Automate support, or the AI Agent offer after Consolidate channels).
 * Win: Ecommerce platform connected. Sets answers: platform / platformText. */
(function () {
  const forAI = (ctx) => ctx.plan.has("configure-ai-agent-support");
  const OPTIONS = [
    { key: "shopify", title: "Shopify", badge: "Recommended" },
    { key: "woocommerce", title: "WooCommerce" },
    { key: "bigcommerce", title: "BigCommerce" },
    { key: "magento", title: "Magento" },
    { key: "prestashop", title: "Prestashop" },
  ];
  const OTHER = [
    {
      type: "ai", delay: 300,
      text: (ctx) => {
        if (!forAI(ctx)) return "No worries! You can connect your ecommerce platform later from your apps page.";
        const on = ctx.answers.platform && ctx.answers.platform !== "other" ? " on " + ctx.answers.platformText : "";
        const next = ctx.plan.has("connect-email") && !ctx.isDone("connect-email")
          ? " Let's still connect your support inbox so customer emails come into Gorgias."
          : "";
        return "Got it. AI Agent only works with Shopify for now, so we can't set it up" + on + " yet." + next;
      },
    },
    { type: "exit-module", reason: "non-Shopify platform — connect later" },
  ];
  GaiaKit.defineModule({
    id: "connect-ecommerce-platform", version: 1,
    name: "Connect ecommerce platform",
    type: "configure",
    win: "Ecommerce platform connected",
    payoff: null,
    unlocks: ["configure-ai-agent-support"],
    notion: null,
    steps: [
      {
        type: "ai", delay: 600,
        // AI context: the line after connecting says why the store matters, so keep the opener short.
        text: (ctx) => forAI(ctx)
          ? "Let's start with your store."
          : "First things first, I'll need access to your store so everything we set up is built around how your business actually works.",
      },
      {
        type: "choice", id: "platform", label: "platform-choice", tag: "platform", delay: 800,
        title: "Which ecommerce platform are you on?",
        options: (ctx) => OPTIONS.map((o) => ({
          ...o,
          badge: ctx.answers.platformRetry ? undefined : o.badge,
          then: o.key === "shopify" ? [
            {
              type: "connect", pill: "Ecommerce", icon: "shopify",
              heading: "Connect your Shopify store",
              body: "Connect Shopify so I can pull in your products, orders, and customer info.",
              connectLabel: "Connect Shopify",
              url: "https://apps.shopify.com/helpdesk?st_source=autocomplete&surface_detail=autocomplete_apps",
              secondaryLabel: "Use a different platform",
              onSecondary: [
                { type: "retract", tag: "platform" },
                { type: "set", values: { platformRetry: true } },
                { type: "goto", to: "platform-choice" },
              ],
              connectedLabel: "Connected to Shopify",
            },
            {
              type: "ai", delay: 600,
              text: (ctx) => {
                if (!forAI(ctx)) return "Got it. Your products, orders and customer info are now available in Gorgias.";
                return "That's your store connected. AI Agent can now look up orders, products and customers.";
              },
            },
          ] : OTHER,
        })),
        devAnswer: "shopify",
        freeform: { then: OTHER },
      },
    ],
  });
})();
