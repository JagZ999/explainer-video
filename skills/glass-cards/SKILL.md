---
name: glass-cards
description: >-
  Build frosted "liquid glass" UI cards/panels on a dark animated background, where a card
  ZOOMS FORWARD to demo itself and then falls back as the next one rises, plus a gentle camera
  zoom-in/settle. Use for glassmorphism UI mockups, a product explainer's feature panels, an
  animated card grid where each card steps forward in turn, or any "frosted glass panels that
  zoom out and come back" / "liquid glass" look. Triggers: "liquid glass cards", "glassmorphism
  panels", "frosted glass UI", "cards that zoom forward then fall back", "glass panel zooming
  out and back", "animated card grid that highlights one at a time", "camera zoom into the scene".
---

# Glass Cards

The signature **liquid-glass card** system: frosted translucent panels with a neon gradient border and a glass shine, sitting on a dark gradient background with a drifting glow and dot grid — where one card **zooms/rises forward** to play its content, then **falls back** to the grid as the next rises, all under a gentle **camera zoom-in → settle**. Drop-in via `assets/glass.css` + `assets/glass.js`.

## Pieces (pick what you need)
- **Animated background** — `.stage` (dark multi-gradient, 16:9, container-query units) + `.bgfx` (soft dot grid) + `.wash` (slow drifting glow orb).
- **Liquid-glass card** — `.lcard`: frosted `backdrop-filter` glass, a masked **gradient border** (`::before`, fed by `--edge`), and a diagonal **shine** (`::after`). Set `--accent`/`--accent2`/`--edge` per scene for the color.
- **Zoom-forward / fall-back** — toggle `.up` on the active card (it grows to a forward "hero" size and turns **dark + opaque** so nothing shows through it) and `.dim` on the rest; switching `.up` to the next card makes the current one fall back. The `left/top/width/height` transition does the zoom.
- **Staggered entrance** — add `.cardsin` to the stage/scene to play `cardIn` (cards rise + fade in one after another).
- **Camera zoom** — wrap scenes in `.world`; `enterScene(world)` nudges scale to ~1.06 then settles to 1.0 (the 1.6s CSS transition is the move).

## Minimal usage
```html
<div class="stage"><div class="bgfx"></div><div class="wash"></div>
  <div class="world"><section class="scene">
    <div class="cardstage">
      <div class="lcard" data-k="a"><div class="pad">…card A…</div></div>
      <div class="lcard" data-k="b"><div class="pad">…card B…</div></div>
      <div class="lcard" data-k="c"><div class="pad">…card C…</div></div>
    </div>
  </section></div>
</div>
<script src="glass.js"></script>
<script>
  const stage = document.querySelector('.cardstage');
  placeGrid(stage, 3, 1);                 // lay the cards out in a grid
  enterScene(document.querySelector('.world'));   // camera zoom-in → settle
  revealCards(document.querySelector('.scene'));  // staggered entrance
  // step through them on cue (e.g. from vo-sync timing): raise(stage,'a') → raise(stage,'b') → …
  raise(stage, 'a');
</script>
```
`raise(stage, key)` zooms that card forward and dims the rest; call it again with the next key to make the current fall back and the next rise. `raise(stage, null)` drops everything back to the grid.

## Composes with the other skills
- **kinetic-typography** — put a `.lead` (headline) beside the `.cardstage` and mark the scene `.choreo dk-left|dk-right` so the headline gets pushed aside as the cards arrive.
- **vo-sync** — drive `raise()` and `enterScene()` from `timing.json` so each card zooms forward exactly when the voiceover names it.
- **smooth-render** — renders cleanly: the glass/zoom are CSS transitions (scale their durations by 1/RATE) and the camera/raise are state toggles. Drop `backdrop-filter` at capture time (per-frame expensive, visually negligible over the gradient).

## Notes
- Units are `cqw`/`cqh` (relative to `.stage`); keep content inside the stage container.
- The forward card is intentionally **opaque** so lower cards don't bleed through it; the others sit at ~28% (`.dim`). Tune `.lcard.up` size/position (or add `[data-type]` variants) for taller demo content.
