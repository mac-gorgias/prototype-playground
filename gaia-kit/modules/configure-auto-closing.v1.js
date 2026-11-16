/* Module: Configure auto-closing tickets (v1) — SKELETON from the Consolidate channels spec (Story 4).
 * Evidence: spam auto-close closed real eBay / customer emails for some merchants → easy to turn off.
 * Win: Auto-close configured. Payoff: First ticket auto-closed. */
GaiaKit.defineModule({
  id: "configure-auto-closing", version: 1,
  name: "Configure auto-closing tickets",
  checklist: "Auto-close spam",
  type: "configure",
  win: "Auto-close configured",
  payoff: "First ticket auto-closed",
  notion: "https://app.notion.com/p/4161ae2178f580a29f42c64668021b62",
  steps: [
    { type: "ai", text: "Last thing: spam. I can close obvious junk automatically so it doesn't pile up in your inbox." },
    {
      type: "choice", id: "spamAutoClose", freeform: false, title: "Auto-close spam?",
      options: [
        { key: "on", title: "Yes, close spam automatically", badge: "Recommended" },
        { key: "off", title: "No, I'll review everything myself" },
      ],
    },
    { type: "confirm", label: (ctx) => (ctx.answers.spamAutoClose === "off" ? "Spam auto-close off" : "Spam auto-close on") },
  ],
});
