// Single source of truth for identity copy.
//
// HONESTY RULE: empty string / empty array fields render nothing. Fill them with
// real values only. No placeholder city, school, year, or award ships until it's
// true. Edit this one file to make the whole site accurate.

export const profile = {
  role: "Creative developer",
  // Honest and specific. No "experiences" / "crafting" / buzzwords.
  bio:
    "I build interactive web interfaces with React, GSAP, Three.js, and WebGL. " +
    "Motion that carries meaning and never blocks a click.",

  // Rendered as a label/value grid; only rows with a value appear.
  meta: [
    ["Since", ""], // e.g. "2017"
    ["Location", ""], // e.g. "Tel Aviv"
    ["Education", ""], // e.g. "BSc Computer Science"
    ["Status", "Available"],
  ] as [string, string][],

  // Add real recognitions only. Empty array -> the Recognition block is hidden.
  // Shape: { name: "Awwwards", note: "Honorable Mention" }
  awards: [] as { name: string; note: string }[],
};

// Seeded from the reference list; template-only tech (PHP / WordPress / Twig /
// Gulp / MySQL) dropped. Trim or confirm these to your real stack.
export const skillGroups: [string, string[]][] = [
  ["Creative", ["React", "GSAP", "Three.js", "WebGL", "Canvas", "Framer Motion", "Lenis", "Shader"]],
  ["Engineering", ["TypeScript", "Next.js", "Node.js", "Tailwind", "Figma"]],
];
