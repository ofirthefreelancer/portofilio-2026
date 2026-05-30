// Design tokens mirrored for <canvas> / JS use. Source of truth is
// globals.css @theme; these stay in lockstep with it. OKLCH only.
export const INK = "oklch(0.19 0.012 40)";
export const ACCENT = "oklch(0.45 0.15 25)"; // oxblood
export const BG = "oklch(0.965 0.006 70)"; // paper
export const SURFACE = "oklch(0.99 0.004 70)";
export const MUTED = "oklch(0.42 0.014 45)";
export const DIM = "oklch(0.53 0.014 50)";
export const BORDER = "oklch(0.84 0.012 60)";

// ink/accent at an alpha, for canvas strokes.
export const inkA = (a: number) => `oklch(0.19 0.012 40 / ${a})`;
export const accentA = (a: number) => `oklch(0.45 0.15 25 / ${a})`;
