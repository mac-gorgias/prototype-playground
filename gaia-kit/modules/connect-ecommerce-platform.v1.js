/* Module: Connect ecommerce platform (v1) — re-cut from the Intent Enablement + Email Forwarding onboarding.
 * Win: Ecommerce platform connected. Sets answers: platform / platformText. */
(function () {
  const LEGACY = 10;
  const OPTIONS = [
    { key: "shopify", title: "Shopify", badge: "Recommended" },
    { key: "woocommerce", title: "WooCommerce" },
    { key: "bigcommerce", title: "BigCommerce" },
    { key: "magento", title: "Magento" },
    { key: "prestashop", title: "Prestashop" },
  ];
  const OTHER = [
    { type: "ai", delay: 300, speed: LEGACY, text: "No worries! You can connect your ecommerce platform later from your apps page." },
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
      { type: "ai", delay: 600, speed: LEGACY, text: "First things first, I'll need access to your store so everything we set up is built around how your business actually works." },
      {
        type: "choice", id: "platform", label: "platform-choice", tag: "platform", delay: 800,
        title: "Which ecommerce platform are you on?",
        options: (ctx) => OPTIONS.map((o) => ({
          ...o,
          badge: ctx.answers.platformRetry ? undefined : o.badge,
          then: o.key === "shopify" ? [
            {
              type: "connect", pill: "ecommerce", icon: "shopify",
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
              type: "ai", delay: 600, speed: LEGACY,
              text: (ctx) => ctx.plan.has("generate-tone-of-voice")
                ? "Got it. Now let me pull up some info about your brand so I can get the voice right."
                : "Got it. Your products, orders and customer info are now available in Gorgias.",
            },
          ] : OTHER,
        })),
        devAnswer: "shopify",
        freeform: { then: OTHER },
      },
    ],
  });
})();
