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
| `<Float>` | Sine bob plus a tiny yaw and pitch on the whole desk rig |
| `<Environment>` | `RoomEnvironment` through `PMREMGenerator` |
| Screen `.webp` textures | `CanvasTexture`, redrawn at 20 fps (a design tool with a wandering cursor) |
| Static poster image | An inline SVG desk with its own CSS ambient motion |

The plant is the one imported model: Poly Haven `potted_plant_04` (CC0, about 2 MB). See `assets/SOURCES.md`. A procedural stand-in made of a lathe pot and cone leaves renders until the model loads. It stays if loading fails, for example when the file is opened over `file://`.

## Motion constants

- Camera position and target use `smoothDamp` with a 0.42s smooth time. On load, the camera dollies in from 1.4× distance.
- Pointer parallax shifts the camera ±0.06 units in the overview and ±0.012 when focused, damped over 0.6s.
- Ambient rig motion: y ±4mm at 0.5 rad/s, yaw ±0.012 rad, and pitch ±0.005 rad.
- Hover lifts an object 15mm with a 0.12s damp.
- The sketchbook cover opens over 0.45s to π + 0.085, so it rests on the desk.
- Spring reactions: the plant nudge uses k 70, c 4.5. The lamp head nod uses k 90, c 7.
- Sticky note: the curl damps to 1 over 0.16s. It then falls for 0.95s on an ease-out curve with a 3cm arc and a small sideways drift, and lands with a residual 0.14 curl.
- Evening blends the key light, hemisphere light, environment, spot light, bulb emissive and exposure over 0.35s. The CSS backgrounds cross-fade over 0.9s.

## Interaction rules

- Hovering with a mouse shows a pointer, a 15mm lift, and a tag that follows the object.
- Clicking the laptop, sketchbook, mug or plant focuses it with a caption. Back, Esc, or a click on empty space returns to the overview.
- The lamp toggles evening and stores the choice for 12 hours. The plant also gets a spring nudge.
- The sticky note peels off with a vertex curl and drops onto the desk. Clicking it again sticks it back.
- Reduced motion turns off the float, parallax, sway and steam drift, and focus moves become near-instant.
- The view toggle switches between 3D and Static. `?static` forces the static view. Rendering pauses in a hidden tab and in static mode.

## Verify

Serve from the repo root (`python3 -m http.server`) so the glTF loads, then check:

- Hover, focus and return for each object, including Esc.
- The lamp toggle survives a reload.
- The note peels and re-sticks.
- The cover opens and closes.
- Reduced motion behaves as described.
- `?static` shows the static desk.
- Layouts work at desktop and 390×844.
