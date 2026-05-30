# This is NOT the Next.js you know

This is Next.js 16 with React 19. APIs, conventions, and file structure may
differ from training data. Read the relevant guide in
`node_modules/next/dist/docs/` before writing framework code. Heed
deprecation notices.

# AI Agent Instructions: Intent + Impeccable Architecture

Evaluate every code generation against these guardrails.
See also: [PRODUCT.md](PRODUCT.md), [DESIGN.md](DESIGN.md), [DEVELOPER.md](DEVELOPER.md).

## 1. UX WITH INTENT (Strategic logic)
- **Core strategy:** The site itself IS the portfolio piece. Its motion,
  feel, and engineering are the evidence of craft — not screenshots, not copy.
- **Not selling.** No lead-gen funnel, no "hire me" pressure, no conversion
  goal. Contact is a quiet footer. The experience is the point.
- **Behavior goal:** A visitor *feels* the quality in seconds. Alive, not
  loud — technically extraordinary motion that signals senior taste.
- **Templates are secondary** — a single header link (`/templates`), never
  competing with the portfolio.
- **Copy law:** Zero fluff or marketing jargon. Technical, high-precision
  developer copy.
- **Ethics:** Informative, never persuasive. Nothing to convert, nothing to
  manipulate.

## 2. IMPECCABLE UI (Design execution)
- **Color:** OKLCH only. Absolute ban on pure `#000`/`#fff`. Tinted dark
  neutrals (low chroma, brand hue). Exactly one accent, ≤10% visual weight.
- **Layout:** Vary section heights and layouts for rhythm. Ban identical
  card grids and side-stripe borders.
- **Typography:** Cap measure at 65–75ch (`max-w-3xl`). Hierarchy ratio
  ≥1.25. No gradient text, no heavy glassmorphism.
- **Components:** No generic off-the-shelf UI. Build bespoke — the interface
  is itself a work sample.
- **Motion:** GSAP, ease-out-expo only. Micro ≤0.2s, structural ≤0.4s.
  Never block interaction. Respect `prefers-reduced-motion`.

## 3. ENGINEERING (Non-negotiable)
- Server-first RSC; `"use client"` only for GSAP/interactive islands.
- TypeScript strict, typed props, no implicit `any`.
- Lightweight, zero bloat. Clean source — visitors will read it.
- Zero layout shift; no client JS an RSC could render.
