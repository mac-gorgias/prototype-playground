/* Module: Connect email (v1) — re-cut from the onboarding's channels / forwarding / domain chapters.
 * Shared by Automate support and Consolidate channels: copy adapts with ctx.plan.has(...).
 * Win: Email connected. Payoff: First ticket received by email.
 * Sets answers: inbox / inboxText, supportEmail, displayName, dnsProvider / dnsProviderText, dnsDone. */
(function () {
  const LEGACY = 10;
  const K = GaiaKit;
  const forAI = (ctx) => ctx.plan.has("configure-ai-agent-support");

  const connectEmail = (provider) => [{
    type: "connect", pill: "Email", icon: "email",
    heading: "Connect your " + provider.name,
    body: (ctx) => forAI(ctx) ? "Connect your email so AI Agent can respond." : "Connect your email so new messages land in your Gorgias inbox.",
    connectLabel: "Connect " + provider.name,
    url: provider.url,
    secondaryLabel: "Use a different email provider",
    onSecondary: [{ type: "retract", tag: "inbox" }, { type: "goto", to: "inbox-choice" }],
  }];

  const FORWARDING = [
    { type: "ai", text: "What support email would you like to connect?" },
    { type: "input", id: "supportEmail", placeholder: "e.g. {{brand.forwarding.supportEmail}}", devAnswer: (ctx) => ctx.brand.forwarding.supportEmail },
    { type: "ai", text: "Great! And what should the display name for this email be? This will be the name customers see when they receive an email from you." },
    { type: "input", id: "displayName", placeholder: "e.g. {{brand.forwarding.displayName}}", devAnswer: (ctx) => ctx.brand.forwarding.displayName },
    { type: "ai", lines: [
      "Now, let’s get your email forwarding set up, so your team and AI Agent can manage incoming emails in one Gorgias inbox.",
      "We’ll need to perform a couple of steps on your email provider’s side, but don’t worry, I’ll guide you along the way.",
    ] },
    { type: "card", component: "ForwardingInstructions" },
    {
      type: "choice", label: "fwd-steps", title: "Have you completed these steps?",
      options: [{ key: "done", title: "Yes, I’m done" }],
      freeform: { then: [
        { type: "ai", text: "No problem. The video and Help Center guide walk through the steps for each email provider. Once you’ve added the forwarding address, let me know and I’ll check it." },
        { type: "goto", to: "fwd-steps" },
      ] },
    },
    { type: "verify", ms: 1100 },
    { type: "confirm", label: "Email forwarding verified" },
    { type: "ai", lines: [
      "I’ve verified your email forwarding has successfully been set up. The next step is domain verification.",
      "Verifying your domain is required to send email from Gorgias with your custom email address. A verified domain also reduces bounce rates, prevents emails from landing in recipients' Spam folders, and ensures your email address is recognized as safe by your customers' email providers.",
    ] },
    {
      type: "choice", id: "dnsProvider", title: "Where do you manage your domain?",
      subtitle: "This is where the DNS records for {{brand.forwarding.domain}} live.",
      options: () => K.DNS_PROVIDER_OPTIONS,
    },
    { type: "ai", text: "This short video will show you where to make the changes in {{answers.dnsProviderText}}." },
    { type: "card", component: "VideoPlaceholder", props: (ctx) => ({ label: ctx.answers.dnsProviderText + " domain verification video placeholder" }) },
    { type: "ai", text: (ctx) => "When you’re ready, copy each row below into " + ctx.answers.dnsProviderText + " for " + ctx.brand.forwarding.domain + ". After you save these changes, verification may take up to 72 hours while they update." },
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
    { type: "ai", tag: "inbox", delay: 300, speed: LEGACY, text: "I can't connect that provider directly, but I can set it up with email forwarding — or you can connect Gmail or Outlook instead." },
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
        type: "ai", delay: 600, speed: LEGACY,
        text: (ctx) => forAI(ctx)
          ? "Now let's choose where it should reply to customers. AI Agent needs a compatible channel — email, chat, or SMS — and none is connected yet. Connecting a support email inbox is the quickest way to get started."
          : "Let's start with email. Connecting your support inbox brings every customer email into Gorgias.",
      },
      {
        type: "choice", id: "inbox", label: "inbox-choice", tag: "inbox", delay: 500,
        title: "Which inbox do you use?",
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
          return forAI(ctx)
            ? "Your inbox (" + address + ") is connected. I'll prepare AI Agent to handle incoming tickets on that address — it won't respond until you turn it on in the final step."
            : "Your inbox (" + address + ") is connected. New emails to that address now arrive as tickets in Gorgias.";
        },
      },
    ],
  });
})();
