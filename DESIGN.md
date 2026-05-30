# Design System Standards

Bound to the Impeccable design laws. These are constraints, not suggestions.

## Chosen direction — "Press" (light, editorial)
A light, confident, printed editorial language. The site reads like a
well-set press masthead, not a soft SaaS template.

- **Theme:** LIGHT. Warm restrained paper background — warmth carried by the
  accent and ink, NOT by a cream/beige body (that warm near-white is the
  saturated AI default and is banned here).
- **Accent:** oxblood red, `oklch(0.45 0.15 25)` — the single accent.
- **Neutrals (OKLCH):**
  - bg `oklch(0.965 0.006 70)` · surface `oklch(0.99 0.004 70)`
  - border `oklch(0.84 0.012 60)` · ink/fg `oklch(0.19 0.012 40)`
  - muted `oklch(0.42 0.014 45)` · dim `oklch(0.53 0.014 50)` (AA 4.79:1 on bg)
- **Type:** Hanken Grotesk (display, up to 900) + Geist Mono (labels,
  metadata, readouts). Heavy display weight is the voice.
- **Structure:** hard rules (2–3px ink borders), SQUARE corners (radius 0),
  press-grid dividers. No soft rounded SaaS cards.
- **Signature motion:** offset hover — element shifts up/left with a solid
  colored (oxblood or ink) drop shadow appearing. Scroll-reveal stagger on
  work. Kinetic hero entrance. All expo ease-out.
- Tokens live in `src/app/globals.css` under `@theme`.

## Color — OKLCH only
- **OKLCH exclusively.** Every color in `oklch()`. No hex, no `rgb()`.
- **No pure black or white.** Ink is `oklch(0.19 …)`, not `#000`; paper is
  `oklch(0.965 …)`, not `#fff`.
- **One accent.** Oxblood only, ≤10% of visual weight, for the primary
  action and key emphasis.

## Layout
- **Press structure over soft cards.** Hard rules and shared-border grids.
  Square corners. Absolute ban on identical rounded card grids and
  side-stripe borders.
- **Rhythm over uniformity.** Vary section weight and spacing.
- **No numbered section eyebrows.** `01 / 02 / 03` above every section is
  banned scaffolding; section labels earn their place or are dropped.

## Typography
- **Line length.** Cap body measure at 65–75ch for readability.
- **Hierarchy ratio ≥1.25** between steps; lean on Hanken's heavy weights.
- **No tacky effects.** No gradient text, no glassmorphism, no all-caps body.

## Components
- **No generic UI.** Build bespoke components. No off-the-shelf component-kit
  look. The interface itself is a sample of the work.

## Motion — GSAP
- **Curve:** Exponential ease-out only (`power4.out` / `expo.out`). Never
  elastic or bouncy for structural elements.
- **Duration:** Micro-interactions (hover, button fill) ≤0.2s. Structural
  transitions (cards in, terminal typing) ≤0.4s.
- **Never block interaction.** Buttons are clickable instantly, even mid
  intro animation. Animation never gates the user's ability to act.
- **ScrollTrigger sparingly.** Only to fade in heavy code snippets or
  template components as they enter the viewport. No decorative scroll FX.
- **Respect `prefers-reduced-motion`.** Provide a reduced/!no-motion path.
