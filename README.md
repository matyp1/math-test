# WORD slop swap — mobile play-test

A GitHub-first rebuild of the WORDslop concept based on the approved black/lime mobile visuals.

## Test build
- Splash screen and branded slime mascot
- Home screen with daily puzzle, category cards, stars and streak
- Puzzle screen with **tap → raise → tap → swap** interaction
- Electric-lime lifted-card state with glow / impact feedback
- First-puzzle tap-hand teaching cue
- No dragging
- Move counter; **Check answer is mandatory** and the puzzle never auto-solves
- Check-answer flow with no wrong-answer penalty
- New players start with 1 star; an extra clue costs 1 star
- Five-puzzle Level 1 progress rail; all five must be solved to complete the level
- Premium Quip success/reward screen with spark animation, solved phrase, real star reward and streak ring
- Next-puzzle progression
- Local persistence for stars, streak and completed puzzles
- Mobile responsive and install-friendly browser styling

## Test focus
The point of this phase is to validate the core loop and feel on a real phone before building accounts, backend sync, daily scheduling, full category libraries, stats and profiles.

Deployment target: Vercel.

## Five Slops board — current Level 1
Level 1 is now one shared deduction board rather than five isolated sentence screens.

- Five phrase lanes are visible together.
- Each lane has a base hint and one locked word in its correct position.
- Every remaining word from all five phrases is mixed into one communal **Slop Pile**.
- Tap a pool word, then a slot to place it; occupied slots and pool words can be swapped.
- Each lane has an optional ⭐1 clue.
- The player submits the whole board with **CHECK THE SLOP**.
- A failed submission reports only how many of the five phrases are correct; it does not reveal which ones and does not rearrange or penalise the board.
- All five phrases must be correct to complete the level.
- Quip is now an expressive character mascot with face, mouth, arms, cap and gesture poses rather than a generic slime blob.
