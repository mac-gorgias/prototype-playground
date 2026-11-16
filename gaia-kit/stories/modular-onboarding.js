/* Modular onboarding root story: signup → intro → welcome → goal question → the chosen use case,
 * planned from modules → best next action.
 *
 *   GaiaStories.modularOnboarding({ useCases: ["automate-support", "consolidate-channels"], title, scenarios })
 *   GaiaStories["modular-onboarding"]  → milestone 1 default (the two live use cases)
 *
 * Load after the kit, a brand, the module files and the use-case files (the goal question reads their titles). */
(function () {
  const K = window.GaiaKit;
  const DEFAULT_SCENARIOS = [
    { key: "new", title: "New trial account" },
    { key: "shopify", title: "Shopify already connected", done: ["connect-ecommerce-platform"], answers: { platform: "shopify", platformText: "Shopify" } },
    { key: "email", title: "Email already connected", done: ["connect-email"], answers: { inbox: "gmail", inboxText: "Gmail" } },
  ];

  function modularOnboarding({ useCases, title, scenarios, goalTitle, devAnswer } = {}) {
    const ids = useCases && useCases.length ? useCases : ["automate-support", "consolidate-channels"];
    return {
      id: "modular-onboarding",
      title: title || "Gaia onboarding — modular",
      steps: [
        { chapter: "signup", title: "Signup" },
        { type: "screen", screen: "signup" },
        { chapter: "intro", title: "Intro" },
        { type: "screen", screen: "intro" },
        { chapter: "welcome", title: "Welcome" },
        { type: "ai", delay: 500, speed: 10, text: "I'm Gaia, your Gorgias AI assistant, and I will work alongside you to learn about {{brand.name}}' shoppers, priorities, and challenges." },
        { type: "ai", delay: 900, speed: 10, text: "By the end of this conversation, {{brand.name}} will be set up and ready for customers." },
        { chapter: "goal", title: "Goal question" },
        K.goalQuestion(ids, { delay: 800, devAnswer: devAnswer || ids[ids.length - 1], ...(goalTitle ? { title: goalTitle } : {}) }),
      ],
      scenarios: scenarios || DEFAULT_SCENARIOS,
      home: {},
    };
  }

  window.GaiaStories = window.GaiaStories || {};
  window.GaiaStories.modularOnboarding = modularOnboarding;
  window.GaiaStories["modular-onboarding"] = modularOnboarding({ title: "Gaia onboarding — modular (M1)" });
})();
