"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Scroll-scrubbed before/after wipe, adapted from GreenSock's "Image comparison
 * on scroll" demo: the section pins and the after-frame wipes across via nested
 * counter-translation (container slides one way, art the other, so the art reads
 * as stationary). Placeholder art is inline SVG in the site palette — swap for
 * real project screenshots later.
 *
 * Desktop pins + scrubs; mobile / reduced-motion show the finished frame.
 */
export function Showcase() {
  const root = useRef<HTMLElement>(null);
  const compare = useRef<HTMLDivElement>(null);
  const after = useRef<HTMLDivElement>(null);
  const afterArt = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!compare.current) return;

      // Reduced motion: skip the wipe, show the finished frame. Check the media
      // query directly too — `reduced` is false on the first (SSR-safe) render.
      if (reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set([after.current, afterArt.current], { xPercent: 0 });
        return;
      }

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: compare.current,
            start: "center center",
            // height of scroll == width, so wipe speed stays constant
            end: () => "+=" + (compare.current?.offsetWidth ?? 0),
            scrub: true,
            pin: true,
            anticipatePin: 1,
          },
          defaults: { ease: "none" },
        });
        tl.fromTo(after.current, { xPercent: 100, x: 0 }, { xPercent: 0 }).fromTo(
          afterArt.current,
          { xPercent: -100, x: 0 },
          { xPercent: 0 },
          0
        );
      });

      // No pin below the breakpoint — reveal the finished frame outright.
      mm.add("(max-width: 767px)", () => {
        gsap.set(after.current, { xPercent: 0 });
        gsap.set(afterArt.current, { xPercent: 0 });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <section
      ref={root}
      data-standalone
      className="flex min-h-screen items-center bg-surface-2"
    >
      <div className="mx-auto w-full max-w-[1180px] px-gutter">
        <div className="mb-8 flex items-end justify-between border-b-2 border-ink pb-4">
          <h2 className="text-subtitle font-black">
            Wireframe <span className="text-accent-2">→ shipped</span>
          </h2>
          <span className="font-mono text-label text-accent-2">scroll to reveal</span>
        </div>

        {/* comparison frame — 16:9, pinned + wiped on desktop */}
        <div
          ref={compare}
          className="relative w-full overflow-hidden border-2 border-ink"
          style={{ paddingBottom: "56.25%" }}
        >
          <BeforeArt />
          {/* after frame: translated fully right, art counter-translated left */}
          <div
            ref={after}
            className="absolute inset-0 overflow-hidden"
            style={{ transform: "translateX(100%)" }}
          >
            <div ref={afterArt} className="absolute inset-0" style={{ transform: "translateX(-100%)" }}>
              <AfterArt />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- placeholder art (inline SVG, palette-correct, zero asset requests) ---- */

function BeforeArt() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 180"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      <rect width="320" height="180" fill="var(--color-surface)" />
      {/* hairline grid */}
      <g stroke="var(--color-border)" strokeWidth="0.5">
        {Array.from({ length: 15 }, (_, i) => (
          <line key={`v${i}`} x1={(i + 1) * 20} y1="0" x2={(i + 1) * 20} y2="180" />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={(i + 1) * 20} x2="320" y2={(i + 1) * 20} />
        ))}
      </g>
      {/* wireframe blocks (outlined, no fill) */}
      <g stroke="var(--color-ink)" strokeWidth="1.2" fill="none">
        <rect x="20" y="22" width="120" height="14" />
        <rect x="20" y="48" width="180" height="8" />
        <rect x="20" y="62" width="150" height="8" />
        <rect x="20" y="92" width="80" height="64" />
        <rect x="112" y="92" width="80" height="64" />
        <rect x="204" y="92" width="96" height="64" />
      </g>
      <text x="20" y="172" fontFamily="monospace" fontSize="7" fill="var(--color-dim)">
        01 — WIREFRAME
      </text>
    </svg>
  );
}

function AfterArt() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 180"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      <rect width="320" height="180" fill="var(--color-ink)" />
      <rect x="20" y="22" width="120" height="14" fill="var(--color-accent-2)" />
      <rect x="20" y="48" width="180" height="6" fill="var(--color-surface)" opacity="0.85" />
      <rect x="20" y="60" width="150" height="6" fill="var(--color-surface)" opacity="0.55" />
      <rect x="20" y="92" width="80" height="64" fill="var(--color-surface)" opacity="0.12" />
      <rect x="112" y="92" width="80" height="64" fill="var(--color-surface)" opacity="0.2" />
      <rect x="204" y="92" width="96" height="64" fill="var(--color-accent-2)" opacity="0.85" />
      <text x="20" y="172" fontFamily="monospace" fontSize="7" fill="var(--color-surface)">
        01 — SHIPPED
      </text>
    </svg>
  );
}
