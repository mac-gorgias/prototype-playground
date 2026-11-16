/* Gaia onboarding — the base story (Intent Enablement + Email Forwarding, 2026-11-10).
 *
 * Plain JS (no JSX), so it loads from file:// without Babel.
 * Needs: gaia-kit.core.js, gaia-kit.screens.js, gaia-kit.panels.js, gaia-kit.onboarding-cards.js, a brand.
 *
 * Chapters (anchors for GaiaKit.compose and the dev "Jump to" menu):
 *   signup · intro · welcome · platform · research · tone · skills · channels
 *   · forwarding · domain (inside channels → "Email forwarding") · recap · closing (inside recap → "everything")
 *
 * Answers it sets (read them in later steps as ctx.answers.<id>):
 *   platform / platformText   "shopify" | "woocommerce" | … | "other" (+ display text)
 *   tov                       "approve" | "reject"
 *   skillsGate                "yes" | "more"
 *   inbox / inboxText         "gmail" | "microsoft" | "forwarding" | "other"
 *   supportEmail, displayName, dnsProvider / dnsProviderText, dnsDone ("verified" | "later")   (forwarding only)
 *   enableAi                  "everything" | "skills" | "not-yet"
 *   finalSkills               skill keys picked when enableAi = "skills"
 *
 * Timing: the original narration typed at 10ms/char (speed: 10) with explicit start delays; lines
 * that used GaiaTypedLine in the source use the 8ms default. Delays below reproduce the source.
 */
(function () {
  const K = window.GaiaKit;
  if (!K) throw new Error("Load gaia-kit.core.js before stories/onboarding.js");
  const LEGACY = 10;

  const readySkills = (ctx) => (ctx.brand.skills || []).filter((s) => s.ready);
  const isShopify = (ctx) => ctx.answers.platform === "shopify";

  /* ── Platform ── */
  const PLATFORM_OPTIONS = [
    { key: "shopify", title: "Shopify", badge: "Recommended" },
    { key: "woocommerce", title: "WooCommerce" },
    { key: "bigcommerce", title: "BigCommerce" },
    { key: "magento", title: "Magento" },
    { key: "prestashop", title: "Prestashop" },
  ];

  const SHOPIFY_CONNECT = [
    {
      type: "connect",
      pill: "ecommerce", icon: "shopify",
      heading: "Connect your Shopify store",
      body: "Connect Shopify so I can pull in your products, orders, and customer info.",
      connectLabel: "Connect Shopify",
      url: "https://apps.shopify.com/helpdesk?st_source=autocomplete&surface_detail=autocomplete_apps",
      secondaryLabel: "Use a different platform",
      onSecondary: [
        { type: "retract", tag: "platform" },
        { type: "set", values: { platformRetry: true } },
        { type: "goto", to: "platform-choice" },
      ],
      connectedLabel: "Connected to Shopify",
      complete: "platform",
    },
    { type: "ai", delay: 600, speed: LEGACY, text: "Got it. Now let me pull up some info about your brand so I can get the voice right." },
  ];

  // Non-Shopify stores skip research / tone / skills and go straight to the inbox question.
  const OTHER_PLATFORM = [
    { type: "checklist", complete: "platform" },
    { type: "ai", delay: 300, speed: LEGACY, text: "No worries! You can connect your ecommerce platform later from your apps page. For now, let's get your support email set up so you're ready for customers." },
    { type: "wait", ms: 300 },
    { type: "goto", to: "inbox-choice" },
  ];

  /* ── Channels ── */
  const connectEmail = (provider) => [{
    type: "connect",
    pill: "Email", icon: "email",
    heading: "Connect your " + provider.name,
    body: "Connect your email so AI Agent can respond.",
    connectLabel: "Connect " + provider.name,
    url: provider.url,
    secondaryLabel: "Use a different email provider",
    onSecondary: [{ type: "retract", tag: "inbox" }, { type: "goto", to: "inbox-choice" }],
    complete: "channels",
  }];

  const FORWARDING = [
    { chapter: "forwarding", title: "Email forwarding" },
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
      type: "choice", label: "fwd-steps",
      title: "Have you completed these steps?",
      options: [{ key: "done", title: "Yes, I’m done" }],
      freeform: { then: [
        { type: "ai", text: "No problem. The video and Help Center guide walk through the steps for each email provider. Once you’ve added the forwarding address, let me know and I’ll check it." },
        { type: "goto", to: "fwd-steps" },
      ] },
    },
    { type: "verify", ms: 1100 },
    { type: "checklist", complete: "channels" },

    { chapter: "domain", title: "Domain verification" },
    { type: "confirm", label: "Email forwarding verified" },
    { type: "ai", lines: [
      "I’ve verified your email forwarding has successfully been set up. The next step is domain verification.",
      "Verifying your domain is required to send email from Gorgias with your custom email address. A verified domain also reduces bounce rates, prevents emails from landing in recipients' Spam folders, and ensures your email address is recognized as safe by your customers' email providers.",
    ] },
    {
      type: "choice", id: "dnsProvider",
      title: "Where do you manage your domain?",
      subtitle: "This is where the DNS records for {{brand.forwarding.domain}} live.",
      options: () => K.DNS_PROVIDER_OPTIONS,
    },
    { type: "ai", text: "This short video will show you where to make the changes in {{answers.dnsProviderText}}." },
    { type: "card", component: "VideoPlaceholder", props: (ctx) => ({ label: ctx.answers.dnsProviderText + " domain verification video placeholder" }) },
    { type: "ai", text: (ctx) => "When you’re ready, copy each row below into " + ctx.answers.dnsProviderText + " for " + ctx.brand.forwarding.domain + ". After you save these changes, verification may take up to 72 hours while they update." },
    { type: "card", component: "DnsRecordsTable", props: (ctx) => ({ provider: ctx.answers.dnsProviderText }) },
    {
      type: "card", component: "SupportLine",
      props: (ctx) => {
        const p = ctx.answers.dnsProviderText;
        const docs = K.DNS_PROVIDER_DOCS[p];
        return { href: docs || ctx.brand.forwarding.helpUrl, linkText: docs ? p + "’s documentation here" : "Help Center documentation here" };
      },
    },
    {
      type: "choice", id: "dnsDone", label: "dns-done",
      title: "Have you added these records in {{answers.dnsProviderText}}?",
      options: [
        { key: "verified", title: "I’m done", then: [
          { type: "verify", ms: 1100 },
          { type: "confirm", label: "Domain successfully verified" },
          { type: "wait", ms: 700 },
        ] },
        { key: "later", title: "I’ll do it later", then: [
          { type: "ai", text: "No problem. Your records will stay here, and you can finish domain verification later from your email channel settings." },
        ] },
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
      type: "choice", bubble: false, freeform: false,
      title: "What would you like to do?",
      options: [
        { key: "forwarding", title: "Set up email forwarding", badge: "Recommended", then: [
          { type: "retract", tag: "inbox" },
          { type: "user", text: "Email forwarding", tag: "inbox" },
          { type: "set", values: { inbox: "forwarding" } },
          { type: "group", steps: FORWARDING },
        ] },
        { key: "connect", title: "Connect Gmail or Outlook", then: [
          { type: "retract", tag: "inbox" },
          { type: "goto", to: "inbox-choice" },
        ] },
      ],
    },
  ];

  /* ── Recap ── */
  const FINAL_ENABLE_OPTIONS = [
    { key: "everything", title: "Turn it on for all incoming customer requests", desc: "Answer any request using your skills and knowledge. Hand over when unsure." },
    { key: "skills", title: "Choose which requests AI Agent should handle", desc: "Select from your reviewed skills. Other requests go directly to your team." },
    { key: "not-yet", title: "Not ready to turn it on yet", desc: "Your skills stay drafted and nothing goes live. You can turn on AI Agent anytime from settings." },
  ];

  const steps = [
    { chapter: "signup", title: "Signup" },
    { type: "screen", screen: "signup" },

    { chapter: "intro", title: "Intro" },
    { type: "screen", screen: "intro" },

    { chapter: "welcome", title: "Welcome" },
    { type: "ai", delay: 500, speed: LEGACY, text: "I'm Gaia, your Gorgias AI assistant, and I will work alongside you to learn about {{brand.name}}' shoppers, priorities, and challenges." },
    { type: "ai", delay: 900, speed: LEGACY, text: "By the end of this conversation, you'll be live and ready to support {{brand.name}}'s shoppers." },
    { type: "ai", delay: 900, speed: LEGACY, text: "First things first, I'll need access to your store so everything we set up is built around how your business actually works." },

    { chapter: "platform", title: "Platform" },
    {
      type: "choice", id: "platform", label: "platform-choice", tag: "platform", delay: 800,
      title: "Which ecommerce platform are you on?",
      options: (ctx) => PLATFORM_OPTIONS.map((o) => ({
        ...o,
        badge: ctx.answers.platformRetry ? undefined : o.badge,
        then: o.key === "shopify" ? SHOPIFY_CONNECT : OTHER_PLATFORM,
      })),
      devAnswer: "shopify",
      freeform: { then: OTHER_PLATFORM },
    },

    { chapter: "research", title: "Research" },
    { type: "research", delay: 800 },

    { chapter: "tone", title: "Tone of voice" },
    { type: "ai", delay: 800, speed: LEGACY, text: "Here's what I learned about {{brand.name}} from your site, social, and store." },
    {
      type: "card", id: "tov", component: "TovHitlCard", delay: 300,
      await: true, holdComposer: true,
      events: { onApprove: "approve", onReject: "reject" },
      resolvedProp: "approved",
      style: { marginTop: 4, marginBottom: 16 },
      devAnswer: "approve",
      on: {
        approve: [
          { type: "user", text: "Yes, looks good. I'll adjust it later if needed." },
          { type: "checklist", complete: "tone" },
        ],
        reject: [
          { type: "user", text: "No, I need to make some changes." },
          { label: "tov-revise" },
          { type: "ai", delay: 400, speed: LEGACY, text: "Okay got it, let me know how I can adjust it." },
          { type: "input", id: "tovRevision", placeholder: "Describe what you'd like to change...", devAnswer: "Make it a little more playful." },
          { type: "ai", delay: 400, speed: LEGACY, text: "Got it, I've updated your tone of voice." },
          {
            type: "choice", variant: "yesno", delay: 800,
            title: "Does this look better?",
            options: [
              { key: "yes", title: "Yes, looks good.", icon: "check", then: [{ type: "checklist", complete: "tone" }] },
              { key: "no", title: "No, I need more changes.", icon: "cross", then: [{ type: "goto", to: "tov-revise" }] },
            ],
          },
        ],
      },
    },

    { chapter: "skills", title: "Skill setup" },
    { type: "ai", delay: 900, speed: LEGACY, text: "With your tone of voice set and your store connected, AI Agent knows how to sound like {{brand.name}} and has the context it needs to handle real tickets." },
    { type: "ai", delay: 500, speed: LEGACY, text: "AI Agent detects a customer's intent, then handles the ticket using the matching skill. One skill can cover several related intents." },
    { type: "card", component: "IntentConceptCard" },
    {
      type: "choice", id: "skillsGate", delay: 600, freeform: false,
      title: "Ready to create your first skills?",
      options: [
        { key: "yes", title: "Yes, create the drafts for me", badge: "Recommended" },
        { key: "more", title: "I want to learn more first", then: [
          { type: "ai", delay: 500, text: "AI Agent only answers when your skills and knowledge give it enough confidence. When it's unsure, it hands the ticket to your team with the full context.\n\nYou can start with only the intents your drafted skills cover, then use automation rate, resolution time, and handoff metrics to decide when to expand." },
          { type: "choice", title: "Ready to create the drafts?", options: [{ key: "yes", title: "Yes, create the drafts for me", badge: "Recommended" }] },
        ] },
      ],
    },
    { type: "ai", delay: (ctx) => (ctx.answers.skillsGate === "yes" ? 500 : 0), text: "Here are the four skills with their attached intents." },
    {
      type: "card", component: "SkillListCard", style: { marginBottom: 4 },
      props: (ctx) => {
        const skills = readySkills(ctx);
        const panel = ctx.panel && !ctx.panel.closing ? ctx.panel : null;
        return {
          skills, startIndex: 0, visibleCount: 4, needsInfo: true,
          answeredSkillKeys: new Set(skills.map((s) => s.key)),
          activeSkillIdx: panel ? panel.props.skillIdx : null,
          expanded: !!ctx.answers.skillsExpanded,
          onToggleExpanded: () => ctx.set("skillsExpanded", !ctx.answers.skillsExpanded),
          onPreview: (idx) => ctx.openPanel("preview", { skillIdx: idx }),
          onEdit: (idx) => ctx.openPanel("edit", { skillIdx: idx }),
          draftKeys: null,
        };
      },
    },
    { type: "choice", id: "skillsNext", title: "Ready to connect your support channel?", options: [{ key: "ready", title: "Yes, I'm ready" }] },
    { type: "confirm", label: (ctx) => { const n = readySkills(ctx).length; return "Reviewed " + n + " skill" + (n !== 1 ? "s" : ""); } },
    { type: "checklist", complete: "skills" },

    { chapter: "channels", title: "Channel / Inbox" },
    { type: "ai", delay: 600, speed: LEGACY, text: "Now let's choose where it should reply to customers. AI Agent needs a compatible channel — email, chat, or SMS — and none is connected yet. Connecting a support email inbox is the quickest way to get started." },
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
    { label: "channel-connected" },
    { type: "confirm", label: (ctx) => (ctx.answers.inbox === "forwarding" ? "Email channel connected" : (ctx.answers.inbox === "microsoft" ? "Outlook" : "Gmail") + " inbox connected") },
    {
      type: "ai",
      text: (ctx) => {
        const address = ctx.answers.inbox === "forwarding" ? (ctx.answers.supportEmail || ctx.brand.forwarding.supportEmail) : ctx.brand.inboxEmail;
        return "Your inbox (" + address + ") is connected. I'll prepare AI Agent to handle incoming tickets on that address — it won't respond until you turn it on in the final step.";
      },
    },
    { type: "when", if: (ctx) => !isShopify(ctx), then: [{ type: "end", screen: "home", delay: 600 }] },

    { chapter: "recap", title: "Final recap" },
    { type: "ai", delay: 300, speed: LEGACY, text: "Here's a recap of what you've set up. Everything is still drafted and nothing is live yet." },
    {
      type: "card", component: "SetupRecapCard", delay: 400,
      props: (ctx) => ({
        enabledSkills: readySkills(ctx),
        channelConnectMethod: ctx.answers.inbox,
        forwardingEmail: ctx.answers.supportEmail,
        domainVerified: ctx.answers.dnsDone === "verified",
      }),
    },
    { label: "enable-resume" },
    { type: "retract", tag: "enable" },
    {
      type: "choice", id: "enableAi", label: "enable-choice", tag: "enable", freeform: false,
      title: "Do you want to turn on your AI Agent?",
      options: [
        { ...FINAL_ENABLE_OPTIONS[0], then: [
          { chapter: "closing", title: "End" },
          { type: "end", screen: "closing", delay: 1400, props: (ctx) => ({ isNonShopify: false, enabledSkillCount: readySkills(ctx).length }) },
        ] },
        { ...FINAL_ENABLE_OPTIONS[1], then: [
          { type: "ai", tag: "enable", text: "Let me know which skills you want AI Agent to use. You can change this or add more anytime." },
          { type: "multi", id: "finalSkills", options: (ctx) => readySkills(ctx).map((s) => ({ key: s.key, label: s.title })) },
          { type: "confirm", label: (ctx) => { const n = (ctx.answers.finalSkills || []).length; return n + " skill" + (n !== 1 ? "s" : "") + " enabled"; } },
          { type: "ai", text: "AI Agent will only respond to the requests that have a corresponding skill set up and enabled." },
          { type: "end", screen: "closing", delay: 2000, props: (ctx) => ({ isNonShopify: false, enabledSkillCount: (ctx.answers.finalSkills || []).length }) },
        ] },
        { ...FINAL_ENABLE_OPTIONS[2], then: [
          { type: "end", screen: "home", delay: 600, resume: "enable-resume" },
        ] },
      ],
    },
  ];

  window.GaiaStories = window.GaiaStories || {};
  window.GaiaStories.onboarding = {
    id: "onboarding",
    title: "Gaia onboarding",
    kitVersion: "1",
    steps,
    checklist: [
      { key: "platform", label: "Connect ecommerce platform" },
      { key: "tone", label: "Review tone of voice" },
      { key: "skills", label: "Configure skills" },
      { key: "channels", label: "Connect support channel" },
    ],
    showChecklist: (ctx) => !!ctx.answers.platform,
    home: {
      hideSetupBanner: (ctx) => !!ctx.answers.platform && !isShopify(ctx) && !!ctx.checklist.channels,
      onNotShopify: [
        { type: "retract", tag: "platform" },
        { type: "set", values: { platform: undefined, platformText: undefined } },
        { type: "goto", to: "platform-choice" },
      ],
    },
  };
})();
