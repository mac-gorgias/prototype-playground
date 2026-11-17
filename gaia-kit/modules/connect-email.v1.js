/* Module: Connect email (v1) — re-cut from the onboarding's channels / forwarding / domain chapters.
 * Shared by Automate support and Consolidate channels: copy adapts with ctx.plan.has(...).
 * Win: Email connected. Payoff: First ticket received by email.
 * Sets answers: inbox / inboxText, supportEmail, displayName, dnsProvider / dnsProviderText, dnsDone. */
(function () {
  const K = GaiaKit;
  // AI framing only when AI Agent can actually follow (Shopify, or platform not asked yet).
  const forAI = (ctx) => ctx.plan.has("configure-ai-agent-support")
    && (!ctx.answers.platform || ctx.answers.platform === "shopify");
  const isFirst = (ctx) => ctx.plan.modules[0] === "connect-email"; // plan already excludes modules done before it started

  const connectEmail = (provider) => [{
    type: "connect", pill: "Email", icon: "email",
    heading: "Connect your " + provider.name,
    body: "Connect " + provider.name + " so new customer emails come straight into Gorgias.",
    connectLabel: "Connect " + provider.name,
    url: provider.url,
    secondaryLabel: "Use a different email provider",
    onSecondary: [{ type: "retract", tag: "inbox" }, { type: "goto", to: "inbox-choice" }],
  }];

  const FORWARDING = [
    { type: "ai", text: "What's the support address your customers write to?" },
    { type: "input", id: "supportEmail", placeholder: "e.g. {{brand.forwarding.supportEmail}}", devAnswer: (ctx) => ctx.brand.forwarding.supportEmail },
    { type: "ai", text: "Great! And what name should customers see when you reply?" },
    { type: "input", id: "displayName", placeholder: "e.g. {{brand.forwarding.displayName}}", devAnswer: (ctx) => ctx.brand.forwarding.displayName },
    { type: "ai", text: "Now we’ll forward that address to Gorgias. It takes a couple of steps in your email provider, and I’ll walk you through them." },
    { type: "card", component: "ForwardingInstructions" },
    {
      type: "choice", label: "fwd-steps", title: "Done with these steps?",
      options: [{ key: "done", title: "Yes, I’m done" }],
      freeform: { then: [
        { type: "ai", text: "No problem. The video and Help Center guide cover each email provider. Once you’ve added the forwarding address, let me know and I’ll check it." },
        { type: "goto", to: "fwd-steps" },
      ] },
    },
    { type: "verify", ms: 1100 },
    { type: "confirm", label: "Email forwarding verified" },
    { type: "ai", text: "Forwarding works. One last thing: verify your domain so replies sent from Gorgias come from your own address and stay out of spam folders." },
    {
      type: "choice", id: "dnsProvider", title: "Where do you manage your domain?",
      subtitle: "This is where the DNS records for {{brand.forwarding.domain}} live.",
      options: () => K.DNS_PROVIDER_OPTIONS,
    },
    { type: "ai", text: "This short video will show you where to make the changes in {{answers.dnsProviderText}}." },
    { type: "card", component: "VideoPlaceholder", props: (ctx) => ({ label: ctx.answers.dnsProviderText + " domain verification video placeholder" }) },
    { type: "ai", text: (ctx) => "Copy each row below into " + ctx.answers.dnsProviderText + " for " + ctx.brand.forwarding.domain + ". Once you save, it can take up to 72 hours to verify." },
    { type: "card", component: "DnsRecordsTable", props: (ctx) => ({ provider: ctx.answers.dnsProviderText }) },
    { type: "card", component: "SupportLine", props: (ctx) => {
      const p = ctx.answers.dnsProviderText; const docs = K.DNS_PROVIDER_DOCS[p];
      return { href: docs || ctx.brand.forwarding.helpUrl, linkText: docs ? p + "’s documentation here" : "Help Center documentation here" };
    } },
    {
      type: "choice", id: "dnsDone", label: "dns-done", title: "Have you added these records in {{answers.dnsProviderText}}?",
      options: [
        { key: "verified", title: "I’m done", then: [{ type: "verify", ms: 1100 }, { type: "confirm", label: "Domain successfully verified" }, { type: "wait", ms: 700 }] },
        { key: "later", title: "I’ll do it later", then: [{ type: "ai", text: "No problem. Your records will stay here, and you can finish domain verification later from your email channel settings." }] },
      ],
      freeform: { then: [
        { type: "ai", text: "Got it. DNS changes can be fiddly — the documentation above walks through it step by step, and you can always finish this later from your email channel settings." },
        { type: "goto", to: "dns-done" },
      ] },
    },
  ];

  const OTHER_PROVIDER = [
    { type: "ai", tag: "inbox", delay: 300, text: "I can't connect that provider directly, but I can set it up with email forwarding — or you can connect Gmail or Outlook instead." },
    {
      type: "choice", bubble: false, freeform: false, title: "What would you like to do?",
      options: [
        { key: "forwarding", title: "Set up email forwarding", badge: "Recommended", then: [
          { type: "retract", tag: "inbox" },
          { type: "user", text: "Email forwarding", tag: "inbox" },
          { type: "set", values: { inbox: "forwarding" } },
          { type: "group", steps: FORWARDING },
        ] },
        { key: "connect", title: "Connect Gmail or Outlook", then: [{ type: "retract", tag: "inbox" }, { type: "goto", to: "inbox-choice" }] },
      ],
    },
  ];

  GaiaKit.defineModule({
    id: "connect-email", version: 1,
    name: "Connect email",
    checklist: "Connect support email",
    type: "configure",
    win: "Email connected",
    payoff: "First ticket received by email",
    unlocks: ["configure-ai-agent-support"],
    notion: "https://app.notion.com/p/4141ae2178f580699f6eef11113e8d58",
    steps: [
      {
        // Non-Shopify in Automate support: the store step already led into the inbox, so skip the opener.
        type: "when", if: (ctx) => forAI(ctx) || !ctx.plan.has("configure-ai-agent-support"),
        then: [{
          type: "ai", delay: 600,
          text: (ctx) => forAI(ctx)
            ? (isFirst(ctx) ? "Let's start by connecting" : "Next, let's connect") + " the inbox your customers already email. AI Agent will reply from it, but not until you say so."
            : "Let's start with email. Connecting your support inbox brings every customer email into Gorgias.",
        }],
      },
      {
        type: "choice", id: "inbox", label: "inbox-choice", tag: "inbox", delay: 500,
        title: "How do you want to connect your support email?",
        options: [
          { key: "gmail", title: "Gmail", then: connectEmail({ name: "Gmail", url: "https://accounts.google.com/o/oauth2/auth" }) },
          { key: "microsoft", title: "Outlook", then: connectEmail({ name: "Outlook", url: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize" }) },
          { key: "forwarding", title: "Email forwarding", then: FORWARDING },
        ],
        devAnswer: "gmail",
        freeform: { then: OTHER_PROVIDER },
      },
      { type: "confirm", label: (ctx) => (ctx.answers.inbox === "forwarding" ? "Email channel connected" : (ctx.answers.inbox === "microsoft" ? "Outlook" : "Gmail") + " inbox connected") },
      {
        type: "ai",
        text: (ctx) => {
          const address = ctx.answers.inbox === "forwarding" ? (ctx.answers.supportEmail || ctx.brand.forwarding.supportEmail) : ctx.brand.inboxEmail;
          return "Done. New emails to " + address + " will now show up in Gorgias as tickets.";
        },
      },
    ],
  });
})();
