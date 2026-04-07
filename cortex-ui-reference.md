# Cortex/Gaia UI — Reference Patterns

Source: `gorgias/data-analytics-context-layer` → `cortex_ui/`
Local clone: `~/Dev/_reference/data-analytics-context-layer/cortex_ui/`

This is a distillation of the patterns powering the Gaia copilot UI today, captured so the copilot-onboarding prototype can match its look, feel, and interaction model.

## Stack at a glance

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite 6, React Router 7 |
| Chat engine | `@assistant-ui/react` + `@assistant-ui/react-langgraph` |
| Styling | Tailwind v4, ShadCN/ui (copy-paste, not dep), Radix primitives |
| Tokens | CSS variables in HSL, dark mode via `.dark` class, Axiom semantic tokens |
| Icons | `lucide-react` |
| Animation | `framer-motion`, `tw-animate-css`, `tw-shimmer` |
| Editor | BlockNote (`@blocknote/*`) for rich text |
| State | Zustand, React context per-domain |

## Visual language (from `src/index.css`)

- **Primary purple**: `hsl(262 60% 55%)` (light) / `#9b7bff` (dark) — used for CTAs, focus rings, send button
- **Accent (light tint)**: `hsl(255 100% 96%)` light / `#4c3c9d` dark
- **Surface hierarchy**: `surface` → `surface-raised` → `surface-overlay` (helpdesk-matched in dark)
- **Radius**: base `0.625rem` (10px cards). Composer & messages use `rounded-2xl`/`rounded-3xl`
- **Typography**: Inter as primary; "BB Modern Semi Condensed" as logo font
- **Axiom semantic tokens** sit alongside ShadCN tokens — use these in nav: `--axiom-content-default`, `--axiom-content-secondary`, `--axiom-surface-accent`, `--axiom-content-accent`, `--axiom-hover`, `--axiom-border-neutral`
- **Custom scrollbar**: 6px, transparent track, low-opacity black thumb (matched in dark)
- **Shimmer**: `tw-shimmer` plugin used on streaming labels & tool-call running states

## Layout primitives

- **Two-column shell** (`AssistantSidebarLayout` + `AssistantSidebar`): Main content + togglable 400px right-side chat panel. Floating purple Gaia logo button (size-14, drop shadow → glow on hover) opens it.
- **Chat + artifacts** (`ChatLayout`): When a message has attached assets, splits into resizable panels (`react-resizable-panels`) — `Thread` (60%) + `AgentPanel` (40%, min 400px / max 800px). Falls back to plain Thread when no assets.
- **App sidebar** (`app-sidebar.tsx`): Hover-expand offcanvas pattern via CSS data-attrs. Sections built from `SectionTrigger` (animated framer-motion height/opacity, 300ms) + `NavItem`/`NavHeading`. Heights are pixel-precise to match helpdesk 2.0 (32px triggers, 28px items, 8px radius).
- **Welcome state**: Centered "Hello, {firstName}!" + "How can I help you today?" with `fade-in slide-in-from-bottom-1 animate-in`, followed by a 2-col grid of suggestion cards (ghost buttons w/ border, two-line label).

## Chat surface (`assistant-ui/thread.tsx`)

This is the core file to mirror.

**Root structure**:
```
ThreadPrimitive.Root (flex-col, h-full)
└── ThreadPrimitive.Viewport (turnAnchor="bottom", autoScroll, scroll-smooth)
    ├── ThreadWelcome (when isEmpty)
    ├── ThreadPrimitive.Messages (renders UserMessage / AssistantMessage / EditComposer)
    └── ThreadPrimitive.ViewportFooter (sticky bottom, max-w via --thread-max-width: 44rem)
        ├── ThreadScrollToBottom (floating pill above composer)
        ├── StreamingStatus (rotating "Thinking…/Reflecting…/Synthesizing…" with shimmer + Stop btn)
        └── Composer  OR  HITLApproval
```

**Key behaviors**:
- `--thread-max-width: 44rem` set via inline style on the Root — single source of truth for centerline width
- **Tool-call visibility toggle** stored in `localStorage` (`gaia-show-tool-calls`). When off, intermediate text parts are hidden via `SmartText` and only the final answer is shown
- **Double-texting**: Custom `SendButton` and `handleKeyDown` bypass assistant-ui's `isRunning` lock so users can queue follow-ups while a stream is in flight
- **Stop button**: Tracks `stoppingMessageId` (logical tail) and calls `cancelTrackedRunsForThread`
- **HITL interrupts**: `useLangGraphInterruptState` → if `action_requests` exist and not dismissed, render `HITLApproval` *in place of* the composer

### Composer (the "look")

- Outer: `rounded-2xl border border-input bg-background`, dropzone with `data-[dragging=true]:border-dashed`
- Focus ring: `has-[textarea:focus-visible]:border-[hsl(262_60%_55%)] has-[textarea:focus-visible]:ring-2`
- Textarea: `min-h-14 max-h-32`, autosize, `placeholder:text-muted-foreground`
- Action row: attachments, agent selector, "View actions" Switch (toggles tool calls), private/public visibility chip (only when thread is empty), optional skill-branch chip
- Send button: round, purple, `ArrowUpIcon`, custom logic so it can fire mid-stream

### User vs assistant messages

- **User**: Right-aligned bubble. Grid `[minmax(72px,1fr)_auto]` so attachments/branch picker can hang in left col. Bubble: `rounded-2xl bg-muted px-4 py-2.5 text-sm`
- **Assistant**: Full-width, no bubble — just `wrap-break-word px-2 text-sm leading-relaxed`. Followed by `MessageArtifacts` and `BranchPicker` footer

## Tool calls (`tool-fallback.tsx`)

The default UI for any tool the agent invokes — collapsible card with status icon.

- **Status → icon map**: `running` → `LoaderIcon` (spinning), `complete` → `CheckIcon`, `incomplete` → `XCircleIcon`, `requires-action` → `AlertCircleIcon`
- **Trigger**: `Used tool: <ToolName>` (or `Cancelled tool: ...` strikethrough). While running, a sibling absolutely-positioned `shimmer` clone overlays for the running effect
- **Chevron**: rotates `-90deg → 0deg` on open, animation duration via CSS var (`--animation-duration: 200ms`)
- **Content**: shown in collapsible body — error → args → result. Result is `<pre>` with whitespace-pre-wrap. Cancelled state dims args and skips result
- **Compound exports**: `ToolFallback.Root`, `.Trigger`, `.Content`, `.Args`, `.Result`, `.Error` so callers can recompose
- **Custom tool UIs** are registered in `ToolUiRegistrations.tsx` via `makeAssistantToolUI` (not read here, but the pattern)

## Streaming status (`StreamingStatus.tsx`)

Sits above the composer; the gold standard for "the agent is working" feedback.

- Animated grid-row collapse: `gridTemplateRows: visible ? '1fr' : '0fr'` + opacity transition (300ms)
- Pill: `rounded-lg border border-border/60 bg-background/95 px-3 py-2 text-xs text-muted-foreground`
- `LoaderIcon` (spinning) + label + Stop button
- Label: server-provided status string OR a randomly-rotated default from `['Thinking', 'Reflecting', 'Reasoning', 'Synthesizing', 'Resolving']`, swapped every 3s with a never-repeat-prev rule
- Shimmer applied to the label text
- Stop button: faint purple chip (`bg-[hsl(262_60%_55%/0.08)]`) that intensifies on hover

## Artifacts (`MessageArtifacts.tsx`)

How files / charts / dashboards generated by the agent appear inline under an assistant message.

- One `AssetWidget` per linked asset (matched via `asset.message_ids.includes(messageId)`)
- Compact header bar: icon + title + tiny type badge (`Dashboard`, `Chart`, `Report`, etc.) + `View` (expand) + `Sidebar` (move to side panel) buttons
- Expanded body inlines:
  - Metabase: iframe via `/api/embed/question/:id` (with skeleton fallback)
  - GCS images: `<img>`
  - GCS HTML: `srcDoc` iframe + injected click interceptor that opens links in `window.top`
  - GCS reports inside the helpdesk widget: redirect to documents view via `useOptionalEmbedNavigation` instead of inlining

## HITL approval card (`HITLApproval.tsx`, partial)

When the agent requests human approval (e.g. `hc_update_guidance`), the composer is replaced by a card with:
- Friendly tool-name labels (`hc_update_guidance` → "Update Article")
- Friendly arg-key labels (`commit_message` → "Summary of changes")
- Hidden internal keys (`help_center_id`, `guidance_id`)
- Per-arg formatted preview (HTML content rendered as a sandboxed `prose` block, booleans as Yes/No)
- Approve / Reject buttons + optional message
- Auto-mode toggle persisted in `localStorage` (`gaia-hitl-mode`)

## Runtime + provider stack (`RuntimeProvider.tsx`)

Pattern for wiring assistant-ui to a backend (LangGraph here, but the layering is the lesson):

```
RuntimeReadyContext
└── FilesProvider
    └── ExternalAssetsProvider
        └── StreamingStatusProvider
            └── RuntimeInner (key={basePath})
                └── AssistantRuntimeProvider (aui + runtime)
                    ├── JoinActiveStream
                    └── SuggestionsProvider → ToolUiRegistrations → children
```

- Provisional thread title: derived from the first user message (truncated to 60 chars) and applied optimistically before the server returns a summary
- Thread list refresh on `visibilitychange` so cross-tab edits show up
- `setActiveBasePath` is called *synchronously* in render, not in an effect, because child mount-effects fire first

## Patterns worth porting to copilot-onboarding

1. **The composer recipe**: rounded-2xl card, focus-ring purple, autosizing textarea, action row split (left: tools, right: round purple send). Drives the entire visual identity.
2. **Streaming status pill** with rotating shimmer labels — a small but signature touch.
3. **Tool-call collapsible** with status icon + shimmer running state — even if you stub the data, the affordance is recognizable.
4. **Welcome screen** ("Hello, {firstName}!" + suggestion grid) — directly transferable as the onboarding entry surface.
5. **Token system**: Copy `:root` and `.dark` blocks from `src/index.css` wholesale. Pair Axiom semantic tokens with ShadCN tokens; use Axiom for nav/sidebar, ShadCN for chat surface.
6. **Layout shell**: floating purple bubble → 400px right panel slide-out is the pattern for "copilot inside another product".
7. **HITL pattern**: replacing the composer with an approval card (rather than overlaying) is a strong UX choice — keeps focus on the decision.
8. **`--thread-max-width` CSS var** as the single source of truth for chat width. Keeps welcome/composer/messages all aligned.

## Files to read first (in priority order)

1. `src/client/components/assistant-ui/thread.tsx` — the chat surface
2. `src/index.css` — tokens & dark mode
3. `src/client/components/chat/StreamingStatus.tsx` — streaming pill
4. `src/client/components/assistant-ui/tool-fallback.tsx` — tool calls
5. `src/client/components/chat/ChatLayout.tsx` — split layout
6. `src/client/components/assistant-ui/assistant-sidebar.tsx` — embed shell
7. `src/client/app/components/app-sidebar.tsx` — Axiom-style nav
8. `src/client/app/components/RuntimeProvider.tsx` — provider stack
9. `src/client/components/chat/HITLApproval.tsx` — approval card
10. `src/client/components/chat/MessageArtifacts.tsx` — inline artifacts
