/* Module: Configure assignment (v1) — SKELETON from the Consolidate channels spec (Story 4).
 * Default: auto-assign to the merchant; refining it to teammates offers "Invite users" (plan update, later).
 * Win: Auto-assignment rule configured and auto-assign turned on. Payoff: First ticket assigned to a user. */
GaiaKit.defineModule({
  id: "configure-assignment", version: 1,
  name: "Configure assignment",
  checklist: "Route new tickets",
  type: "configure",
  win: "Auto-assignment rule configured and turned on",
  payoff: "First ticket assigned to a user",
  notion: "https://app.notion.com/p/4141ae2178f5808b884bf5f23b68ecd0",
  steps: [
    { type: "ai", delay: 600, text: "Your channels are in. Now let's make sure every new ticket lands with someone, so nothing sits unanswered." },
    {
      type: "choice", id: "assignTo", title: "Who should new tickets go to?",
      options: [
        { key: "me", title: "Me", badge: "Recommended" },
        { key: "team", title: "Split them across my team", then: [
          { type: "ai", text: "I'll split them evenly. You can invite teammates from Settings › Users — I'll remind you at the end." },
        ] },
      ],
    },
    { type: "confirm", label: "Auto-assignment on" },
  ],
});
