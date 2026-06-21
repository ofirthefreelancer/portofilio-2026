export type Project = {
  index: string;
  title: string;
  blurb: string;
  stack: string[];
  year: string;
  /** Optional link to the live work. When set, the card becomes a link. */
  href?: string;
  /** Optional in-card preview. Rests on the poster, plays the clip on hover. */
  preview?: { poster: string; video?: string; alt: string };
  /** Optional mascot/cutout that breaks the preview frame for life. */
  mascot?: string;
};

// Selected work. The stacking-cards UI reads from it directly.
export const projects: Project[] = [
  {
    index: "01",
    title: "Almond Whitening Studio",
    blurb:
      "Single-page site for a teeth-whitening studio in Canggu, Bali: a cinematic scan-to-smile hero, GSAP scroll storytelling, an animated tooth mascot swim, and WebGL accents.",
    stack: ["Next.js", "GSAP", "React Three Fiber", "WebGL"],
    year: "2026",
    href: "/templates/dental-spa",
    preview: {
      poster: "/templates/dentist/scan-to-smile-poster.jpg",
      video: "/templates/dentist/scan-to-smile.mp4",
      alt: "The scan-to-smile clip from the Almond Whitening Studio site",
    },
    mascot: "/templates/dentist/mascot/hero-tooth.png",
  },
];
