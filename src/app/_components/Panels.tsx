"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Stacking-slides scroll, adapted from GreenSock's "Slides Pinning" demo.
 * Each panel pins once its bottom meets the viewport, then scrubs a subtle
 * shrink + fade as the next panel slides up over it.
 *
 * Restraint vs. the demo: scale 0.92 / opacity 0.55 (not 0.7 / 0.5), no neon.
 * Desktop only (matchMedia ≥768px); mobile and reduced-motion get plain stacked
 * scroll. Panels marked `data-standalone` (the Showcase wipe) pin themselves and
 * are skipped here; the final panel (Contact) rests normally.
 */
export function Panels({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !root.current) return;
      // Synchronous guard: the `reduced` state is false on first render (SSR-safe),
      // so check the media query directly to avoid creating pins we'd immediately revert.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const panels = gsap.utils.toArray<HTMLElement>(root.current!.children);
        panels.pop(); // last panel rests as the final resting state

        panels.forEach((panel) => {
          if (panel.dataset.standalone !== undefined) return; // self-pinning section

          const inner =
            (panel.querySelector("[data-panel-inner]") as HTMLElement) ?? panel;
          const panelHeight = inner.offsetHeight;
          const windowHeight = window.innerHeight;
          const difference = panelHeight - windowHeight;

          // Portion of the scroll spent fake-scrolling tall content before the
          // shrink/fade, so the next panel still arrives at the right moment.
          const fakeScrollRatio =
            difference > 0 ? difference / (difference + windowHeight) : 0;

          if (fakeScrollRatio) {
            panel.style.marginBottom = panelHeight * fakeScrollRatio + "px";
          }

          const tl = gsap.timeline({
            scrollTrigger: {
              // id lets anchor links resolve a pinned section's real scroll
              // position via ScrollTrigger.getById (see SmoothScroll).
              id: panel.id || undefined,
              trigger: panel,
              start: "bottom bottom",
              end: () =>
                fakeScrollRatio ? `+=${inner.offsetHeight}` : "bottom top",
              pin: true,
              pinSpacing: false,
              scrub: true,
            },
          });

          if (fakeScrollRatio) {
            tl.to(inner, {
              yPercent: -100,
              y: windowHeight,
              duration: 1 / (1 - fakeScrollRatio) - 1,
              ease: "none",
            });
          }

          tl.fromTo(
            panel,
            { scale: 1, opacity: 1 },
            { scale: 0.92, opacity: 0.55, duration: 0.9, ease: "none" }
          ).to(panel, { opacity: 0, duration: 0.1 });
        });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [reduced] }
  );

  return <div ref={root}>{children}</div>;
}
