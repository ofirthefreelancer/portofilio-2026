// One muted-clinical-blue brand, light-dominant. The shared section components
// read this SpaTheme to skin themselves; scoped CSS vars (.spa-light in
// globals.css) carry the actual colors.

export type SpaTheme = {
  key: "light";
  /** scope class applied to the page root (drives the CSS token block) */
  scopeClass: string;
  /** short human label for the footer + nav */
  label: string;
  tagline: string;
  /** hero copy */
  hero: { eyebrow: string; headline: string; sub: string };
  /** GSAP feel: structural transition seconds + float amplitude (px) */
  motion: { structural: number; floatAmp: number };
  /** which mascot clip leads the celebration */
  mascotHeroClip: "cheer" | "brush";
  /** three.js colors (hex) for the abstract WebGL "technology pop" */
  webgl: { glass: string; particle: string; grid: string; bg: string | null };
};

export const THEME: SpaTheme = {
  key: "light",
  scopeClass: "spa-light",
  label: "Whitening Studio",
  tagline: "Luminous, precise, weightless.",
  hero: {
    eyebrow: "Teeth whitening",
    headline: "Whitening that feels like daylight.",
    sub: "A calm whitening studio in Canggu. Low-sensitivity gel under cool light, with a shade reading before and after so the result is never a guess.",
  },
  motion: { structural: 0.4, floatAmp: 14 },
  mascotHeroClip: "cheer",
  webgl: { glass: "#DAEAF1", particle: "#6F96D1", grid: "#6F96D1", bg: null },
};

// ---- Content shared across all three variants -----------------------------

export const PHILOSOPHY = [
  {
    tag: "01",
    title: "Shade reading first",
    body: "We measure your starting shade against a guide and photograph it. The before is on record, so the lift is a number you can see.",
  },
  {
    tag: "02",
    title: "Low-sensitivity gel",
    body: "A buffered, low-peroxide gel under cool light. Brightness without the zing most people brace for.",
  },
  {
    tag: "03",
    title: "Result you can keep",
    body: "Trays cast from your scan and a top-up gel go home with you, so the shade holds long after the session.",
  },
];

export type Service = {
  name: string;
  duration: string;
  body: string;
  pose: 1 | 2 | 3; // mascot pose that accompanies this service in §4
};

export const SERVICES: Service[] = [
  {
    name: "Express session",
    duration: "30 min",
    body: "One cool-light pass for an event next week. A few shades up on a lunch break, no take-home needed.",
    pose: 1,
  },
  {
    name: "Signature whitening",
    duration: "60 min",
    body: "Three gel passes under cool light, shade-matched start and finish. The deepest lift we do in one sitting.",
    pose: 2,
  },
  {
    name: "Take-home trays",
    duration: "Custom",
    body: "Trays cast from your scan with a low-strength gel, for a gradual lift and touch-ups between studio visits.",
    pose: 3,
  },
];

export const DIAGNOSTICS = {
  before: { label: "Shade today", note: "Measured against the guide, before the first pass" },
  after: { label: "Shade after", note: "Same visit, natural finish" },
};

export const BOOKING = {
  heading: "Book a whitening session",
  sub: "Tell us when works. We confirm within the hour during studio hours.",
  hours: [
    ["Mon – Thu", "8:00 – 18:00"],
    ["Friday", "8:00 – 14:00"],
    ["Weekend", "By arrangement"],
  ] as [string, string][],
  location: "Jl. Yalan Yalan 46, Batu Bolong, Canggu, Bali 40564",
};
