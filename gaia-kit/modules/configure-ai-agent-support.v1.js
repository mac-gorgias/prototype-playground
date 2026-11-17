/* Module: Configure AI Agent Support (v1) — re-cut from the onboarding's tone / skills / recap chapters.
 * The tone-of-voice review now lives here (Generate tone of voice is silent).
 * Hard preconditions: Shopify store (available), connected email (requires).
 * Win: Skills approved, AI Agent enabled on a channel. Payoff: First automated interaction.
 * Sets answers: tov, tovRevision, skillsGate, enableAi, finalSkills. */
(function () {
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
      // The store step already explained why when the merchant picked another platform.
      { type: "ai", delay: 400, text: (ctx) => ctx.answers.platform
        ? "Once you're on Shopify, you can set up AI Agent from your apps page."
        : "AI Agent needs a Shopify store to look up orders, so I'll hold off on it for now. You can connect Shopify anytime from your apps page." },
    ],
    offer: {
      line: "Now that your channels flow into one inbox, AI Agent can answer the common questions on them for you — order status, promo codes, and more.",
      title: "Want to set up AI Agent next?",
      yes: "Set up AI Agent",
      no: "Not now",
      intro: "Great, I'll walk you through it.",
    },
    steps: [
      // Tone of voice: narration, then the sources carousel (replayed even if the silent module already
      // finished during Connect email), then the card.
      { type: "ai", delay: 800, text: "Now let's teach AI Agent to sound like {{brand.name}}. I'll look through your site, socials and store to see how you talk to customers." },
      { type: "await", module: "generate-tone-of-voice", replay: true, timeout: 15000 },
      {
        type: "card", id: "tov", component: "TovHitlCard", delay: 300,
        await: true, holdComposer: true,
        events: { onApprove: "approve", onReject: "reject" },
        resolvedProp: "approved",
        style: { marginTop: 4, marginBottom: 16 },
        devAnswer: "approve",
        on: {
          approve: [{ type: "user", text: "Looks good" }],
          reject: [
            { type: "user", text: "I'd like to change a few things" },
            { label: "tov-revise" },
            { type: "ai", delay: 400, text: "Sure, what would you like to change?" },
            { type: "input", id: "tovRevision", placeholder: "Describe what you'd like to change...", devAnswer: "Make it a little more playful." },
            { type: "ai", delay: 400, text: "Done, I've updated it." },
            {
              type: "choice", variant: "yesno", delay: 800, title: "Anything else?",
              options: [
                { key: "done", title: "No, that's it", icon: "check" },
                { key: "more", title: "Yes, one more thing", icon: "cross", then: [{ type: "goto", to: "tov-revise" }] },
              ],
            },
          ],
        },
      },

      // Skills
      { type: "ai", delay: 900, text: "With your tone of voice set and your store connected, AI Agent knows how to sound like {{brand.name}} and has the context it needs to handle real tickets." },
      { type: "ai", delay: 500, text: "Here's how it decides what to help with: when a customer writes in, it works out what they're asking for (their intent) and answers using a matching skill." },
      { type: "card", component: "IntentConceptCard" },
      {
        // Options are answers, never questions. Freeform stays on ("Something else…").
        type: "choice", id: "skillsGate", delay: 600, title: "Want me to draft skills for your most common questions?",
        options: [
          { key: "yes", title: "Yes, draft them", badge: "Recommended" },
          { key: "more", title: "I want to learn more first", then: [
            { type: "ai", delay: 500, text: "AI Agent only answers when it's confident. If it isn't, it hands the ticket to your team with the whole conversation, so nothing slips through.\n\nMost brands start with a few skills, then add more once they see what's working." },
            { type: "choice", title: "Ready for me to draft them?", options: [{ key: "yes", title: "Yes, draft them", badge: "Recommended" }] },
          ] },
        ],
        freeform: { then: [{ type: "ai", delay: 400, text: "Thanks, I'll keep that in mind while I draft them." }] },
      },
      { type: "ai", delay: (ctx) => (ctx.answers.skillsGate === "yes" ? 500 : 0), text: (ctx) => "Here are " + readySkills(ctx).length + " skills based on what " + ctx.brand.name + " customers ask most. Open one to see how AI Agent would reply, or to make changes." },
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
      // "Ready to connect your support channel?" became a skills sign-off. Revert if Julien wants skills before email.
      {
        type: "choice", id: "skillsReviewed", title: "Do these look right?",
        options: [
          { key: "ready", title: "Yes, looks good. I'll adjust it later if needed." },
          { key: "changes", title: "No, I need to make some changes.", then: [
            { type: "ai", delay: 400, text: "Sure. Open any skill above to edit it, and let me know when you're done." },
            { type: "choice", title: "Done with your changes?", options: [{ key: "done", title: "Yes, I'm done" }] },
          ] },
        ],
      },
      { type: "confirm", label: (ctx) => { const n = readySkills(ctx).length; return "Reviewed " + n + " skill" + (n !== 1 ? "s" : ""); } },

      // Recap + enable
      { type: "ai", delay: 300, text: "That's everything. Here's what AI Agent will work with." },
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
        type: "choice", id: "enableAi", freeform: false, title: "Ready to turn on AI Agent?",
        options: [
          { key: "everything", title: "Turn it on for all incoming customer requests", desc: "Answer any request using your skills and knowledge. Hand over when unsure.", then: [
            { type: "ai", text: "You're live! AI Agent will start answering new emails right away." },
            { type: "win" },
            { type: "end", screen: "closing", delay: 1400, props: (ctx) => ({ isNonShopify: false, enabledSkillCount: readySkills(ctx).length }) },
          ] },
          { key: "skills", title: "Choose which requests AI Agent should handle", desc: "Select from your reviewed skills. Other requests go directly to your team.", then: [
            { type: "ai", text: "Which skills should it use? You can change this anytime." },
            { type: "multi", id: "finalSkills", options: (ctx) => readySkills(ctx).map((s) => ({ key: s.key, label: s.title })) },
            { type: "confirm", label: (ctx) => { const n = (ctx.answers.finalSkills || []).length; return n + " skill" + (n !== 1 ? "s" : "") + " enabled"; } },
            { type: "ai", text: "You're live! AI Agent will handle those, and everything else goes straight to your team." },
            { type: "win" },
            { type: "end", screen: "closing", delay: 2000, props: (ctx) => ({ isNonShopify: false, enabledSkillCount: (ctx.answers.finalSkills || []).length }) },
          ] },
          { key: "not-yet", title: "Not ready to turn it on yet", desc: "Your skills stay drafted and nothing goes live. You can turn on AI Agent anytime from settings.", then: [
            { type: "ai", text: "No problem. Everything's saved, so you can turn it on from settings whenever you're ready." },
            { type: "exit-module", reason: "not ready to turn it on" },
          ] },
        ],
      },
    ],
  });
})();
