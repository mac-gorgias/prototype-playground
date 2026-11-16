/* Module: Configure AI Agent Support (v1) — re-cut from the onboarding's tone / skills / recap chapters.
 * The tone-of-voice review now lives here (Generate tone of voice is silent).
 * Hard preconditions: Shopify store (available), connected email (requires).
 * Win: Skills approved, AI Agent enabled on a channel. Payoff: First automated interaction.
 * Sets answers: tov, tovRevision, skillsGate, enableAi, finalSkills. */
(function () {
  const LEGACY = 10;
  const readySkills = (ctx) => (ctx.brand.skills || []).filter((s) => s.ready);

  GaiaKit.defineModule({
    id: "configure-ai-agent-support", version: 1,
    name: "Configure AI Agent Support",
    checklist: "Set up AI Agent",
    type: "configure",
    win: "Skills approved, AI Agent enabled on a channel",
    payoff: "First automated interaction",
    requires: ["connect-ecommerce-platform", "generate-tone-of-voice", "connect-email"],
    available: (ctx) => ctx.answers.platform === "shopify" && ctx.isDone("connect-ecommerce-platform"),
    offerable: (ctx) => !ctx.answers.platform || ctx.answers.platform === "shopify", // worth offering unless we know it's not Shopify
    lockedSteps: [
      { type: "ai", delay: 400, text: "AI Agent needs a Shopify store to look up orders, so I'll hold off on it for now. You can connect Shopify anytime from your apps page." },
    ],
    offer: {
      line: "Now that your channels flow into one inbox, AI Agent can answer the common questions on them for you — order status, promo codes, and more.",
      title: "Want to set up AI Agent next?",
      yes: "Set up AI Agent",
      no: "Not now",
      intro: "Great. AI Agent needs your store connected, then I'll draft your first skills.",
    },
    steps: [
      // Tone of voice (generated in the background since the store was connected)
      { type: "await", module: "generate-tone-of-voice", timeout: 15000 },
      { type: "ai", delay: 800, speed: LEGACY, text: "Here's what I learned about {{brand.name}} from your site, social, and store." },
      {
        type: "card", id: "tov", component: "TovHitlCard", delay: 300,
        await: true, holdComposer: true,
        events: { onApprove: "approve", onReject: "reject" },
        resolvedProp: "approved",
        style: { marginTop: 4, marginBottom: 16 },
        devAnswer: "approve",
        on: {
          approve: [{ type: "user", text: "Yes, looks good. I'll adjust it later if needed." }],
          reject: [
            { type: "user", text: "No, I need to make some changes." },
            { label: "tov-revise" },
            { type: "ai", delay: 400, speed: LEGACY, text: "Okay got it, let me know how I can adjust it." },
            { type: "input", id: "tovRevision", placeholder: "Describe what you'd like to change...", devAnswer: "Make it a little more playful." },
            { type: "ai", delay: 400, speed: LEGACY, text: "Got it, I've updated your tone of voice." },
            {
              type: "choice", variant: "yesno", delay: 800, title: "Does this look better?",
              options: [
                { key: "yes", title: "Yes, looks good.", icon: "check" },
                { key: "no", title: "No, I need more changes.", icon: "cross", then: [{ type: "goto", to: "tov-revise" }] },
              ],
            },
          ],
        },
      },

      // Skills
      { type: "ai", delay: 900, speed: LEGACY, text: "With your tone of voice set and your store connected, AI Agent knows how to sound like {{brand.name}} and has the context it needs to handle real tickets." },
      { type: "ai", delay: 500, speed: LEGACY, text: "AI Agent detects a customer's intent, then handles the ticket using the matching skill. One skill can cover several related intents." },
      { type: "card", component: "IntentConceptCard" },
      {
        type: "choice", id: "skillsGate", delay: 600, freeform: false, title: "Ready to create your first skills?",
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
      // Email is connected before this module (planner: requires connect-email), so the old
      // "Ready to connect your support channel?" became a skills sign-off. Revert both if Julien keeps skills before email.
      { type: "choice", id: "skillsReviewed", title: "Happy with these skills?", options: [{ key: "ready", title: "Yes, show me the recap" }] },
      { type: "confirm", label: (ctx) => { const n = readySkills(ctx).length; return "Reviewed " + n + " skill" + (n !== 1 ? "s" : ""); } },

      // Recap + enable
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
      {
        type: "choice", id: "enableAi", freeform: false, title: "Do you want to turn on your AI Agent?",
        options: [
          { key: "everything", title: "Turn it on for all incoming customer requests", desc: "Answer any request using your skills and knowledge. Hand over when unsure.", then: [
            { type: "win" },
            { type: "end", screen: "closing", delay: 1400, props: (ctx) => ({ isNonShopify: false, enabledSkillCount: readySkills(ctx).length }) },
          ] },
          { key: "skills", title: "Choose which requests AI Agent should handle", desc: "Select from your reviewed skills. Other requests go directly to your team.", then: [
            { type: "ai", text: "Let me know which skills you want AI Agent to use. You can change this or add more anytime." },
            { type: "multi", id: "finalSkills", options: (ctx) => readySkills(ctx).map((s) => ({ key: s.key, label: s.title })) },
            { type: "confirm", label: (ctx) => { const n = (ctx.answers.finalSkills || []).length; return n + " skill" + (n !== 1 ? "s" : "") + " enabled"; } },
            { type: "ai", text: "AI Agent will only respond to the requests that have a corresponding skill set up and enabled." },
            { type: "win" },
            { type: "end", screen: "closing", delay: 2000, props: (ctx) => ({ isNonShopify: false, enabledSkillCount: (ctx.answers.finalSkills || []).length }) },
          ] },
          { key: "not-yet", title: "Not ready to turn it on yet", desc: "Your skills stay drafted and nothing goes live. You can turn on AI Agent anytime from settings.", then: [
            { type: "ai", text: "No problem. Your skills stay drafted, and you can turn on AI Agent anytime from settings." },
            { type: "exit-module", reason: "not ready to turn it on" },
          ] },
        ],
      },
    ],
  });
})();
