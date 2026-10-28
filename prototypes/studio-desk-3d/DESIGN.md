# A quiet desk: a 3D technique study

Reverse-engineered from [pradiplabs.dev](https://www.pradiplabs.dev/). It focuses on three things: the 3D objects, the smooth click-to-focus, and the subtle ambient motion. The content is a neutral design-studio desk.

## How the source is built

Findings come from its HTML shell and the `DeskScene-*.js` chunk, which is about 960 KB.

- **Stack:** Vite, React and Tailwind, with **React Three Fiber + drei** in one lazy-loaded chunk. Lazy loading means the headline paints first. The 3D downloads wait for a `largest-contentful-paint` promise (`window.__painted`) before they start.
- **No 3D model files:** The bundle has no `.glb` or `.gltf` references. Every object is built from Box, Capsule, Cylinder and Extrude geometry with `MeshStandardMaterial` or `MeshPhysicalMaterial`. The device screens are the only textures (`/desk/laptop.webp`, `tablet.webp`, `phone.webp`).
- **Light:** drei `<Environment>` provides reflections. A directional key light at `[5, 13, 8]` casts shadows. Output uses ACES tone mapping with a tuned exposure.
- **Motion:** drei `<Float>` gives the idle bob. Camera moves use `maath`'s `easing.damp3` / `dampE`, a critically damped spring stepped every frame. That spring is why clicks never snap: motion eases out of rest and into the target.
- **Day / evening:** A lamp toggles the room. A white radial gradient (`#FFF → #F4F4F6 → #E8E8EC`) cross-fades to a warm brown one (`#6B5442 → #221C18`), and the headline colors change with it. The first paint uses Sydney's actual sunset. A lamp choice is stored in localStorage with an expiry.
- **Fallback:** A WebGL probe with `failIfMajorPerformanceCaveat` runs before anything else. A device without a GPU gets a static poster image of the desk instead.

## How this port is built

Everything is in one no-build `index.html`. It uses **vanilla Three.js r170** loaded through an importmap from jsDelivr. The drei and maath helpers are hand-ported:

| Source (R3F) | Here |
| --- | --- |
| `easing.damp3` / `dampE` | `smoothDamp` (critically damped, Unity-style) wrapped in `Damp1` / `Damp3` |
| `<Float>` | A slow "breathing" camera drift. Now that the desk stands on legs, the camera moves instead of the desk, which slides the sharp desk against the soft room |
| `<Environment>` | `RoomEnvironment` through `PMREMGenerator` |
| Screen `.webp` textures | `CanvasTexture`, redrawn at 20 fps (a design tool with a wandering cursor) |
| Static poster image | An inline SVG desk and blurred room with their own CSS ambient motion |

## The apartment

The source has no room behind its desk. This port adds one from a rough sketch.

- **Two renderers share one camera.** The desk scene renders sharp on a transparent canvas. The apartment renders in its own scene on a canvas behind it, at half resolution, with a CSS `blur()` (7px, rising to 12px while an object is focused). Because both use the same camera, parallax and camera moves stay correct, so the blur reads as depth of field. The room canvas extends 48px past the viewport on each side (`setViewOffset` widens the frustum to match), so the blur never softens the screen edges.
- **Layout:** The floor is dark walnut planks. The back wall is 3.2m behind the desk, with a door on the left and two walnut shelves on the right. The shelves hold books, a small sculpture and a second copy of the plant. The right wall has a window, and the left wall has a framed print. There are baseboards and a rug with soft contact shadows for the desk and its legs.
- **Window:** Day and night views cross-fade with the lamp. In daylight a soft pool of light falls on the floor. Window light becomes moonlight in the evening, and a point light at the lamp head warms the room.
- **Cats:** Two black cats built from capsules and spheres. One walks along the back wall, pauses, glances at the camera and turns back. The other sits and swishes its tail. Their eyes catch the light in the evening.
- **Framing:** The overview fits the desk's front edge to about 75% of the viewport width (92% in portrait), then zooms in 15%. It looks down at 15° (13° in portrait), with the camera on a ray 5° steeper so the desk sits just below the middle of the frame. That keeps the floor line and the cats just above the desk's back edge. The room is cropped as needed.

The plant is the one imported model: Kenney's low-poly `pottedPlant` (CC0, about 60 triangles). It is recoloured at runtime to the desk palette so it matches the procedural objects. See `assets/SOURCES.md`. A faceted procedural stand-in renders until the model loads. It stays if loading fails, for example when the file is opened over `file://`.

## Motion constants

- Camera position and target use `smoothDamp` with a 0.42s smooth time. On load, the camera dollies in from 1.4× distance.
- Pointer parallax shifts the camera ±0.06 units in the overview and ±0.012 when focused, damped over 0.6s.
- Ambient camera drift: ±3cm sideways at 0.19 rad/s and ±1.2cm vertically at 0.23 rad/s, reduced to a quarter while an object is focused.
- Walking cat: 0.2 m/s with a 2.5–6s pause at each end. It turns around by walking a 14cm-radius U-turn out from the wall at 0.16 m/s, stepping the whole way. Its heading follows its path, and its head leads into the turn. It then drifts back to the wall line over about 1.6s.
- Hover lifts an object 15mm with a 0.12s damp.
- The sketchbook cover opens over 0.45s to π + 0.085, so it rests on the desk.
- Spring reactions: the plant nudge uses k 70, c 4.5. The lamp head nod uses k 90, c 7.
- Sticky note: the curl damps to 1 over 0.16s. It then falls for 0.95s on an ease-out curve with a 3cm arc and a small sideways drift, and lands with a residual 0.14 curl.
- Evening blends the desk and room lights, the window view, the bulb emissive and exposure over 0.35s. The laptop screen fades between light and dark UI over 0.12s.

## Interaction rules

- Hovering with a mouse shows a pointer, a 15mm lift, and a tag that follows the object.
- Clicking the laptop, sketchbook, mug or plant focuses it with a caption. Back, Esc, or a click on empty space returns to the overview.
- The lamp toggles evening, switches the laptop to dark mode, and stores the choice for 12 hours. Clicking the plant gives it a spring nudge.
- The sticky note peels off with a vertex curl and drops onto the desk. Clicking it again sticks it back.
- Reduced motion turns off the camera drift, parallax, sway, steam drift and cat movement, and focus moves become near-instant.
- The view toggle switches between 3D and Static. `?static` forces the static view. Rendering pauses in a hidden tab and in static mode.

## Verify

Serve from the repo root (`python3 -m http.server`) so the glTF loads, then check:

- Hover, focus and return for each object, including Esc.
- The lamp toggle survives a reload.
- The note peels and re-sticks.
- The cover opens and closes.
- The laptop screen switches between light and dark with the lamp.
- The cats walk and swish, and the window changes with the lamp.
- Reduced motion behaves as described.
- `?static` shows the static desk.
- Layouts work at desktop and 390×844.
