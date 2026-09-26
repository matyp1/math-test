# Quip intro — 26 September 2026

Added a 3.75-second opening scene using the existing canonical logo and Quip pose atlas. Quip hops in, inspects the tiles, flicks them into a pile and celebrates. Skip, start and replay work; the intro runs once per tab session. Reduced-motion preference shows the settled scene immediately. Puzzle and economy state are independent of the animation.

Verified in the managed browser: arrival, thinking and pointing poses, settled celebration; skip to title; replay; immediate start into tutorial; BITE placement survives reload; same-session reload does not replay the intro; all ten level entries remain available with sequential locks. Visually inspected 393×852 and 320×690. Corrected small-phone scene/text overlap. Screenshot: qa/quip-intro-mobile.jpg.

18 engine/campaign regression tests pass. Reduced-motion branch and cleanup checked using a Node assertion with a root that rejects animation access. Static production build succeeds.

The scene is a 2D animation of the existing pose assets, with no audio or newly generated character assets. Next milestone: observe first-time players completing Level 2 to tune difficulty and clarity.
