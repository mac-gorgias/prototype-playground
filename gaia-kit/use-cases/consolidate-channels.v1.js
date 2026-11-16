/* Use case: Consolidate channels (milestone 1). Payoff: tickets from 2+ channels received in the inbox.
 * Spec: https://app.notion.com/p/4141ae2178f580519fd3ff9dba844ad3
 * Clarifying question (channels) fills the parameter; one channel module per selected channel. */
(function () {
  const picked = (key) => (ctx) => (ctx.answers.channels || []).includes(key);
  const CHANNEL_NAMES = { email: "email", social: "social", chat: "chat" };
  GaiaKit.defineUseCase({
    id: "consolidate-channels",
    title: "Consolidate channels",
    pitch: "Bring email, social and chat into one inbox.",
    payoff: "Tickets from 2+ channels received in the inbox",
    notion: "https://app.notion.com/p/4141ae2178f580519fd3ff9dba844ad3",
    ask: [
      { type: "ai", delay: 500, text: "Great — let's get every conversation into one place so you and your team can keep up." },
      {
        type: "multi", id: "channels", title: "Which channels do you want to connect first?", confirmLabel: "Continue",
        options: [
          { key: "email", label: "Email — the support address your customers write to" },
          { key: "social", label: "Social — Facebook, Instagram and Messenger" },
          { key: "chat", label: "Chat — Gorgias chat on your website" },
        ],
        initial: [],
        devAnswer: ["email", "social", "chat"],
        reply: (ctx) => {
          const names = (ctx.answers.channels || []).map((k) => CHANNEL_NAMES[k]);
          return names.length ? names.join(", ").replace(/^./, (c) => c.toUpperCase()) : "None for now";
        },
      },
    ],
    modules: [
      { module: "connect-email", when: picked("email") },
      { module: "connect-social", when: picked("social") },
      { module: "install-chat", when: picked("chat") },
      "configure-assignment",
      "configure-assignment-notification",
      "configure-auto-closing",
      "inbox-tour",
      "ticket-tour",
    ],
    intro: (ctx, modules) => "Here's the plan. We'll connect your channels one at a time, make sure new tickets reach you, then I'll show you around your inbox.",
    complete: [
      { type: "confirm", label: "Your channels are in one inbox" },
      { type: "ai", delay: 400, text: "That's it. Every new message from your connected channels now lands in one inbox, assigned to the right person." },
    ],
  });
})();
