"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/lib/useInView";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Forge — visual schema builder with live codegen. Three model nodes wired
 * together; the generated TypeScript types cycle as if the graph just
 * changed. SVG graph + a typed readout. Square press boxes, no rounded UI.
 */
const NODES = [
  { id: "User", x: 16, y: 20, fields: ["id", "email", "posts[]"] },
  { id: "Post", x: 150, y: 14, fields: ["id", "title", "author"] },
  { id: "Tag", x: 150, y: 104, fields: ["id", "label"] },
];
const EDGES = [
  [0, 1],
  [1, 2],
];
const NW = 96;
const NH = 62;

const CODEGEN = [
  "type User = { id: ID; email: string }",
  "type Post = { id: ID; title: string }",
  "type Tag  = { id: ID; label: string }",
];

function center(i: number) {
  return { x: NODES[i].x + NW / 2, y: NODES[i].y + NH / 2 };
}

export function ForgePreview() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const reduced = useReducedMotion();
  const [line, setLine] = useState(0);

  useEffect(() => {
    if (reduced || !inView) return;
    const id = setInterval(() => setLine((l) => (l + 1) % CODEGEN.length), 1500);
    return () => clearInterval(id);
  }, [inView, reduced]);

  return (
    <div ref={ref} className="flex h-full w-full flex-col bg-surface">
      <svg
        viewBox="0 0 260 180"
        className="w-full flex-1"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        {EDGES.map(([a, b], i) => {
          const p1 = center(a);
          const p2 = center(b);
          return (
            <line
              key={i}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="var(--color-ink)"
              strokeWidth={1.5}
            />
          );
        })}
        {NODES.map((n, i) => {
          const active = !reduced && inView && i === line;
          return (
            <g key={n.id}>
              <rect
                x={n.x}
                y={n.y}
                width={NW}
                height={NH}
                fill={active ? "var(--color-accent)" : "var(--color-bg)"}
                stroke="var(--color-ink)"
                strokeWidth={2}
                style={{ transition: "fill 0.3s cubic-bezier(0.16,1,0.3,1)" }}
              />
              <text
                x={n.x + 9}
                y={n.y + 17}
                fontFamily="var(--font-mono)"
                fontSize="11"
                fontWeight="700"
                fill={active ? "var(--color-accent-ink)" : "var(--color-ink)"}
              >
                {n.id}
              </text>
              {n.fields.map((f, fi) => (
                <text
                  key={f}
                  x={n.x + 9}
                  y={n.y + 33 + fi * 11}
                  fontFamily="var(--font-mono)"
                  fontSize="8.5"
                  fill={active ? "var(--color-accent-ink)" : "var(--color-dim)"}
                >
                  {f}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
      <div className="border-t border-border px-4 py-2 font-mono text-[11px] text-muted">
        <span className="text-accent">▸</span> {CODEGEN[line]}
      </div>
    </div>
  );
}
