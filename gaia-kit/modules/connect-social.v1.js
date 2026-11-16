/* Module: Connect social (v1) — SKELETON from the Consolidate channels spec (Story 3) + catalog.
 * Win: Social channel connected. Payoff (proposed): first ticket or message received from that network.
 * Evidence: Facebook, Messenger and Instagram are one Meta connection; merchants couldn't find Instagram. */
GaiaKit.defineModule({
  id: "connect-social", version: 1,
  name: "Connect social",
  checklist: "Connect Facebook & Instagram",
  type: "configure",
  win: "Social channel connected",
  payoff: "First ticket or message received from that network (proposed)",
  notion: "https://app.notion.com/p/4141ae2178f58002b789c79c148eb273",
  steps: [
    { type: "ai", delay: 600, text: "Next, social. Facebook, Instagram and Messenger come in through one Meta connection, so you'll only sign in once." },
    {
      type: "connect", pill: "Social",
      heading: "Connect Facebook & Instagram",
      body: "Comments and DMs from your pages will arrive as tickets in your inbox.",
      connectLabel: "Connect with Meta",
      url: "https://www.facebook.com/login",
      secondaryLabel: "I don't use social for support",
      onSecondary: [{ type: "exit-module", reason: "merchant doesn't use social" }],
      connectedLabel: "Facebook, Instagram and Messenger connected",
    },
    { type: "ai", text: "Done. New comments and DMs will show up next to your emails." },
  ],
});
