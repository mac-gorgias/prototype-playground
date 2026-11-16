/* Module: Install chat (v1) — SKELETON from the Consolidate channels spec (Story 3) + catalog.
 * Sidebar mode: chat settings with a live preview is product UI (Notion UI mode rule).
 * Win: Chat tested on production. Payoff: First real conversation received. */
GaiaKit.defineModule({
  id: "install-chat", version: 1,
  name: "Install chat",
  checklist: "Install chat on your website",
  type: "configure",
  ui: "sidebar",
  surface: { title: "Chat settings", note: "Chat widget settings with a live preview of the widget on the store." },
  win: "Chat tested on production",
  payoff: "First real conversation received",
  notion: "https://app.notion.com/p/4141ae2178f580f19f8dc6fd69fe6d7c",
  steps: [
    { type: "ai", delay: 500, text: "Here's your chat widget. I've matched it to {{brand.name}}'s colors — you can tweak them in the preview." },
    { type: "surface", highlight: "Live preview" },
    {
      type: "choice", id: "chatInstall", title: "How do you want to add chat to your site?",
      options: (ctx) => [
        ctx.answers.platform === "shopify"
          ? { key: "shopify", title: "Add it with the Shopify app", badge: "Recommended" }
          : { key: "snippet", title: "Copy the code snippet", badge: "Recommended" },
        { key: "developer", title: "Send instructions to my developer" },
      ],
      devAnswer: "snippet",
    },
    { type: "verify", ms: 1200 },
    { type: "confirm", label: "Chat installed on {{brand.domain}}" },
    { type: "surface", highlight: "Test conversation" },
    { type: "ai", text: "Send a test message from {{brand.domain}}. It'll show up here in a few seconds." },
    { type: "choice", id: "chatTest", title: "Did your test message come through?", options: [
      { key: "yes", title: "Yes, I see it" },
      { key: "no", title: "Not yet", then: [{ type: "ai", text: "It can take a minute after installing. I'll keep an eye on it — you can carry on." }] },
    ] },
    { type: "confirm", label: "Chat tested on {{brand.domain}}" },
  ],
});
