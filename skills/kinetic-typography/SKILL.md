---
name: kinetic-typography
description: >-
  Add animated "kinetic typography" to an HTML page — headlines whose words cascade in one
  after another, a centered hero headline that gets pushed aside as content/cards slide in,
  top/bottom supporting lines that slide out of the headline, and a fractured/"cracked" word
  effect. Use when building motion-graphics-style titles, an animated headline reveal, a
  product explainer's text, or any "the words move like that launch video" request. Triggers:
  "animate the headline", "kinetic typography", "make the title words fly/rise in", "cracked
  text effect", "headline that slides aside when the cards come in", "word-by-word reveal".
---

# Kinetic Typography

Drop-in building blocks (`assets/kinetic.css` + `assets/kinetic.js`) for motion-graphics text in plain HTML/CSS — the look of polished SaaS launch videos. Three composable effects:

## 1. Word-cascade reveal
Each headline line masks its words; the words **rise into place one after another** behind the mask. `splitWords()` splits `.head .ln > span` into per-word `.wd` spans (preserving an inline colored/gradient word or a `.crackword` as one unit) and tags each with a global `--wi` index; the CSS `@keyframes wordrise` staggers by `--wi` so the whole headline "assembles" line by line.

```html
<div class="head"><span class="ln"><span>Find the <span class="grad">cracks</span></span></span>
                  <span class="ln"><span>first.</span></span></div>
<script src="kinetic.js"></script><script>splitWords();</script>
```
Play it by adding `.show` to an ancestor (e.g. the active scene).

## 2. Hero → push → reveal staging
A headline appears **centered as one line** (hero), then **content slides in and pushes it aside** while the kicker (top line) and subtitle (bottom line) **slide out of the headline**. Structure each scene as a `.lead` (kicker + `.head` + `.sub`) next to a `.cardstage`, mark the scene `.choreo dk-left` or `.choreo dk-right`, and toggle `.cardsin` when the content phase begins:

```html
<section class="scene choreo dk-right">
  <div class="lead"><div class="kicker">Section · Label</div>
       <div class="head"><span class="ln"><span>Govern every agent.</span></span></div>
       <div class="sub">One line of supporting copy.</div></div>
  <div class="cardstage"><!-- your cards / panel --></div>
</section>
```
- No `.cardsin` → headline centered (`--heroX` recenters it from its docked side), kicker/sub hidden, stage off-screen (`--stageHide`).
- Add `.cardsin` → lead slides to its dock, stage slides in from the opposite edge, kicker/sub slide out. Alternate `dk-left`/`dk-right` across scenes for variety.

## 3. Fractured / cracked word
Wrap a word `<span class="crackword" data-text="cracks">cracks</span>`. It renders as two copies clipped along a jagged seam; the CSS variable `--ck` ramps the fracture (0 = solid, 1 = fully cracked) with a red glint in the gap. Drive it in your frame loop so it cracks on cue (e.g. when a voiceover says the word):
```js
setCrack(el, clamp((t - crackStart) / crackDur, 0, 1));   // from kinetic.js
```
Keep `--ck` at 0 until the word has finished its cascade-in, so it reads "word appears → then cracks."

## Notes
- Units are container-query units (`cqw`/`cqh`); put the scene inside a `container-type: size` stage, or swap to `vw`/`%`.
- These are **logical-time friendly**: the cascade/push are CSS, the crack is variable-driven — so they render cleanly with the `smooth-render` skill (scale the transition/animation durations by 1/RATE at render time).
- To sync cues (a word cracking, a card raising) to a **voiceover**, pair with the `vo-sync` skill.
