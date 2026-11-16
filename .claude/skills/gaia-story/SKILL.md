---
name: gaia-story
description: >
  Build Gaia conversational onboarding prototypes with the shared Gaia Story Kit, using the modular
  onboarding model (use case → module → step): same thread width, typing speed, autoscroll, Axiom cards,
  side panels, sidebar mode and composer as the production-fidelity onboarding prototype. Use when
  someone wants to prototype a new onboarding use case (e.g. Consolidate channels, Organize support,
  Drive more sales), build or change a module (Connect email, Install chat, Inbox tour, Configure AI
  Agent Support…), or any other Gaia chat flow. Also trigger on "new Gaia flow", "onboarding use case",
  "onboarding module", "Gaia conversation prototype", "modular onboarding", "story kit", or "gaia-kit".
---

# Gaia Story

Onboarding prototypes are built the way the product will be (Notion: *Make onboarding modular*):
the merchant picks a **use case** in the goal question, and a planner runs its **modules** in order.
Each module is a list of **steps** (Gaia says something, asks a question, shows a card, waits for a
connection). The Gaia Story Kit plays them with the exact UI and timing of the onboarding prototype.
You write modules and use cases, not UI.

```
gaia-kit/
  v1/                    ← engine + UI. NEVER edit (maintainers rebuild from src/ with build.sh)
  modules/<id>.v<N>.js   ← one module per file, versioned by filename
  use-cases/<id>.v<N>.js ← ordered module lists + intro + clarifying questions
  stories/modular-onboarding.js ← signup → intro → welcome → goal question (GaiaStories.modularOnboarding)
prototypes/gaia-modular-onboarding/  ← milestone 1 reference prototype
```

Read `reference/modules.md` before writing anything. Then `reference/step-types.md`,
`reference/components.md` and `reference/gaia-voice.md` as needed.

## Where am I?

- **Inside the prototype-playground repo** (has `prototypes.json` and `gaia-kit/v1/`): prototypes go in
  `prototypes/<slug>/index.html` and load the kit from `../../gaia-kit/`.
- **Anywhere else** (bundle install): this skill folder contains `kit/` (a copy of `gaia-kit/`). Copy
  `kit/v1`, `kit/modules`, `kit/use-cases` and `kit/stories` into a `gaia-kit/` folder next to the new
  prototype and load from `./gaia-kit/`. Same templates, different prefix.

## Step 1 — Intake (always, before writing anything)

Ask **one question at a time** (use the AskUserQuestion tool when available). Build option lists from
the files in `gaia-kit/modules/` and `gaia-kit/use-cases/` (use their `name` / `title`), and mention the
Notion catalog for modules that don't exist yet.

If the user points at an existing prototype, first read its `<script id="gaia-story-meta">` block and
ask **"Keep the same use cases and start point?"** — if yes, skip to question 3.

**1. What are you making?**
- A new use case
- A new module
- A change to something that already exists (a module or a use case)

**2. Depends on the answer:**
- *New use case* → **Which modules does it use, in order?** Offer the existing modules; any new one
  gets created as a skeleton module (ask for its name, verb-led). Also ask for the goal-question line
  (title as an outcome + one-line pitch) and whether it needs a clarifying question (only when the
  answer changes which modules run, e.g. "Which channels?").
- *New module* → **Which use case(s) use it, and after which module?** Then: what must be done
  before it (requires), and what it makes possible next (unlocks), if anything.
- *Change* → **What are you changing?** One list, grouped: Modules · Use cases.

**3. Walk me through it.** What Gaia says, what the merchant decides, what shows up, how it ends.
Bullets are fine. For a module, ask for its **win** (one result, verified in the session) if it isn't
clear from the walkthrough.

**4. Confirm** — one summary message, not a question per item:
> Building *Install chat* (new module) in Consolidate channels, after Connect social. Win: chat tested
> on production. Runs in the **sidebar** (chat settings with live preview). Starts at your module, earlier
> modules pre-filled, new trial account, UrbanStems. Change anything?

Work these out instead of asking:
- **UI mode:** a step that shows real product UI (inbox, ticket, settings with a live preview) → `ui: "sidebar"`
  with a `surface` placeholder. Choices and external setup → full width (Notion UI mode rule).
- **Start point:** the new or changed piece (`startAt: "<use-case>/<module>"` or `"<use-case>"`).
- **Account state:** "new trial account" unless the walkthrough assumes something is already connected
  (then pick or add a `scenarios` entry).
- **Brand:** UrbanStems. Another brand needs a maintainer (build step).

### Versions, never mutations

- **Changing** a module or use case creates the next version file (`connect-email.v2.js`,
  `consolidate-channels.v2.js` with the same `id`). Copy the current version as the starting point.
  Never edit a file that a published prototype loads.
- A new module **added to an existing use case** = a new version of that use case.
- Each change gets its own prototype slug (e.g. `consolidate-channels-chat-v2`) that loads the new
  versions; older prototypes keep loading the old ones.

## Step 2 — Write the files

- **Module** → `gaia-kit/modules/<id>.v<N>.js` from `templates/module.js`.
- **Use case** → `gaia-kit/use-cases/<id>.v<N>.js` from `templates/use-case.js`.

Rules:
- **Use built-in step types** (`ai`, `choice`, `multi`, `input`, `card`, `connect`, `confirm`, `verify`,
  `await`, `surface`, `exit-module`, `win`, `goto`, `retract`, `end`). They carry the refined spacing,
  typing, composer behaviour and dev-jump support.
- **One win per module.** If a module needs two wins, split it. The win is logged when its steps
  finish; use `{ type: "exit-module" }` when the merchant leaves without the result.
- **Requirements live on the module** (`requires`, `available`), not in the use case.
- **Copy that depends on the use case** uses `ctx.plan.has("<module-id>")` — one module, many use cases.
- **Put branch-specific steps in the option's `then`**, and give questions a `devAnswer` when the first
  option isn't the realistic default, so dev jumps can reach every branch.
- **`custom` steps (JSX) only for genuinely new UI** — they need Babel and can't live in a shared
  module file; put them inline in the prototype. Use kit tokens and the Axiom card style
  (`reference/components.md`).
- **Copy:** `reference/gaia-voice.md`. Use `{{brand.name}}`, never hard-code UrbanStems.
- **Never edit `gaia-kit/v1/` or `gaia-kit/src/`.** If the kit can't do something, use a `custom` step and
  tell the user it might be worth adding to the kit.

## Step 3 — Scaffold the prototype

Copy `templates/modular.html` to `prototypes/<slug>/index.html`:
- Load every module the use cases list **and their requirements** (e.g. Configure AI Agent Support
  needs Connect ecommerce platform, Generate tone of voice and Connect email).
- `useCases` = the goal-question options, in priority order. Keep the live ones so the prototype shows
  the real pick list.
- Fill the `gaia-story-meta` JSON accurately — the next version of this prototype reads it.

For a one-off Gaia flow that isn't part of onboarding, use `templates/standalone.html` (plain story,
no planner).

## Step 4 — Check it

1. Syntax-check new files: `node -e "new Function(require('fs').readFileSync('<file>','utf8'))"`.
2. Tell the user to open `prototypes/<slug>/index.html` directly in the browser (no server needed).
   `?chapter=<use-case>/<module>` jumps straight to a module; the **Jump to ▾** pill lists use cases and
   modules, account-state scenarios, the plan display toggle and the module events panel.
3. Do not drive a browser (Playwright etc.) unless the user asks.

## Step 5 — Publish

Hand off to `/publish` (`publish.md`). Commit the new `gaia-kit/modules/` and `gaia-kit/use-cases/`
files together with the prototype. Use the meta `notes` line for the dashboard description.

## Troubleshooting

- **Blank page / "Load gaia-kit.core.js before …"** → script order: React, ReactDOM, kit modules,
  brand, module files, use-case files, `stories/modular-onboarding.js`, then the mount script.
- **"module not loaded: x"** → add its `<script>`; requirements must be loaded too.
- **Goal question shows an id instead of a title** → the use-case file loads after `modular-onboarding.js`.
- **"card component not loaded"** → that component lives in a kit file you didn't include.
- **Jump lands in the wrong branch** → add `devAnswer`, or move the branch's steps into `option.then`.

## Legacy: the linear onboarding

`gaia-kit/v1/stories/onboarding.js` (chapters + `GaiaKit.compose`) is the original onboarding re-run on
the kit, kept as a parity reference (`prototypes/gaia-onboarding-kit/`, `reference/onboarding-chapters.md`).
Don't build new work on it — use modules.
