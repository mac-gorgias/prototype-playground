/* Module: Inbox tour (v1) — SKELETON from the Consolidate channels spec (Story 5). Educate, sidebar mode.
 * Gaia explains each part while it's highlighted in the product. Skippable (win = false).
 * Win: Tour finished. */
GaiaKit.defineModule({
  id: "inbox-tour", version: 1,
  name: "Inbox tour",
  checklist: "Tour your inbox",
  type: "educate",
  ui: "sidebar",
  surface: { title: "Inbox", note: "The Gorgias inbox with the merchant's first tickets." },
  win: "Tour finished",
  payoff: null,
  notion: "https://app.notion.com/p/4141ae2178f5808b86c1f9f82b1a98f3",
  steps: [
    { type: "ai", delay: 500, text: "Here's your inbox — everything from email, social and chat lands here." },
    { type: "surface", highlight: "Views" },
    { type: "ai", delay: 400, text: "On the left are your views. Start with Unassigned and Mine; you can make your own later." },
    { type: "surface", highlight: "Ticket list" },
    { type: "ai", delay: 400, text: "In the middle is the ticket list. The channel icon shows where each message came from." },
    { type: "choice", id: "inboxTourNext", freeform: false, title: "Ready to open a ticket?", options: [{ key: "next", title: "Show me a ticket" }] },
  ],
});
