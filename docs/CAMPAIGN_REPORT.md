# Ten-level campaign and Level 2 interaction pass

Levels 2–10 are curated from the existing `wordslop_puzzle_library_v1.json` (Library ID `libfile_6d0320b6f5d481919c6ea533b6d41a4f`). Per-puzzle source IDs are retained. Variant-hold entries and duplicate phrases are excluded. Level 1 is unchanged.

| Level | Title | Shared words | Difficulty change |
| --- | --- | ---: | --- |
| 1 | One big, beautiful mess | 18 | LEARN THE MESS |
| 2 | Finding your feet | 19 | FAMILIAR FAVOURITES |
| 3 | A little resemblance | 21 | SIMILAR SOUNDS |
| 4 | Kitchen wisdom | 25 | LONGER SAYINGS |
| 5 | Hidden in plain sight | 25 | LESS OBVIOUS ANCHORS |
| 6 | Riddle me this | 30 | FIVE QUESTIONS |
| 7 | Words of wisdom | 32 | LONGER THREADS |
| 8 | Mixed messages | 35 | SAYINGS MEET RIDDLES |
| 9 | Tangled thoughts | 39 | DEEPER SLOP |
| 10 | The grand untangle | 45 | MASTER MIX |

## Level 2 design
- Shorter, less literal hints: SUBTEXT, SWEET SUCCESS, LUNAR RARITY, STEEP PRICE, STRAIGHT TALK.
- Standing coaching removed from Levels 2 onward; help stays available.
- Darker locked anchors, dashed empty slots, stronger lift glow and a brief placement flash.
- One-step Undo restores placements, occupied-slot swaps, cross-lane movement and return-to-pile moves; it never refunds clues or rewards. Undo history is intentionally session-only.
- Paid clues remain available at the existing one-star price. No live correctness cues, timers or mistake penalties.

## Campaign
- Ten levels, five unique phrases each, per-level saved boards, sequential unlocks and replay.
- One star per first level completion; replay cannot earn it again.
- Old Level 1 boards migrate to their level ID without losing stars or purchased clues.
- The final success screen ends the campaign without advertising an unavailable Level 11.

## Validation
- 18 automated tests passed: content integrity, all ten board solutions, wrong-board preservation, sequential unlocks, persistence and anti-farming.
- Difficulty is designed, not empirically calibrated. Test with first-time players to refine the curve.
- No real iPhone/Safari hardware test has been performed.

## Browser results
- PASS — Levels 1–10 completed through actual select/place taps, manual checks and next-level buttons in a 393 px phone viewport.
- PASS — Every fully arranged level remained on the board until CHECK THE SLOP.
- PASS — Fresh save locked Levels 2–10; each solve unlocked the next.
- PASS — All ten completions and 11-star balance survived reload (tutorial reward not collected in this test).
- PASS — Level 2 Undo restored both a pool placement and a cross-lane move.
- PASS — Incorrect Level 2 submission preserved the placed word.
- PASS — At 320 px, the initial BETWEEN tile clipping was found and fixed; no overflowing word tiles or horizontal page overflow remained on the tested Level 2 board.
- Screenshot: `qa/level-02-mobile.jpg` records actual gameplay, with the test account balance.
