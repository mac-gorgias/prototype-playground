/* Module: Configure assignment notification (v1) — SKELETON from the Consolidate channels spec (Story 4).
 * Default on; skipped when the merchant's email is a connected support address.
 * Win: Assignment notification rule enabled. Payoff (proposed): first notification email sent. */
GaiaKit.defineModule({
  id: "configure-assignment-notification", version: 1,
  name: "Configure assignment notification",
  checklist: "Get notified about new tickets",
  type: "configure",
  win: "Assignment notification rule enabled",
  payoff: "First assignment notification email sent (proposed)",
  notion: "https://app.notion.com/p/4161ae2178f58006b071e2e2381f28be",
  steps: [
    { type: "ai", text: "I've also turned on email notifications, so you'll know the moment a ticket is assigned to you." },
    { type: "confirm", label: "Notifications on for assigned tickets" },
  ],
});
