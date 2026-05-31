"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { projects } from "@/lib/projects";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Selected work as a horizontal-scrolling gallery, adapted from GreenSock's
 * "Horizontal scrolling gallery" demo. The section pins and the card strip
 * translates left as you scroll down (scrub). Editorial text cards, not images.
 *
 * Self-pinning (data-standalone) so Panels skips its vertical stack. Desktop
 * only; mobile / reduced-motion fall back to a normal vertical list.
 */
export function Work() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!pin.current || !strip.current) return;
      if (reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const el = strip.current!;
        let scrollLen = 0;
        const refresh = () => {
          scrollLen = el.scrollWidth - window.innerWidth;
        };
        refresh();

        const tween = gsap.to(el, {
          x: () => -scrollLen,
          ease: "none",
          scrollTrigger: {
            id: "work",
            // Pin an INNER wrapper, never the section root: ScrollTrigger
            // reparents pinned nodes into a .pin-spacer, which would corrupt
            // React's reconciliation of the <Panels> children (removeChild crash).
            trigger: pin.current,
            pin: pin.current,
            scrub: true,
            start: "center center",
            end: () => "+=" + scrollLen,
            invalidateOnRefresh: true,
          },
        });

        ScrollTrigger.addEventListener("refreshInit", refresh);
        return () => {
          ScrollTrigger.removeEventListener("refreshInit", refresh);
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <section ref={root} id="work" data-standalone className="bg-surface">
      {/* Horizontal classes only when motion is allowed; reduced-motion falls
          back to an accessible vertical stack (same as mobile). */}
      <div
        ref={pin}
        className={`relative ${reduced ? "" : "md:flex md:h-screen md:items-center md:overflow-hidden"}`}
      >
        <div
          ref={strip}
          className={`flex flex-col gap-6 px-5 py-20 sm:px-8 ${
            reduced
              ? ""
              : "md:h-full md:flex-row md:flex-nowrap md:items-center md:gap-[3vw] md:px-[6vw] md:py-0 md:will-change-transform"
          }`}
        >
        {/* intro slide / heading */}
        <div
          className={`flex shrink-0 flex-col justify-center ${
            reduced ? "" : "md:h-full md:w-[40vw] md:pr-[4vw]"
          }`}
        >
          <h2 className="text-title font-black">
            Selected work
          </h2>
          <span className="mt-4 font-mono text-label text-dim">
            {projects.length} projects, scroll{" "}
            <span className="text-accent">→</span>
          </span>
        </div>

        {projects.map((p) => (
          <article
            key={p.index}
            className={`flex shrink-0 flex-col justify-center gap-5 border-2 border-ink bg-bg p-7 sm:p-9 ${
              reduced ? "" : "md:h-[64vh] md:w-[clamp(340px,40vw,560px)]"
            }`}
          >
            <div className="flex items-baseline justify-between font-mono text-label tabular-nums text-dim">
              <span className="text-accent">{p.index}</span>
              <span>{p.year}</span>
            </div>
            <h3 className="text-h3 font-bold">
              {p.title}
            </h3>
            <p className="max-w-[42ch] text-body text-muted">
              {p.blurb}
            </p>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 font-mono text-label font-medium text-accent">
              {p.stack.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </article>
        ))}
        </div>
      </div>
    </section>
  );
}
