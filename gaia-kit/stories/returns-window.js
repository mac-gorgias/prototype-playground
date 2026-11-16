/* Use case: Returns & exchanges skill (example mini-story).
 * Embeds after the onboarding "skills" chapter; also runs standalone.
 * Built-in step types only — no JSX, loads from file://.
 *
 * Answers set: returnWindow / returnWindowText, returnShipping / returnShippingText, returnsApp
 */
(function () {
  window.GaiaStories = window.GaiaStories || {};
  window.GaiaStories["returns-window"] = {
    id: "returns-window",
    title: "Returns & exchanges skill",
    anchor: { after: "skills" }, // suggested placement when embedded in the onboarding
    steps: [
      { chapter: "returns", title: "Returns skill" },
      { type: "ai", delay: 600, text: "One more skill worth setting up now: returns and exchanges. It's usually the second most common request for stores like {{brand.name}}." },
      {
        type: "choice", id: "returnWindow", delay: 300,
        title: "How long do customers have to return an item?",
        options: [
          { key: "30", title: "30 days", badge: "AI detected" },
          { key: "60", title: "60 days" },
          { key: "none", title: "We don't accept returns", then: [
            { type: "ai", text: "Got it. I'll draft the skill so AI Agent explains the policy kindly and offers a replacement for damaged items instead." },
            { type: "goto", to: "returns-done" },
          ] },
        ],
        devAnswer: "30",
      },
      {
        type: "choice", id: "returnShipping",
        title: "Who pays for return shipping?",
        options: [
          { key: "store", title: "We do — prepaid label" },
          { key: "customer", title: "The customer" },
        ],
      },
      { type: "ai", text: "Connecting your returns app lets AI Agent create the return for the customer instead of handing it over." },
      {
        type: "connect",
        pill: "Returns", icon: "shopify",
        heading: "Connect Loop Returns",
        body: "Let AI Agent start returns and send prepaid labels.",
        connectLabel: "Connect Loop",
        url: "https://www.loopreturns.com/",
        secondaryLabel: "Skip for now",
        onSecondary: [{ type: "set", values: { returnsApp: "skipped" } }],
        connectedLabel: "Connected to Loop Returns",
      },
      { label: "returns-done" },
      { type: "confirm", label: (ctx) => "Returns skill drafted" + (ctx.answers.returnWindowText && ctx.answers.returnWindow !== "none" ? " · " + ctx.answers.returnWindowText : "") },
    ],
  };
})();
