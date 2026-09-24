# WORD slop swap — build report

## Status
Playable core complete and browser-tested. One Slop and Five Slops share the same engine. Hosting status is recorded separately in the handoff; a local preview is not a deployment.

## Implemented
- Branded splash, working home, interactive One Slop, shared Five Slops board and success screens.
- Tutorial starts with BULLET and BITE in its pile, with THE locked in the middle. The first step advances only after BITE is tapped.
- Exactly the five specified Level 1 phrases, 5 locked anchors, 18 uniquely identified movable tokens and one shared pile.
- Tap to select/deselect, empty-slot placement, occupied-slot swaps, movement between lanes, and explicit return to pile.
- Deliberate CHECK THE SLOP submission in both modes. No correctness queries in rendering, no per-phrase correctness giveaway.
- Incorrect checks preserve the board and stars. Incomplete boards can also be checked safely.
- Starting balance 1; extra clue costs 1; tutorial first solve +1; first complete Level 1 solve +1. No repeated rewards.
- Purchased clues, both boards, completed puzzles/level, tutorial completion, unlocked progression and rewards survive reload.
- Existing wss3 balances and rewarded-level state migrate without erasing earned stars.
- Reduced-motion support, keyboard-operable controls, accessible slot names, live announcements and help dialog.
- No runtime framework migration or backend. Content is JSON; engine, persistence, app and CSS are separate files. Vite is a development-only preview dependency.

## Functional QA — actual results
Test environment: Chrome cloud browser using the running application, not direct engine-state injection. A viewport harness exercised 320×690, 393×852 and 430×932 phone layouts and 1024×900 desktop.

| Check | Result |
|---|---|
| Tutorial launch, real BITE select, lift/glow, placement and BULLET placement | PASS — browser |
| Correct tutorial arrangement does not auto-solve | PASS — browser |
| Wrong complete tutorial submission preserves words and star balance | PASS — browser |
| Correct tutorial submit earns one star and transitions to Five Slops | PASS — browser |
| Exactly five canonical puzzles, five locked anchors, 18 shared words | PASS — browser + engine tests |
| Locked words disabled; engine rejects attempts to overwrite them | PASS — browser + engine tests |
| Move pool → lane, lane → another lane, occupied-slot swap, lane → pool | PASS — browser + engine tests |
| Filling a correct phrase gives no correctness marker | PASS — browser |
| All 18 words placed through actual UI taps | PASS — browser |
| Correct complete Five Slops board does not auto-complete or grant stars | PASS — browser |
| Wrong complete Five Slops submission preserves all five lanes and stars | PASS — browser |
| Level 1 only succeeds on deliberate correct submission | PASS — browser |
| One-star clue debit; zero balance refusal; retained purchased clues | PASS — browser + engine tests |
| Repeated level submission after reload gives no extra stars | PASS — browser |
| Full tutorial replay gives no extra stars | PASS — browser |
| Saved board, completion, stars and clues survive reload | PASS — browser + engine tests |
| No horizontal overflow at 320, 393 and 430 pixel widths | PASS — browser geometry and visual inspection |
| Help opens/closes; pile collapse/expand works | PASS — browser |
| Corrupt saves, duplicate tokens, denied storage and legacy migration | PASS — 14 automated engine/persistence tests |

Command: `npm test` — 14 tests passed, 0 failed. `npm run build` produces the static site.

## Discrepancies found and fixed
- The original implementation exposed correct lanes before submission; removed all live correctness checks.
- Original fifth phrase was EARLY RISER; canonical CLOCK riddle restored in the required order.
- Word lengths caused mobile lanes to resize and move tap targets; mobile slots now use stable grids, and the tray keeps a stable height.
- Wrong-answer and insufficient-star messages could be offscreen; feedback is now also beside the word pile.
- Enlarged clues, corrected lock-icon spacing, tightened tutorial spacing, and separated the desktop progress badge from Quip.
- Original category, stats and profile controls were placeholders; removed from this scoped build.

## Design and assets
Inspected Figma file `kj6MQuDa7lZpIwECnIslX6`, tutorial frames `1:5` and `1:74`, plus approved Five Slops, four-screen app, tutorial storyboard and glossy badge references. Figma was read, not modified.

One canonical logo cutout and one consistent seven-pose Quip atlas are reused everywhere. Locally served Lilita One brings the chunky display/word typography closer to the reference; its OFL license is included. See `ASSETS.md`.

Matches: black/charcoal base, cream dimensional tiles, lime selection and CTA, gold rewards, tinted lanes, rounded panels, expressive glossy Quip and enclosed branding.

Differences: phone lanes stack and scroll with a persistent word tray, rather than squeezing five tiny columns onto the screen. Desktop keeps five columns. Hint icons remain system emoji. The logo is a raster derivative and Quip poses are reference-derived, not original editable vector artwork. No pixel-perfect claim is made.

## Scope and remaining limits
- Level 2 is recorded as unlocked but clearly marked as still being prepared; this build contains only Level 1.
- Persistence is local to a browser/origin, not cloud sync. Moving to a different deployment origin starts a separate save.
- No physical iPhone/Safari test has been performed. Safe-area CSS and mobile viewport behavior were checked in Chrome simulation.
- Vercel connector deployment action returned `Tool deploy_to_vercel not found`; private Sites hosting is the fallback.
- No assertion that the game is fun is made from automated tests. That requires first-time players.

## Next priority
Observe a small set of first-time players on real phones completing the tutorial and Level 1 without outside instructions; use those sessions to tune density, clue usefulness and difficulty.
