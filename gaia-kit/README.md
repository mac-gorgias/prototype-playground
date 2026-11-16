# Gaia Story Kit

The conversation engine and UI from the Gaia onboarding prototype (*Intent-based Enablement + Email
Forwarding*, 2026-11-10), extracted so new flows are written as **stories** (data) instead of
copying a 7,000-line file.

You get the same thread width (740px), typing speed (8ms/char; 10ms for the original narration),
stick-to-bottom autoscroll, Axiom cards, composer cards, 500px side panels, floating checklist, and
dev "Jump to" menu.

**Authoring a story?** Use the `gaia-story` skill (`.claude/skills/gaia-story/SKILL.md`). It runs
the placement intake, picks the template and modules, and scaffolds `prototypes/<slug>/`.

## Layout

| Path | What | Who edits |
|---|---|---|
| `v1/gaia-kit.core.js` | Engine, shell, composer, core cards, tokens | Built — never by hand |
| `v1/gaia-kit.screens.js` | Signup, intro, closing, home | Built |
| `v1/gaia-kit.panels.js` | Preview / Edit side panels | Built |
| `v1/gaia-kit.onboarding-cards.js` | ToV, skill list, intent explainer, recap, forwarding/DNS cards | Built |
| `v1/brands/urbanstems.js` | Demo brand data (+ `urbanstems/` images) | Built from `src/brands/` |
| `v1/stories/onboarding.js` | Base onboarding, chapter-tagged | Maintainers |
| `v1/assets/` | Shared images | Maintainers |
| `stories/` | Shared stories (linear) + `modular-onboarding.js` (goal question) | Anyone — add new files, never change existing ones |
| `modules/` | Modular onboarding modules, one per file, versioned by filename (`connect-email.v1.js`) | Anyone — add a new version instead of editing a published one |
| `use-cases/` | Use cases: ordered module lists, intro, clarifying questions | Anyone |
| `examples/` | `standalone-demo`, `embedded-returns` | Reference |
| `src/` | Kit source (JSX) | Maintainers, then `./build.sh` |

## Quick start

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.development.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.development.js"></script>
<script src="../../gaia-kit/v1/gaia-kit.core.js"></script>
<script src="../../gaia-kit/v1/brands/urbanstems.js"></script>
<script>
  GaiaKit.mount({
    brand: GaiaBrands.urbanstems,
    story: { title: "Hello", steps: [
      { chapter: "hello", title: "Hello" },
      { type: "ai", text: "Hi {{brand.name}} team." },
      { type: "choice", id: "next", title: "Ready?", options: [{ key: "yes", title: "Yes" }] },
      { type: "end" },
    ] },
  });
</script>
```

Splice into the onboarding:

```js
GaiaKit.compose(GaiaStories.onboarding, [{ after: "skills", steps: MY_STEPS }]);
```

Open any prototype with `?chapter=<name>` to start there (earlier chapters fill in instantly).

## Modular onboarding

Mirrors the Notion model (use case → module → step → Gaia tool). Modules are defined once and shared by use
cases; a small deterministic planner adds requirements, drops what's already done, starts silent modules in
the background, and ends with the best next action (e.g. the path to AI Agent after Consolidate channels).
Modules can switch Gaia into a **sidebar** with a product placeholder in the middle. See
`.claude/skills/gaia-story/reference/modules.md` and `prototypes/gaia-modular-onboarding/`.

The Consolidate channels modules (social, chat, assignment, notification, auto-close, tours) are skeletons
written from the spec's user stories and catalog wins — refine them from each module's Notion page.

**Open question (confirm with Julien):** Automate support now connects email *before* AI Agent setup,
because the AI Agent module's win needs a channel. The original flow set up skills first. See the note
in `use-cases/automate-support.v1.js`.

## Maintainers

- Edit `src/`, then run `./build.sh` (Node 18+, fetches esbuild via npx). Output is committed.
- **Breaking change?** Copy `v1/` to `v2/` and change it there, so published v1 prototypes never
  change under anyone.
- `./export-skill.sh` writes `dist/gaia-story-skill.zip` (skill + kit) for people outside this repo.
- Origin: `src/` was sliced from `prototypes/intent-enablement-email-forwarding/index.html`. Dead code
  in that file (ModalLiveChat, SidebarNav, ChannelsCard, ConfettiBurst, FakeInbox, ThreadAurora,
  SkillsScreen) was left out. `prototypes/gaia-onboarding-kit/` re-runs the full onboarding through
  the kit, for parity checks.

### Differences from the source prototype

- Dev jumps replay the chosen chapter live from its start (the source showed some chapters
  already finished).
- When a non-Shopify store connects its inbox, Home appears after the "inbox connected" line has
  finished typing, not 600ms after the click.
- A typed email provider shows what was typed in the reply bubble (the source showed "other").
- The ToV revision caret now blinks: the `blink` keyframe was missing in the source.
- Typed lines get glossary tooltips once they finish typing, the same as messages that were
  already in the thread.
