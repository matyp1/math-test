# Canonical production assets

## Quip character lock
`assets/quip/quip-atlas.webp` is one transparent 4×2 atlas. Left-to-right, top-to-bottom: neutral, point, explain, thinking, react, celebrate, success, empty. CSS background positioning uses one source so proportions and material remain consistent. It is not seven unrelated designs.

Identity: tall leaning rounded slime head, puddle base, glossy almost-black shadow to electric-lime highlight, bold outline, large white eyes and black pupils, coral tongue, black sideways cap with gold crown, matching slime hands. Reference: the approved **Neon Slime Game Tutorial Storyboard.png** and **Neon Slime Word Puzzle Interface.png**.

Production brief used with built-in image generation: create a transparent, evenly spaced seven-pose atlas; lock silhouette, face placement, cap, proportions, materials and highlights; neutral / point / explain / think / react / celebrate / success; no text, no UI, no background. Generated once as a cohesive atlas, then encoded as WebP for delivery. No runtime image generation.

## Logo
`assets/brand/word-slop-swap.webp` is the canonical production logo. Derived by a background-removal image edit of the approved **Glossy Word Slop Swap Badge.png**. The chunky black WORD, slop-to-mascot identity, swap underneath and cream enclosure are retained. This is a reference-derived raster cutout, not a claim of exact editable vector reconstruction.

The original repository SVGs remain for provenance and recoverability; live screens all use the canonical raster logo and atlas above.

## Typography
`assets/fonts/LilitaOne-Regular.ttf` is served locally for display headings, words and the check button. Source: Google Fonts repository, `ofl/lilitaone/LilitaOne-Regular.ttf`. The accompanying `OFL.txt` is included. Supporting text uses system sans-serif.

## Other assets
Base-hint icons are system emoji and can vary across operating systems. Locks are small functional SVG icons. Gradients, tile shadows, focus rings and glows are CSS. No external Figma asset URLs are used at runtime.

## Figma reference
https://www.figma.com/design/kj6MQuDa7lZpIwECnIslX6/WORD-slop-swap-Tutorial

Frames inspected: `1:5` (lift a word) and `1:74` (manual submit). The simple green mascot in those editable frames is a placeholder; the approved glossy reference governs the production character. The build preserves the tutorial sequence while enlarging readable controls and using the approved branding.
