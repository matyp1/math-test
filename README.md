# WORD slop swap

A playable mobile-first word game: learn One Slop, then rebuild five familiar phrases from one shared word pile.

## Run

```sh
npm install
npm run dev
```

Or serve the source directly with `python3 -m http.server 4173` (no runtime dependencies).

```sh
npm test
npm run build
```

`dist/` is a complete static deployment. `tests/viewport.html` is a development-only phone/desktop harness and is not included in the build.

## Rules

- Select a word, then tap its destination. Filled slots swap. Placed words can move between lanes or return to the pile.
- Each phrase has one immovable anchor word and a free base hint.
- Only **CHECK THE SLOP** validates. Correct arrangements never auto-complete; wrong submissions preserve every word and star.
- Start with 1 star. Extra clues cost 1. First tutorial solve and each first level completion earn 1. Replays never farm rewards.
- Undo restores the last placement, swap or return-to-pile action.
- Levels unlock sequentially from 1 to 10; each has five unique phrases.
- Browser-local progress includes boards, stars, purchased clues, completion and reward state.

## Source and design

Canonical repository: `matyp1/math-test`; implementation branch: `build/five-slops-playtest`.
The approved black/lime/cream direction, badge logo and glossy Quip are preserved. Desktop uses five columns; phone layouts use readable scrolling lanes and a persistent shared pile.

See [the build report](docs/BUILD_REPORT.md) for actual QA results and limitations, and [asset documentation](docs/ASSETS.md) for the character lock and provenance.

## Files

- `data/levels.json`: ten-level journey and difficulty labels.
- `data/level-01.json` through `level-10.json`: fifty curated phrases; Level 1 remains canonical.
- `src/campaign.mjs`: sequential unlocks, recommendations and per-level rewards.
- `src/game-engine.mjs`: the shared One Slop/Five Slops engine.
- `src/state.mjs`: economy and persistence.
- `src/app.mjs`: screens and tutorial guidance.
- `src/styles.css`: approved visual direction and responsive layout.
- `assets/`: canonical logo, seven-pose Quip atlas, font/license and original SVG assets.
- `tests/engine.test.mjs`: eighteen rule, integrity and persistence tests.

Levels 2–10 reuse curated content from the existing WordSlop puzzle library. Level 2 has less revealing hints; later boards remove standing coaching and keep optional clues. This prototype has no accounts, ads, backend or cloud sync.
