# StudyScape focused upgrade

## Scope
Upgrade the existing StudyScape implementation in place. Keep the current routes, store, timer hook, world configuration, scene compositor, weather masking, avatar rig, audio engine, panels, and visual language.

## Implementation

### 1. Custom timer input
- Replace preset duration chips on the focus entry screen with compact hours and minutes number inputs.
- Derive the duration only from those inputs; reject empty, non-numeric, zero, negative, and out-of-range values with a small inline message.
- Keep the existing wall-clock timer hook and HUD. Start, pause, resume, end, reset, progress, and session recording continue to use the validated custom duration.
- Add a visible Reset action during a running/paused session without changing the timer presentation.

### 2. Single developer mode
- Use the existing persisted `settings.devMode` as the sole testing bypass; migrate any saved legacy `devUnlockAll` value into it.
- Make `isUnlocked` return true in Dev Mode, expose the existing developer panel, allow every weather option in the normal atmosphere panel while Dev Mode is active, and keep free world switching/testing controls.
- Clearly label active testing state as `DEV MODE`; normal users retain progression restrictions.

### 3. Permanent earned world access
- Add a persisted set of earned world IDs to the existing local store.
- Whenever total focus time reaches a world's threshold, permanently add that world to the set; never remove it when a later session begins or state is rehydrated.
- Use the existing `isUnlocked` and `unlockProgress` APIs so cards, routing guards, stats, and world switching all share the same rule. Developer Mode bypasses the rule without modifying earned access.
- The existing explicit developer reset will reset progression and earned access together for repeatable testing.

### 4. Weather-aware ambience
- Extend the existing Web Audio ambience engine rather than adding audio files or libraries.
- Give clear, cloudy, rain, thunderstorm, snow, fog, windy, daytime, and nighttime distinct subtle sound profiles, with world-specific room layers and fireplace/cafe character retained.
- Crossfade changing layers, stop obsolete nodes after fade-out, deduplicate active layers, and keep one engine instance so previous weather cannot continue playing.
- Start/resume audio from the existing session-start gesture, while preserving mute, master volume, ambient volume, visibility pausing, and the manual audio control fallback.

### 5. World visual upgrades
- Extend the current data-driven prop system and add a lightweight world-decoration layer inside `WorldScene`; keep weather strictly clipped behind each world's windows.
- Enrich all eight worlds with distinct architecture, materials, foreground/background depth, furniture, objects, and restrained ambient motion:
  - Japanese Room: tatami lines, low table, floor cushion, tea steam, shoji/wood details, lantern warmth; avatar sits without a western chair.
  - Fantasy Library: taller book-filled shelves, reading table/chair, book stacks, greenery, candles/lanterns, magical glints and dust motes.
  - Cozy Café: cafe tables/chairs, detailed counter and espresso machine, menu board, cups, pastry, plants, pendant lighting, coffee steam; avatar studies at the table.
  - Bedroom Study: fuller desk/books/stationery, chair, dressed bed, shelf and decor, curtain movement, lamp warmth, and an animated cat with breathing, tail, blink, and occasional stretch cues.
  - Snow Cabin: stronger timber treatment, winter furnishings, desk/books/blanket, fireplace detail, frosted windows, warm/cold contrast, and winter clothing on the avatar.
  - Observatory, Treehouse, and Blossom Pavilion: stronger science, canopy/rope, and open-nature identities with their own subtle animated details.
- Reuse CSS/SVG primitives and existing keyframes; add only small reduced-motion-aware CSS animations and no heavy rendering dependency.

### 6. Stability and verification
- Fix the current greeting hydration mismatch by rendering a deterministic initial greeting and updating it after hydration.
- Verify desktop, laptop, tablet, and small-screen layouts; ensure decorations never cover the timer, avatar, or controls.
- Exercise custom timer validation and controls, refresh-persistent unlocks, Dev Mode bypass and all-weather access, weather sound switching/mute/volume, every world, room features, world switching, and the full home → worlds → focus → completion → home flow.
- Check for browser errors and regressions after the changes.

## Technical notes
- No backend, authentication, new state system, router changes, 3D engine, animation library, or architectural rewrite.
- Changes stay concentrated in the current store, focus route/HUD, atmosphere panel, audio helper, world data/rendering components, avatar, and global animation tokens.
