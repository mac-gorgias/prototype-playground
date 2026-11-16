# Kit components

Everything is on `window.GaiaKit`. Use components by name in `card` steps
(`{ type: "card", component: "Name", props }`) or destructure them in a `custom` JSX step:
`const { AxButton, THREAD_TEXT_STYLE } = GaiaKit;`

## Tokens (core)

| Name | Value |
|---|---|
| `ACCENT` / `ACCENT_LIGHT` | `#7E55F6` / `#EDE8F8` |
| `TEXT` / `TEXT_MUTED` | `#1a1a1a` / `#8A8A8A` |
| `BORDER` / `SURFACE` / `CARD_BG` / `BG` | `#E5E5E5` / `#F2F2F2` / `#FFFFFF` / `#FAFAFA` |
| `THREAD_TEXT_STYLE` | 14px, line-height 1.55, `#1E242E`, Inter 450 — Gaia's text |
| `MONO_FONT` | Red Hat Mono stack |
| `BTN_PRIMARY`, `BTN_SECONDARY`, `BTN_TERTIARY` (+ `_HOVER`/`_LEAVE`), `BTN_MD`, `BTN_SM`, `BTN_SECONDARY_SM`, `BTN_TERTIARY_SM` | Axiom button styles |
| `LAYOUT` | `threadMaxWidth 740`, `panelWidth 500`, `contentRightMarginOpen 532`, `composerPadding`, … |
| `TIMING` | `typeMs 8`, `legacyTypeMs 10`, `panelClose 180`, `researchSourceMs 1800`, … |
| `brand()` / `asset(name)` | current brand data / URL of a kit asset |

Axiom card style for anything new: border `1px solid rgba(0,0,0,0.08)`, radius `8px`, padding
`12px 16px`, shadow `0px 2px 20px 0px rgba(0,0,0,0.04)`. Check icon stroke `#147656`,
help icon stroke `#8992A0`, subtitle colour `#5C6370`, 13px descriptions, 12px labels.

## core — always loaded

| Component | Props | Notes |
|---|---|---|
| `AxButton` | `variant` ("primary" \| "secondary" \| "tertiary"), `onClick`, `children`, `style` | Axiom button replica |
| `AxTag` | `leadingSlot`, `children`, `style` | Purple pill tag |
| `GaiaTypedLine` | `text`, `onComplete`, `speed`, `instant` | Use `ai` steps instead |
| `UserBubble` | `text` | Use `choice`/`user` steps instead |
| `ConfirmationRow` | `label`, `compact` | Use `confirm` steps |
| `ConnectCard` | `pillLabel`, `pillIcon`, `heading`, `body`, `primaryLabel`, `onPrimary`, `secondaryLabel`, `onSecondary` | Use `connect` steps |
| `CONNECT_PILL_ICON_SHOPIFY`, `CONNECT_PILL_ICON_EMAIL` | — | Pill icons |
| `QuestionCard` | `title`, `subtitle`, `options[{key,title,badge,desc}]`, `onSelect`, `hideFreeform`, … | Composer card — use `choice` |
| `SkillPickerCard` | `options[{key,label}]`, `toggles`, `onToggle`, `onConfirm`, `title`, `confirmLabel` | Use `multi` |
| `YesNoCard` | `title`, `options[{key,title,icon}]`, `onSelect` | Use `choice` with `variant: "yesno"` |
| `ChatInputBar` | `value`, `onChange`, `onSend`, `placeholder`, `sendDisabled`, `thinking` | Composer |
| `ResearchRow` | `sources`, `summary` | Use `research` steps |
| `VideoPlaceholder` | `label` | 400×232 grey video block |
| `SupportLine` | `href`, `linkText` | "Need help? … documentation here" line |
| `CopyChip` | `value` | Inline copy-to-clipboard chip |
| `GlossaryTip` | `tip`, `children` | Dotted-underline tooltip (Gaia text gets these automatically) |

## onboarding-cards — `gaia-kit.onboarding-cards.js`

| Component | Props |
|---|---|
| `TovHitlCard` | `onApprove`, `onReject`, `approved` — tone-of-voice review card (uses `brand.toneOfVoice`) |
| `IntentConceptCard` | — animated "intent → skill → response / handover" explainer |
| `SkillListCard` | `skills`, `visibleCount`, `needsInfo`, `answeredSkillKeys`, `activeSkillIdx`, `expanded`, `onToggleExpanded`, `onPreview(idx)`, `onEdit(idx)`, `draftKeys` |
| `SkillCard` | one row of the above |
| `SetupRecapCard` | `enabledSkills`, `channelConnectMethod`, `forwardingEmail`, `domainVerified` |
| `ForwardingInstructions` | — forwarding address chip + video + help line (uses `brand.forwarding`) |
| `DnsRecordsTable` | `provider` — copyable CNAME/TXT rows (uses `brand.forwarding.dnsRecords`) |
| `DNS_PROVIDER_OPTIONS`, `DNS_PROVIDER_DOCS` | option list / docs links per provider |

## panels — `gaia-kit.panels.js`

Open with `ctx.openPanel("preview" | "edit", { skillIdx })` or a `panel` step. 500px wide, fixed
16px from the edges; the thread shifts left (`margin-right: 532px`). While the Edit panel is open the
composer becomes the skill-edit chat.

| Component | Props |
|---|---|
| `PreviewPanel` | `skillIdx` — test chat for `brand.skills[skillIdx]` (answers from `brand.scriptedIntents`) |
| `EditPanel` | `skillIdx` — intents, sample message, instructions |

## screens — `gaia-kit.screens.js`

| Component | Used by |
|---|---|
| `SignupScreen` | `{ type: "screen", screen: "signup" }` |
| `WelcomeIntro` | `{ type: "screen", screen: "intro" }` |
| `ClosingScreen` | `{ type: "end", screen: "closing", props: { enabledSkillCount, isNonShopify } }` |
| `HomePage` | "Finish later" link and `{ type: "end", screen: "home" }` |

## Brand data (`GaiaBrands.urbanstems`)

`name`, `domain`, `platform`, `inboxEmail`, `toneOfVoice`, `researchSources`, `knowledgeSources`,
`skills[{ key, title, subtitle, icon, ready, preload, edit: { intents }, thinkingSteps, editPlaceholder }]`,
`skillIcons`, `scriptedIntents`, `forwarding { address, supportEmail, displayName, domain, helpUrl, dnsRecords }`.
In steps: `ctx.brand.name`, or `{{brand.forwarding.domain}}` in strings.
