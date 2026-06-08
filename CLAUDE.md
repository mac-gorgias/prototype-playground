# Prototype Playground

A static HTML prototype gallery for the Gorgias Design team, hosted on GitHub Pages. No build step, no backend — just files, a JSON manifest, and git.

**Live dashboard:** https://mac-gorgias.github.io/prototype-playground
**Local repo:** `/Users/mac/Dev/prototype-playground`
**GitHub repo:** https://github.com/mac-gorgias/prototype-playground

---

## File structure

```
prototype-playground/
├── index.html          ← Dashboard (fetches prototypes.json, renders gallery)
├── viewer.html         ← iframe wrapper with "Back to projects" button
├── prototypes.json     ← Single source of truth for all prototype metadata
├── publish.md          ← /publish slash command definition
├── skill_templates.js  ← Shared browser script for skill template UI patterns
├── prototypes/         ← One subfolder per prototype
│   └── <slug>/index.html
└── images/             ← Preview thumbnails, named <slug>.png (or .jpg/.webp)
```

## How publishing works

Use the `/publish` slash command. Claude will:
1. Generate a slug from the prototype name (lowercase, hyphens, no special chars)
2. `mkdir -p prototypes/<slug>` and copy the HTML file in as `index.html`
3. Copy the screenshot to `images/<slug>.png` (if provided)
4. Append an entry to `prototypes.json`
5. `git pull --rebase && git add -A && git commit -m "add: <name>" && git push`
6. Return both the prototype viewer link and the dashboard link

If no screenshot is provided, ask the user — or auto-find the latest from `~/Desktop/Screenshot*.png`.

## prototypes.json schema

```json
{
  "name": "Human-readable name",
  "author": "Mac",
  "date": "YYYY-MM-DD",
  "description": "One or two sentences shown on the dashboard card.",
  "file": "<slug>/index.html",
  "image": "<slug>.png"
}
```

- `file` is used for local prototypes (served via `viewer.html?file=<slug>/index.html`)
- `url` replaces `file` for externally hosted prototypes (e.g. Lovable apps) — opens in a new tab
- `image` is optional; omit if no screenshot

## Updating an existing prototype

Match by slug. Replace `prototypes/<slug>/index.html` (and optionally `images/<slug>.*`), update the `prototypes.json` entry in place, then commit and push.

## Dashboard design tokens

The `index.html` dashboard uses these CSS variables — keep any dashboard edits consistent:

```css
--accent: #683FCF           /* Gorgias purple */
--bg: #F8F7F6
--surface: #FFFFFF
--font: 'DM Sans'
--mono: 'DM Mono'
--text-primary: #1A1A1A
--text-secondary: #6B6B6B
--text-tertiary: #9A9A9A
```

## Git workflow

```bash
cd /Users/mac/Dev/prototype-playground
git pull --rebase
git add -A
git commit -m "add: Prototype Name"   # or "update: ..." / "fix: ..."
git push
```

GitHub Pages deploys automatically from the `main` branch root. Takes ~1–2 minutes to go live.

## Current prototypes

| Name | Slug | Notes |
|------|------|-------|
| Test | `onboarding-test` | Conversational onboarding flow |
| Conversational Onboarding Lovable | — | External URL (lovable.app) |
| Voice Onboarding | `voice-onboarding` | TTS-guided onboarding |
| Conversational Intake | `conversational-intake` | Cinematic multi-step intake |
| Intake — AI Agent Trial | `intake-ai-agent-trial` | Scoped to AI Agent trial users, uses UrbanStems brand |

## Password-protecting a prototype

`password_template.html` is a custom-styled [StatiCrypt](https://robinmoisson.github.io/staticrypt/) template. It matches the dashboard design (DM Sans, `--accent` purple, same card/input styling).

To password-protect a prototype:
1. Install StatiCrypt: `npm install -g staticrypt`
2. Run it against the prototype, pointing at this template:
   ```bash
   staticrypt prototypes/<slug>/index.html --password <password> \
     --template password_template.html \
     --template-title "Prototype Name" \
     --template-instructions "Enter the password to view this prototype." \
     -o prototypes/<slug>/index.html
   ```
3. Commit and push — the output file is self-contained (no external dependencies).

## Viewer

`viewer.html` accepts a `?file=<slug>/index.html` query param and iframes the prototype. The iframe uses `sandbox="allow-scripts allow-same-origin allow-popups allow-forms"`.

## Troubleshooting

- **Merge conflict on prototypes.json** → `git pull`, resolve manually, push again
- **Card shows broken image** → confirm `images/<slug>.png` exists and the `image` field in prototypes.json matches exactly (no folder prefix)
- **Prototype 404s in viewer** → confirm `file` field is `<slug>/index.html` and the file exists at `prototypes/<slug>/index.html`
- **Changes not live** → check the Actions tab on GitHub; Pages takes 1–2 min to deploy

---

# Intake Prototypes — Workspace Guide

## What this is

Two high-fidelity HTML prototypes for Gorgias's new AI Agent onboarding ("intake") experience. Both are single-file React apps (React 18 via CDN + Babel transpiler) with all components, state, and styling inline.

- **AI Agent Trial** (`prototypes/intake-ai-agent-trial/index.html`) — for existing Gorgias customers enabling AI Agent
- **Gorgias Trial** (`prototypes/intake-gorgias-trial/index.html`) — for brand new Gorgias trial signups who set up both the helpdesk and AI Agent

Both files are ~6000+ lines. They share ~90% of their component code (copy-pasted, not extracted). When making changes, **always apply to both files** unless the change is specific to one flow.

## How to preview

Open the HTML files directly in a browser. No build step, no server needed. Each prototype has a **dev jump menu** (top-left corner, visible after the cinematic intro) that lets you skip to specific steps without clicking through the whole flow.

## Architecture

Each prototype is a single `index.html` with:
- **Inline CSS** in a `<style>` block (keyframe animations)
- **Constants** at the top: colors (`ACCENT`, `TEXT`, `TEXT_MUTED`, `BORDER`), button styles (`BTN_PRIMARY`, `BTN_SECONDARY`), skill definitions (`SKILLS`, `SKILL_FOLLOWUPS`)
- **Shared components**: `QuestionCard`, `SkillFollowUpCard`, `SkillPickerCard`, `ChannelsCard`, `ChatInputBar`, `VoiceCardPanel`, `KnowledgeCardPanel`, `PreviewPanel`, `EditPanel`, `ClosingScreen`, `SidebarNav`, `ConfettiBurst`, `AuroraBlob`
- **Main app component** (`IntakePage`) with 30+ `useState` hooks managing the flow phases

### Flow structure

**AI Agent Trial:** Landing cinematic → Welcome messages → Research phase → Tone of voice card → Skill batch 1 (ready to enable) → Skill batch 2 (needs follow-up details) → Channel setup (2 emails + 1 chat) → Closing screen

**Gorgias Trial:** Signup screen → Landing cinematic → Welcome messages → Research phase → Tone of voice card → Platform connection (Shopify/WooCommerce/etc.) → Skill batch 1 → Skill batch 2 → Channel email connection → Closing screen

### Key state variables

- `cinematicPhase` — controls the landing intro animation
- `skillsPhase` — "idle" | "typing-batch1" | "shown-batch1" | "typing-batch2" | "shown-batch2" | "done"
- `channelsPhase` — "idle" | "typing-intro" | "shown" | "done"
- `closingPhase` — "idle" | "shown"
- `activePanel` — null | "voice" | "knowledge" | "preview" | "edit" (right-side panels)
- `checklist` — tracks completion of each step (tone, knowledge, platform, skills, channels)

### Side panels

All four side panels (Voice, Knowledge, Preview, Edit) are **480px wide**, positioned `fixed` at top/right/bottom 16px, with **20px header font size**. This was unified per Bora's feedback — don't change these values independently.

## Design system alignment

We follow the **Axiom design system** for component styling:
- Card borders: `1px solid rgba(0,0,0,0.08)` with `box-shadow: 0px 2px 20px 0px rgba(0,0,0,0.04)`
- Card border-radius: `8px`
- Card padding: `12px 16px`
- Check icon: Axiom check-circle SVG with `stroke="#147656"`
- Question/help icon: Axiom help-circle SVG with `stroke="#8992A0"`
- Typography: 14px body, 13px subtitles/descriptions, 12px small labels, 20px panel headings
- Subtitle color: `#5C6370`
- Tag badges (AI detected, Recommended): `color: ACCENT`, `background: ACCENT_LIGHT`, `marginLeft: "auto"` for right-alignment

## Key differences between prototypes

| Feature | AI Agent Trial | Gorgias Trial |
|---------|---------------|---------------|
| Signup step | None | Email + website fields |
| Platform connection | None | Shopify (AI detected), WooCommerce, BigCommerce, Magento, Prestashop |
| Left sidebar nav | Yes (SidebarNav component) | Removed — full width layout |
| Floating checklist | No | Yes — bottom-left corner, collapsible |
| Channel setup | ChannelsCard with toggles (2 emails + 1 chat) | QuestionCard for email connection method (Gmail, Microsoft 365, forwarding) |
| Closing screen (full setup) | "Great work!" + confetti + "what happens next" bullets | "Great work!" + confetti + dynamic checklist of completed steps |
| Closing screen (skipped channels) | "Your AI Agent is ready to go" — no confetti, recap of what's done | "Your Gorgias account is ready" — no confetti, pending items shown |
| Closing CTAs | "Take me to inbox" + "Review my AI Agent skills" | "Connect your apps" + "Take me to my inbox" |

## Monitoring / pending items

These items are in progress or blocked — don't implement without checking current status:
- **Knowledge sidepanel redesign** — treatment updated to Axiom cards, but deeper content changes pending discovery
- **Opt-in/billing step (US6)** — waiting on Julien for how to work into conversational flow
- **Integrations naming** — waiting on Felipe/Ines Slack thread
- **Email OAuth connection experience** — Boris investigating
- **Skip setup removal** — on hold, currently shows "Finish later"

## Common patterns

When adding a new card/question to the flow:
1. Add narration messages to the appropriate `_MESSAGES` array
2. Add a new phase state or extend an existing one
3. Use `QuestionCard` for single-select choices, `SkillPickerCard` for multi-select
4. Set `onClose={null}` to hide the X button (current standard for most cards)
5. Include a "Something else..." freeform option unless explicitly hiding it with `hideFreeform`

When editing skill follow-ups (`SKILL_FOLLOWUPS` object):
- Options can be strings or `{ label, sublabel, icon, badge }` objects
- Use `badge: "Recommended"` for recommended options
- Use `aiDetectedOption: "value"` to mark an auto-detected answer
- The `placeholderStyle` for unset values is orange (`#FFF3E6` bg, `#E67E22` text)
