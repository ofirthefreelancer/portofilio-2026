export type PreviewId = "nimbus" | "orbit" | "forge" | "pulse";

export type Project = {
  index: string;
  title: string;
  blurb: string;
  stack: string[];
  year: string;
  preview: PreviewId;
};

// Placeholder work — swap for real projects in one place. Each entry drives a
// live in-browser preview (the proof), keyed by `preview`.
export const projects: Project[] = [
  {
    index: "01",
    title: "Nimbus — AI Copilot",
    blurb:
      "Streaming support assistant over a 40k-document knowledge base. Sub-100ms first token, fully optimistic UI, zero layout shift end-to-end.",
    stack: ["Next 16", "RSC", "Edge streaming"],
    year: "2026",
    preview: "nimbus",
  },
  {
    index: "02",
    title: "Orbit Analytics",
    blurb:
      "WebGL charts rendering one million data points at a locked 60fps, with smooth pan and zoom on commodity hardware.",
    stack: ["WebGL", "D3"],
    year: "2025",
    preview: "orbit",
  },
  {
    index: "03",
    title: "Forge",
    blurb:
      "Visual schema builder with live TypeScript codegen. Drag to define a data model, get typed clients instantly.",
    stack: ["AST", "Drag & drop"],
    year: "2025",
    preview: "forge",
  },
  {
    index: "04",
    title: "Pulse — Realtime Dashboard",
    blurb:
      "Collaborative ops dashboard with live presence, optimistic mutations, and conflict-free sync across clients.",
    stack: ["CRDT", "WebSocket", "Suspense"],
    year: "2024",
    preview: "pulse",
  },
];

export const skills: [string, string][] = [
  ["Framework", "Next 16 · React 19"],
  ["Language", "TypeScript (strict)"],
  ["Motion", "GSAP · WebGL"],
  ["Styling", "Tailwind v4 · OKLCH"],
  ["Care about", "perf · feel · craft"],
];
