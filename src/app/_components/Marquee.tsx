"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Sharp counterpoint to the rounded sections: a full-bleed, ink-drenched band of
 * oversized Hanken Black type that runs as a scroll-velocity marquee. It drifts
 * at a base speed, then accelerates, reverses, and shears (skewX) with the
 * velocity of your scroll, easing back on expo when you stop. Square corners,
 * hard color edges against the light sections on either side. The capability
 * tokens are real (stack + the one human stance line in oxblood); petrol blades
 * keep the rhythm in the engineering ink. Reduced motion / no JS: a static,
 * fully legible row, no drift.
 */
const TOKENS: { t: string; human?: boolean }[] = [
  { t: "Interactive interfaces" },
  { t: "GSAP" },
  { t: "WebGL" },
  { t: "Three.js" },
  { t: "Motion that never blocks", human: true },
  { t: "React" },
  { t: "Shaders" },
  { t: "Sixty frames" },
];

/** One full pass of the token sequence. Rendered twice in the track so an
 *  xPercent shift of -50% loops seamlessly. The second pass is aria-hidden. */
function Run({ duplicate }: { duplicate?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={duplicate || undefined}>
      {TOKENS.map(({ t, human }, i) => (
        <span key={i} className="flex shrink-0 items-center">
          <span
            className={`px-[0.16em] text-[clamp(2.25rem,7vw,5.5rem)] font-black uppercase leading-none tracking-[-0.03em] ${
              human ? "text-accent-bright" : "text-bg"
            }`}
          >
            {t}
          </span>
          {/* sharp blade separator, engineering ink (bright petrol for legibility on ink) */}
          <span aria-hidden className="block size-[0.3em] rotate-45 bg-eng-line" />
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !track.current || !root.current) return;

      // base drift (one sequence = -50% of the doubled track)
      const loop = gsap.to(track.current, {
        xPercent: -50,
        duration: 26,
        ease: "none",
        repeat: -1,
      });
      const skewTo = gsap.quickTo(track.current, "skewX", {
        duration: 0.5,
        ease: "expo.out",
      });

      // target = direction * speed for the loop's timeScale; both target and the
      // skew settle back toward baseline every frame so the band calms when the
      // scroll stops (onUpdate only fires while scrolling).
      let target = 1;
      let skewTarget = 0;
      const tick = () => {
        const ts = loop.timeScale();
        loop.timeScale(ts + (target - ts) * 0.06);
        target += (Math.sign(target || 1) - target) * 0.04;
        skewTarget += (0 - skewTarget) * 0.06;
        skewTo(skewTarget);
      };
      gsap.ticker.add(tick);

      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity();
          const dir = v < 0 ? -1 : 1; // scroll up reverses the run
          target = dir * gsap.utils.clamp(1, 7, 1 + Math.abs(v) / 380);
          skewTarget = gsap.utils.clamp(-7, 7, -v / 1300);
        },
      });

      return () => {
        gsap.ticker.remove(tick);
        st.kill();
        loop.kill();
      };
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <section
      ref={root}
      data-standalone
      aria-label="What I build"
      className="select-none overflow-hidden bg-ink py-[clamp(2.25rem,5vw,4rem)]"
    >
      <div ref={track} className="flex w-max will-change-transform">
        <Run />
        <Run duplicate />
      </div>
    </section>
  );
}
