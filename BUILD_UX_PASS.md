# WORD slop swap — Visual UX pass

Target: bring the playable Level 1 close to the approved black / cream / electric-lime mobile references without changing the locked puzzle rules.

## Job 1 — Gameplay surface
Prompt: Rebuild the puzzle screen around oversized cream word cards on a near-black field. Selected word must lift, turn electric lime, glow, and show short lime impact marks. Preserve tap-one-word then tap-another-word swapping. Do not use drag-and-drop. Preserve the move counter. The game must NEVER auto-solve when the sequence becomes correct; only Check answer can validate and trigger success.

Acceptance:
- selected state is unmistakable
- second tap swaps and increments Moves
- correct ordering can sit on screen unsolved
- Check answer is mandatory
- incorrect Check answer preserves order and has no penalty

## Job 2 — First-play teaching
Prompt: Add a lightweight animated white tap-hand cue for the first Level 1 puzzle only. It may point at a word card, but must disappear as soon as the player makes their first selection and must not obstruct taps. Do not show it repeatedly once dismissed during the session.

Asset path: assets/tap-hand.svg

## Job 3 — Success / reward UX
Prompt: Rebuild success as a premium celebration screen: Quip mascot at top, lime glow, gold star/spark accents, large Nice swap! heading, solved phrase card, star reward, circular streak/progress indicator, dominant lime Next slop button and secondary Share button. Use the real game economy rather than placeholder +50 rewards.

## Job 4 — Motion + tactile polish
Prompt: Add short CSS motion only: selected-card lift, swap pop, success mascot bounce/squash, sparkle drift and button press. Respect prefers-reduced-motion. Use navigator.vibrate only as optional enhancement.

## Job 5 — Level 1 integrity QA
Prompt: Audit all five puzzles end-to-end. Verify five puzzles are reachable sequentially, clue cost and star rewards are consistent, progress survives navigation, wrong checks do not mutate the arrangement, and Level 1 completion only appears after all five are solved.

## Asset-generation path if raster art becomes necessary
The first pass deliberately uses SVG/CSS because it stays sharp, lightweight and animatable. If the SVG mascot is not visually rich enough after device testing, use Higgsfield with the approved screenshots as style references:
1. assets/quip-gameplay.webp — isolated glossy black-to-electric-lime slime mascot, neutral mischievous expression, transparent/clean background, no text, front three-quarter view, mobile-game asset.
2. assets/quip-success.webp — same exact mascot identity, joyful closed-eye expression, slight squash/bounce pose, lime splashes and small gold star accents, no text.
3. assets/quip-reward.webp — same exact mascot identity, compact excited pose suitable for reward card, no text.
Generate all three from the same reference set and lock silhouette, eye spacing, gradient direction and highlight placement for continuity.

## Connected tools
- GitHub: source-of-truth, commits and audit trail.
- Higgsfield: only if raster mascot variants materially beat the SVG/CSS pass.
- Vercel: production/preview deployment once the connected create/deploy action is available.
- Visualize/inline prototype: fast interaction QA before promoting visual changes.
