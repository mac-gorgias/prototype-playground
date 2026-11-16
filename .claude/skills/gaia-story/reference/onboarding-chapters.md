# Onboarding chapters (`gaia-kit/v1/stories/onboarding.js`)

Source: *Intent-based Enablement + Email Forwarding* (2026-11-10). Use these names with
`compose({ after | before | replace })`, `startAt`, and `?chapter=`.

| Chapter | Title in dev menu | What happens | Sets answers | Checklist |
|---|---|---|---|---|
| `signup` | Signup | Signup screen (email + website) | — | — |
| `intro` | Intro | Welcome hero, "Start setup" | — | — |
| `welcome` | Welcome | 3 Gaia intro lines | — | — |
| `platform` | Platform | "Which ecommerce platform are you on?" → Shopify connect card (or "Use a different platform"). Non-Shopify → one line, then jumps to the inbox question (skips research → skills) | `platform`, `platformText` | `platform` |
| `research` | Research | Rotating sources → "Reviewed 4 sources for UrbanStems" | — | — |
| `tone` | Tone of voice | Findings line + ToV card. Approve, or reject → revise loop (input → "Does this look better?") | `tov`, `tovRevision` | `tone` |
| `skills` | Skill setup | 2 lines + intent explainer → "Ready to create your first skills?" (learn-more branch) → skill list (Preview/Edit panels) → "Ready to connect your support channel?" | `skillsGate`, `skillsNext` | `skills` |
| `channels` | Channel / Inbox | Intro line → "Which inbox do you use?" Gmail/Outlook connect cards, forwarding, or typed provider → "set up forwarding or connect Gmail/Outlook". Then "… inbox connected" + inbox line. Non-Shopify ends on Home here | `inbox`, `inboxText` | `channels` |
| `forwarding` *(inside channels → Email forwarding)* | Email forwarding | Support email + display name inputs → instructions card → "Have you completed these steps?" (typed help loops) → verify | `supportEmail`, `displayName` | `channels` |
| `domain` *(inside forwarding)* | Domain verification | DNS provider question → video + records table → "I'm done" / "later" (typed help loops) | `dnsProvider`, `dnsProviderText`, `dnsDone` | — |
| `recap` | Final recap | Recap line + SetupRecapCard → "Do you want to turn on your AI Agent?" | `enableAi`, `finalSkills` | — |
| `closing` *(inside recap → turn it on)* | End | Closing screen | — | — |

Labels you can `goto`: `platform-choice`, `inbox-choice`, `channel-connected`, `fwd-steps`,
`dns-done`, `enable-resume`, `enable-choice`, `tov-revise` (inside the reject branch only).

Tags you can `retract`: `platform` (platform answer bubble), `inbox` (inbox answer + other-provider
line), `enable` (enable-AI answer).

## Placement tips

- **New skill or knowledge step** → `after: "skills"` (checklist "skills" is already ticked; channels follow).
- **New channel type (chat, SMS)** → `replace: "channels"` and keep the `inbox-choice` label on your
  first question so other paths (non-Shopify, "Use a different provider") still land there.
- **Something before going live (billing, opt-in)** → `before: "recap"`.
- **Inside forwarding** → a chapter ends at the next marker, so `after: "forwarding"` inserts between
  forwarding verification and domain verification. Use `after: "domain"` to land after DNS.
- Chapters inside a branch only play when that branch is taken. Jumps pick the branch automatically.
