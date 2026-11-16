# Step types

A story is `{ title, steps, checklist?, showChecklist?, home?, freeChatReply? }`. Each step is a
plain object. Any value marked *(ctx)* can be a function `(ctx) => value` or a string with
`{{brand.x}}` / `{{answers.x}}` placeholders.

`ctx` = `{ brand, answers, checklist, chapter, panel, set(key, value), complete(key), goto(label), openPanel(name, props), closePanel(), say(text) }`

## Properties every step accepts

| Prop | Meaning |
|---|---|
| `delay` | ms to wait (Gaia "thinking") before the step runs. *(ctx)* |
| `only` | `(ctx) => bool` — skip the step when false |
| `tag` | label the items this step adds, so a later `retract` can remove them |
| `label` | a `goto` target (a step can be both a label and a real step) |

## Markers

```js
{ chapter: "returns", title: "Returns skill" }   // anchor for compose/startAt/?chapter=/dev menu
{ label: "ask-again" }                            // goto target only
```

## Gaia talks

```js
{ type: "ai", text: "Hi {{brand.name}} team." }            // typed at 8ms/char, then glossary tooltips
{ type: "ai", text: (ctx) => "…", speed: 10, delay: 500 }  // 10ms = original onboarding narration speed
{ type: "ai", lines: ["First line.", "Second line."] }     // typed one after another, no gap
{ type: "ai", text: "…", typed: false }                    // appears instantly
```

## User decides (composer slot)

```js
// Single choice → QuestionCard (numbered options + "Something else…" row) → user bubble
{
  type: "choice", id: "inbox", title: "Which inbox do you use?", subtitle: "Optional helper text",
  options: [
    { key: "gmail", title: "Gmail", badge: "Recommended", desc: "Optional second line",
      reply: "Optional bubble text (defaults to title)", then: [ /* steps for this option only */ ] },
    { key: "forwarding", title: "Email forwarding", then: [ … ] },
  ],
  freeform: { then: [ … ] },     // typed answer → answers.inbox = "other", answers.inboxText = what they typed
  // freeform: false              // hide the "Something else…" row
  bubble: false,                 // don't echo the answer as a user bubble
  variant: "yesno",              // the check/cross confirm card instead (options get icon: "check" | "cross")
  devAnswer: "gmail",            // what dev jumps pick (default: first option, or the option leading to the target)
}
// Sets answers[id] = key and answers[id + "Text"] = the bubble text.

// Multi select → SkillPickerCard (toggle rows + confirm)
{ type: "multi", id: "finalSkills", title: "Which skills…?", confirmLabel: "Enable",
  options: (ctx) => [{ key: "a", label: "A" }], initial: ["a"] }    // answers.finalSkills = ["a", …]

// Typed answer → ChatInputBar takes focus
{ type: "input", id: "supportEmail", placeholder: "e.g. {{brand.forwarding.supportEmail}}", devAnswer: "help@x.com" }
```

## Things appear in the thread

```js
{ type: "confirm", label: "Connected to Shopify" }               // grey check row
{ type: "user", text: "Scripted user bubble" }
{ type: "research", sources: [{ favicon: "site.com", title: "…" }], summary: "Reviewed 2 sources" }
  // rotating sources (1.8s each) then collapsible summary; defaults to brand.researchSources

{ type: "card", component: "SetupRecapCard", props: (ctx) => ({ … }), style: { marginBottom: 16 } }
  // any kit component by name (see components.md); static unless await: true

{ type: "card", id: "tov", component: "TovHitlCard", await: true,
  events: { onApprove: "approve", onReject: "reject" },   // component callback → outcome
  resolvedProp: "approved",                                // prop set to true once resolved
  holdComposer: true,                                      // composer shows "thinking" while waiting
  ephemeral: true,                                         // remove the card once resolved
  on: { approve: [ … ], reject: [ … ] },                   // steps per outcome; answers.tov = outcome
  devAnswer: "approve" }

{ type: "custom", await: true, render: ({ ctx, resolve, resolved, value }) => <div>…</div>, on: { … } }
  // JSX escape hatch — needs Babel + <script type="text/babel"> in the prototype

{ type: "connect", pill: "ecommerce", icon: "shopify" /* | "email" */,
  heading: "Connect your Shopify store", body: "…",
  connectLabel: "Connect Shopify", url: "https://…",       // 1st click opens url, button becomes "I'm done"
  secondaryLabel: "Use a different platform", onSecondary: [ … ],
  connectedLabel: "Connected to Shopify",                  // confirm row after connecting
  complete: "platform", then: [ … ] }                      // checklist key; steps after connecting
```

## Flow

```js
{ type: "wait", ms: 800 }                       // composer shows thinking
{ type: "verify", ms: 1100 }                    // same, reads better for "checking…"
{ type: "branch", on: "platform", cases: { shopify: [ … ] }, default: [ … ] }   // on: answer id or (ctx) => value
{ type: "when", if: (ctx) => ctx.answers.platform !== "shopify", then: [ … ], else: [ … ] }
{ type: "group", steps: [ … ] }                 // reuse a list of steps
{ type: "goto", to: "ask-again" }               // loops / jump to a root-level label
{ type: "retract", tag: "inbox" }               // remove earlier items with that tag (e.g. "pick a different provider")
{ type: "set", values: { platformRetry: true } }
{ type: "do", run: (ctx) => { … } }             // anything else; may call ctx.goto()
{ type: "checklist", complete: "tone" }         // tick a floating-checklist item
{ type: "panel", open: "preview", props: { skillIdx: 0 } }   // or { type: "panel" } to close
{ type: "screen", screen: "signup" | "intro" }  // full-page screens (needs screens module)
{ type: "end" }                                 // stop; composer becomes free chat
{ type: "end", screen: "closing", props: { enabledSkillCount: 4 } }
{ type: "end", screen: "home", resume: "enable-resume" }    // "Continue setup" jumps to that label
```

## Story-level options

```js
{
  title: "Tab title",
  steps: [ … ],
  checklist: [{ key: "tone", label: "Review tone of voice" }],   // floating checklist (bottom-left)
  showChecklist: (ctx) => !!ctx.answers.platform,
  checklistTitle: "Get started",
  home: { hideSetupBanner: (ctx) => …, onNotShopify: [ … ] },    // or home: false
  finishLater: false,        // hide the "Finish later" link
  devMenu: false,            // hide the "Jump to" pill
  freeChatReply: "Got it — I'll factor that in. Want to keep going?",
}
```

## Composition

```js
GaiaKit.compose(GaiaStories.onboarding, [
  { after: "skills", steps: RETURNS },          // insert after the skills chapter
  { before: "recap", steps: [ … ] },
  { replace: "channels", steps: NEW_CHANNELS },  // keeps the chapter marker unless steps start with one
]);
// A chapter runs until the next chapter marker in the same list. Returns a new story; the base is untouched.

GaiaKit.mount({ story, brand: GaiaBrands.urbanstems, startAt: "returns" });
// startAt (or ?chapter=returns in the URL) replays everything before it instantly using devAnswers.
```

## Timing defaults (from the source prototype)

- New lines type at **8ms/char**; the original onboarding narration used **10ms** (`speed: 10`).
- Typical gaps: 300ms before a reply line, 500–600ms between narration beats, 800ms before a new
  question after narration, 900ms after a confirmation before the next chapter.
- Side panels close in 180ms; the intro fades out in 500ms; research shows each source for 1.8s.
