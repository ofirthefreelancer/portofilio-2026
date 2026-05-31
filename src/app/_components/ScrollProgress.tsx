"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Scroll signature, adapted from GreenSock's "Scrub" demo: a hairline accent
 * rail whose fill is scrubbed by scroll, plus a mono progress readout with a
 * caret that flips with scroll direction. Restrained — the accent stays a thin
 * line, well under the ≤10% weight budget.
 */
export function ScrollProgress() {
  const rail = useRef<HTMLDivElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const caret = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !rail.current) return;

      gsap.set(rail.current, { scaleX: 0, transformOrigin: "left center" });

      gsap.to(rail.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: true },
      });

      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          if (pct.current) {
            pct.current.textContent = String(Math.round(self.progress * 100)).padStart(
              2,
              "0"
            );
          }
          if (
            caret.current &&
            self.direction !== (self as unknown as { _dir?: number })._dir
          ) {
            gsap.to(caret.current, {
              rotation: self.direction === 1 ? 0 : 180,
              duration: 0.2,
              ease: "expo.out",
            });
            (self as unknown as { _dir?: number })._dir = self.direction;
          }
        },
      });

      return () => st.kill();
    },
    { scope: rail, dependencies: [reduced] }
  );

  if (reduced) return null;

  return (
    <>
      {/* fill rail, pinned just under the sticky header's bottom border */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-16 z-50 h-px"
      >
        <div ref={rail} className="h-full w-full bg-accent" />
      </div>

      {/* mono readout, lower-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-5 right-5 z-50 hidden items-center gap-2 font-mono text-[12px] text-dim sm:flex"
      >
        <span ref={pct}>00</span>
        <span>/ 100</span>
        <svg
          ref={caret}
          width="9"
          height="10"
          viewBox="0 0 10 11"
          fill="none"
          className="text-accent"
        >
          <path
            fill="currentColor"
            d="M4.055 0v7.71l-3-3L0 5.79l4.805 4.804 4.804-4.805-1.054-1.078-3 3V0h-1.5Z"
          />
        </svg>
      </div>
    </>
  );
}
