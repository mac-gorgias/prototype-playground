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
