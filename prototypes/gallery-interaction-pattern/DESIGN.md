# Gallery interaction pattern

## Existing visual system

The portfolio is a quiet, horizontally explored gallery: sage walls, a shallow warm floor, muted framed landscape photos, and a small foreground companion. Italiana supplies the exhibition headings; Manrope supplies body text and controls. Preserve the existing gallery composition and artwork interactions when extending it.

- Ink: `#343e39`; secondary text uses muted greens.
- Wall: `#e9ece8`; picker surfaces: `#f5f6ef`; defined borders: `#c5cec2`.
- Headings are light, generously sized, and sentence case.
- Character choices have a 12px corner radius, a fine border, and visible keyboard focus. Mobile corners are 10px.

## Character selection

The native full-screen dialog is centered around a three-column, two-row grid, including on narrow phones. Each choice enters immediately. The gallery is inert and scrolling is locked until the entrance completes. Initial entry requires a choice; the Character control opens the picker again, with Escape or the close button returning to the existing character and gallery position.

The selected SVG travels from its actual grid position to its floor position in an 860ms hop, with a small landing compression. A short greeting then appears beside the companion. Only the first entrance has a short welcome stroll; wheel, touch, pointer, or keyboard input cancels it. Respect reduced motion by entering immediately and omitting the automatic stroll.

## Sprite language and scale

`sprites.js` owns all six SVGs, labels, dimensions, catchphrases, and non-human movement. The man and woman share the articulated human rig in `index.html`. Humans face right in a rear-three-quarter view: hair and nape dominate, the ear is near the leading edge, and only a narrow profile is visible. Mirror the whole sprite when traveling left. Keep the woman's bun behind the head.

Humans render at 138×279px, three times the original size. Mobile uses 83% of these dimensions, approximately three times its original size. Animals and imaginary companions have their own proportional dimensions, not a stretched human bounding box.

- Humans: contact/down/passing/up, knee articulation, heel/toe roll, opposing arms, and a grounded stop.
- Dog and cat: four phase-offset articulated legs, 60% stance, 40% swing, and grounded support paws.
- Ghost: gentle vertical float and a moving cloth hem.
- Snake: a traveling body wave, attached markings, and a small tongue flick.

Animations run only during movement or a bounded entrance. Hidden tabs, reduced-motion changes, and resizing complete or stop motion safely. The renderer retains no autonomous timers inside individual sprites.

## Small-screen composition

Keep all six choices visible at 320×568. On short phones, provide a deeper floor, a more compact exhibition heading, and a shorter opening frame so the full-size human clears the introduction and its CTA. Greetings occupy the spare floor space beside the companion; the snake uses a slightly higher greeting to clear its low silhouette. Controls remain below the companion and greeting.

## Assets and verification

The sprite vectors are authored in `sprites.js`. Existing photo origins are recorded in `assets/SOURCES.md`.

Development-only browser checks and review captures live in `.context/`. Verify all six selections, reselection without a scroll reset, keyboard focus, both travel directions, a grounded stop, interrupted welcome movement, live reduced-motion changes, and desktop plus 390×844 and 320×568 layouts.
