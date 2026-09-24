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
- Start with 1 star. Extra clues cost 1. First tutorial solve and first complete Level 1 solve each earn 1. Replays never farm rewards.
- Browser-local progress includes boards, stars, purchased clues, completion and reward state.

## Source and design

Canonical repository: `matyp1/math-test`; implementation branch: `build/five-slops-playtest`.
The approved black/lime/cream direction, badge logo and glossy Quip are preserved. Desktop uses five columns; phone layouts use readable scrolling lanes and a persistent shared pile.

See [the build report](docs/BUILD_REPORT.md) for actual QA results and limitations, and [asset documentation](docs/ASSETS.md) for the character lock and provenance.

## Files

- `data/level-01.json`: the five canonical phrases.
- `src/game-engine.mjs`: the shared One Slop/Five Slops engine.
- `src/state.mjs`: economy and persistence.
- `src/app.mjs`: screens and tutorial guidance.
- `src/styles.css`: approved visual direction and responsive layout.
- `assets/`: canonical logo, seven-pose Quip atlas, font/license and original SVG assets.
- `tests/engine.test.mjs`: fourteen rule, integrity and persistence tests.

Level 2 is a clearly marked future level. This prototype has no accounts, ads, backend or cloud sync.
