/* Module: Ticket tour (v1) — SKELETON from the Consolidate channels spec (Story 5). Educate, sidebar mode.
 * Win: Tour finished. */
GaiaKit.defineModule({
  id: "ticket-tour", version: 1,
  name: "Ticket tour",
  checklist: "Tour a ticket",
  type: "educate",
  ui: "sidebar",
  surface: { title: "Ticket", note: "A sample ticket: conversation, customer details and reply box." },
  win: "Tour finished",
  payoff: null,
  notion: "https://app.notion.com/p/4161ae2178f5802d99eaf60516b5334c",
  steps: [
    { type: "surface", highlight: "Conversation" },
    { type: "ai", delay: 500, text: "This is a ticket. The whole conversation stays in one thread, whichever channel the customer used." },
    { type: "surface", highlight: "Customer details" },
    { type: "ai", delay: 400, text: "On the right you'll see who the customer is and their recent orders." },
    { type: "surface", highlight: "Reply box" },
    { type: "ai", delay: 400, text: "Reply at the bottom. Your answer goes back on the same channel the customer wrote from." },
    { type: "choice", id: "ticketTourDone", freeform: false, title: "Got it?", options: [{ key: "done", title: "Got it" }] },
  ],
});
