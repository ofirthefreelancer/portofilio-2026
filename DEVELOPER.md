# Developer Context: Engineering Conventions

## Stack (verified)
- **Framework:** Next.js 16.2.6 (App Router).
- **Runtime:** React 19.2.4.
- **Language:** TypeScript 5 (strict).
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss`).
- **Motion:** GSAP 3.15 with `@gsap/react` (`useGSAP`).
- **Structure:** `src/` directory, `@/*` import alias.
- **Tooling:** ESLint 9 (`eslint-config-next`), npm.

## Architecture principles
1. **Server-first.** Default to React Server Components; reach for
   `"use client"` only where interactivity or browser APIs demand it
   (i.e. GSAP-driven components and interactive template UI).
2. **Colocation.** Keep route UI, loading/error states, and metadata inside
   their `app/` segment. Promote to shared `components/` only on second use.
3. **The templates ARE the product.** Each template ships as a
   self-contained, deploy-ready route. Clean code is the portfolio — assume
   visitors will read the source.

## Code standards
- Typed props on every component; no implicit `any`.
- Zero bloat. No dead boilerplate, unused deps, scaffold artifacts, or
  placeholder copy. Keep the bundle lightweight.
- Tailwind utilities over custom CSS; OKLCH design tokens (see DESIGN.md)
  over magic color values.
- Accessible by default: semantic elements, visible focus states, `alt`
  text, and `prefers-reduced-motion` support for all GSAP work.

## Performance budget
- Zero layout shift; prioritize LCP imagery with `next/image` + `priority`.
- Ship no client JS a Server Component could render. Isolate GSAP into the
  smallest possible client islands.
- Fast cold loads — friction reduction is law (see PRODUCT.md).
