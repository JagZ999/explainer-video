---
description: Create an animated product explainer video (interactive, with voiceover/music/SFX)
---

Use the **explainer-video** skill to create an animated product explainer video.

Start the interactive workflow now:
1. Ask the user about their product and what assets they have (screenshots, a screen recording, a logo), and get everything into one working folder before building anything.
2. Interview them about design — visual style, color palette, font, logo, the scene list/order, intro & outro tagline, and which signature animations to include.
3. Build the HTML explainer by adapting `assets/example-explainer.html`, and verify it in the browser preview.
4. Ask which TTS provider to use (ElevenLabs / macOS say / bring-your-own / none) and, if needed, the API key. Ask music mood and whether to include a synced SFX track.
5. Generate voiceover (with word timestamps for cue sync), music, and the SFX track.
6. Ask the resolution and render to MP4 with `scripts/render.js`, then deliver the MP4 plus separate music & SFX stems.

Ask one decision at a time with AskUserQuestion and wait for the answer. Do not assume design, branding, scenes, or the TTS provider.
