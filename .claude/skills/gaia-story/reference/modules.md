# Modules and use cases (modular onboarding)

Mirrors the Notion doc *Make onboarding modular*: **use case → module → step → Gaia tool**.
The planner builds each merchant's path from the goal they pick.

```
gaia-kit/modules/<id>.v<N>.js     one module per file, versioned by filename (never edit a published version — add v2)
gaia-kit/use-cases/<id>.v<N>.js   ordered module lists + intro + clarifying questions (versioned like modules)
gaia-kit/stories/modular-onboarding.js   signup → intro → welcome → goal question
prototypes/gaia-modular-onboarding/      milestone 1 prototype (Automate support + Consolidate channels)
```

## Module

```js
GaiaKit.defineModule({
  id: "install-chat", version: 1,
  name: "Install chat",                      // verb-led (Notion naming rule)
  checklist: "Install chat on your website", // floating-checklist label (defaults to name)
  type: "configure",                         // or "educate"
  ui: "sidebar",                             // "full" (default) or "sidebar" — Gaia docks right, product placeholder in the middle
  surface: { title: "Chat settings", note: "…" },  // what the placeholder shows in sidebar mode
  win: "Chat tested on production",          // logged when the module's steps finish (or at an explicit { type: "win" })
  payoff: "First real conversation received",// documented only — measured after onboarding
  requires: ["connect-ecommerce-platform"],  // hard requirements: the planner adds them first if not done
  unlocks: ["configure-ai-agent-support"],   // feeds the best next action
  available: (ctx) => …,                     // checked when the module starts; false → lockedSteps, no win
  lockedSteps: [ … ],
  offerable: (ctx) => …,                     // may the next-action rule offer it? (default: available)
  offer: { line, title, yes, no, intro },    // copy when offered as the best next action
  silent: true, duration: 7600,              // silent modules: no steps, run in the background
  skippable: true,                           // shows "Skip for now" above the composer (default true)
  notion: "https://app.notion.com/p/…",
  steps: [ … ],                              // normal story steps (see step-types.md)
});
```

Module-only steps:

| Step | Meaning |
|---|---|
| `{ type: "win" }` | Log the win now (use before an `end` that would stop the story) |
| `{ type: "exit-module", reason }` | Leave the module without a win (e.g. "I'll do it later") |
| `{ type: "await", module: "generate-tone-of-voice", timeout, fallback }` | Wait for a silent module at the point of use; shows the rotating-sources row while it runs |
| `{ type: "ui", mode: "sidebar" \| "full", surface }` | Switch layout mid-module |
| `{ type: "surface", highlight: "Reply box" }` | Highlight part of the product placeholder (tours) |

Inside a module, copy can adapt to the use case: `ctx.plan.has("configure-ai-agent-support")`.
Other context: `ctx.isDone(id)`, `ctx.module`, `ctx.plan.useCase`.

## Use case

```js
GaiaKit.defineUseCase({
  id: "consolidate-channels",
  title: "Consolidate channels",                 // an outcome, never a module name
  pitch: "Bring email, social and chat into one inbox.",   // goal-question option description
  ask: [ /* clarifying questions that fill parameters, e.g. a multi "channels" */ ],
  modules: [
    { module: "connect-email", when: (ctx) => ctx.answers.channels.includes("email") },
    "configure-assignment",
  ],
  intro: (ctx, modules) => "Here's the plan…",   // then a PlanCard (dev menu toggles card / line only)
  complete: [ /* steps after the last module */ ],
  next: [ /* optional: override the best next action */ ],
});
```

## The planner (deterministic)

1. Keep modules whose `when` is true (dev jumps force-include their target).
2. Add each module's `requires` before it; drop modules already done on the account.
3. Silent modules leave the sequence and start in the background as soon as their requirements are done.
4. Run the intro, plan card, each module (start → steps → win), `complete`, then the **best next action**:
   a skipped module resurfaces → the use case's `next` → the first module unlocked by what was done
   (not already attempted, still offerable) → otherwise Home.

## Dev menu

- Jump to any use case or `use-case/module` (e.g. `consolidate-channels/install-chat`); `?chapter=` works too.
- **Account state** scenarios (story `scenarios`): e.g. "Shopify already connected" drops that module from plans. `?scenario=shopify`.
- **Plan display** toggle (card vs line) — the doc's open question "whole plan upfront or next module only".
- **Module events** panel: plan, start, win, skip, exit, locked, silent start, fallback, next action.
