---
name: backgrounds-gradients
description: >-
  Living backgrounds & moving gradients for motion-graphics videos — the layer that makes a frame
  feel alive instead of a static slide. Color-arc gradient that shifts per scene with drifting
  blobs, a soft mesh light-wash that glides across, blueprint line grids, dot-matrix fields,
  glowing neon curved paths with travelling light-dots, starfields, and grain/paper/paint texture
  overlays. Use when a scene looks flat or slide-like, when adding a moving gradient behind the
  whole piece, or matching a reference reel's animated background. Triggers: "moving gradient
  background", "gradient that shifts through the video", "make the background alive", "mesh
  gradient wash", "blueprint grid", "dotted background", "neon lines", "starfield", "film grain /
  texture overlay".
---

# Backgrounds & Gradients

Family **B** of the **motion-graphics** super-skill. Drop-in building blocks live in the
shared library — from any skill in this plugin: `../motion-graphics/assets/motion.css` +
`motion.js`. Every effect scales by `--R` and is driven by **logical time `t`**, so it survives
slow-clock capture (see `smooth-render`).

```html
<link rel="stylesheet" href="../motion-graphics/assets/motion.css">
<script src="../motion-graphics/assets/motion.js"></script>
```

## Moves
| # | Name | Looks like | Build |
|---|---|---|---|
| B1 | **Color-Arc + Blobs** | palette shifts per scene; soft blobs drift | `.tm-gradbg + tmGrad + tmDrift` |
| B2 | **Mesh Wash** | a soft colored light-sweep glides across the frame | `.tm-mesh + tmMesh` |
| B3 | **Blueprint Grid** | faint technical line grid | `.tm-grid` |
| B4 | **Dot Matrix** | faint dotted grid field | `.tm-dots` |
| B5 | **Neon Path + Travellers** | glowing curved lines with light-dots running along them | `.tm-path + tmTravel` |
| B6 | **Starfield Drift** | tiny dots twinkle + parallax | `.tm-stars + tmStars` |
| B7 | **Texture Overlay** | grain / paper / halftone / paint-wash over the frame | `.tm-grainwrap / .tm-paint / .tm-halftone` |

## Rules that make these render-safe
- **Never `filter:blur()` / `backdrop-filter:blur()`** — headless Chromium/Edge software-rasterizes
  them and capture drops to ~5 fps. Softness is faked with radial-gradient falloff / translucent
  fills / directional text-shadow smears.
- Drive every time-based helper by your render clock's **logical time `t`**, never wall-clock.

## See also
The full menu across all 8 families (A–H, ~56 moves) is the **motion-graphics** master skill and its
[PLATTER.md](../motion-graphics/PLATTER.md). Ask for "the platter" to get the whole menu.
