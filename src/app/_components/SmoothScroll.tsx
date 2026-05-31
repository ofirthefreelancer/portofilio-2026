"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Momentum scrolling (Lenis) bridged to GSAP's ticker so ScrollTrigger stays
 * perfectly in sync with pinned/scrubbed sections. Renders nothing.
 *
 * Skipped entirely under prefers-reduced-motion — the page falls back to the
 * browser's native scroll (and CSS smooth scroll re-enabled in that mode).
 */
export function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.05,
      // expo-out, matching the site's only easing curve
      easing: (t) => 1 - Math.pow(2, -10 * t),
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // In-page anchors must route through Lenis, otherwise native hash jumps
    // fight the smooth scroller and land wrong amid pinned panels.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement)?.closest?.(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;
      if (!link) return;
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      e.preventDefault();
      // Pinned sections move during scroll, so their live rect is wrong. If the
      // section owns a ScrollTrigger, jump to its start (section fully in view);
      // otherwise fall back to the element's document position.
      const st = ScrollTrigger.getById(id.slice(1));
      if (st) {
        lenis.scrollTo(st.start, { offset: 0 });
        return;
      }
      const target = document.querySelector(id);
      if (target) lenis.scrollTo(target as HTMLElement, { offset: -64 });
    };
    document.addEventListener("click", onClick);

    // Pins change document height; settle layout then recalc.
    const refresh = () => ScrollTrigger.refresh();
    const raf = requestAnimationFrame(refresh);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, [reduced]);

  return null;
}
