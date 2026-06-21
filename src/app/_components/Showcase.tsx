"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * The 2nd -> 3rd transition: a curtain reveal. This section is pulled up to
 * overlap the tail of Work, so as you leave the last card the Showcase plate
 * wipes in from the right OVER the still-visible Work. The plate translates in
 * (xPercent 100 -> 0) while its content counter-translates (-100 -> 0), so the
 * reel is *uncovered in place* rather than sliding — the GreenSock before/after
 * mechanic, adapted into the Press system (ink frame, oxblood/teal, expo ease,
 * transform-only). Once the curtain lands, a blurred scrim wipes up and three
 * title screens cross-fade. Inside the frame, a live generative flow-field
 * (ReelCanvas) runs in the palette. Lenis smooths scroll globally.
 *
 * Reduced motion / no JS: no overlap, no wipe — the plate is in place, the frame
 * static, the first screen visible.
 *
 * SWAP IN A REAL REEL later: replace <ReelCanvas /> with a <video> if you want
 * actual footage in the growing frame.
 */
export function Showcase() {
  const root = useRef<HTMLElement>(null);
  const scrollC = useRef<HTMLDivElement>(null);
  const curtain = useRef<HTMLDivElement>(null);
  const curtainInner = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const titles = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!scrollC.current || !curtain.current || !overlay.current) return;

      if (reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(curtain.current, { xPercent: 0 });
        gsap.set(curtainInner.current, { xPercent: 0 });
        gsap.set(media.current, { scale: 1 });
        gsap.set(overlay.current, { clipPath: "inset(0% 0 0 0)" });
        // first screen shows; the other two stay hidden via their default class
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        scrollTrigger: {
          trigger: scrollC.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      const [t1, t2, t3] = Array.from(
        titles.current?.querySelectorAll<HTMLElement>(".reel-title") ?? []
      );

      const enter = { y: 32, opacity: 0, filter: "blur(8px)" };
      const settled = { y: 0, opacity: 1, filter: "blur(0px)" };
      const exit = { y: -32, opacity: 0, filter: "blur(8px)" };

      // curtain reveal: plate wipes in over Work, content uncovered in place
      tl.fromTo(curtain.current, { xPercent: 100 }, { xPercent: 0, duration: 0.55 }, 0)
        .fromTo(
          curtainInner.current,
          { xPercent: -100 },
          { xPercent: 0, duration: 0.55 },
          0
        )
        // settle the live frame as the curtain lands
        .fromTo(media.current, { scale: 1.12 }, { scale: 1, duration: 0.55 }, 0)
        // scrim wipes up so the titles can read over the reel
        .fromTo(
          overlay.current,
          { clipPath: "inset(100% 0 0 0)" },
          { clipPath: "inset(0% 0 0 0)", duration: 0.4 },
          0.45
        )
        // screen 1
        .fromTo(t1, enter, { ...settled, duration: 0.35 }, 0.6)
        // screen 1 -> 2
        .to(t1, { ...exit, duration: 0.3 }, 1.15)
        .fromTo(t2, enter, { ...settled, duration: 0.35 }, 1.22)
        // screen 2 -> 3
        .to(t2, { ...exit, duration: 0.3 }, 1.8)
        .fromTo(t3, enter, { ...settled, duration: 0.35 }, 1.87);
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <section ref={root} data-standalone className="relative z-[2]">
      <div
        ref={scrollC}
        className={
          reduced
            ? "relative min-h-screen bg-surface-2"
            : "relative h-[360vh] -mt-[22svh]"
        }
      >
        <div className="pointer-events-none sticky top-0 flex h-screen items-center justify-center overflow-hidden">
          {/* the curtain plate — surface-2 ground that wipes in over Work */}
          <div
            ref={curtain}
            className="pointer-events-auto absolute inset-0 flex items-center justify-center overflow-hidden bg-surface-2 px-gutter"
            style={{ willChange: "transform" }}
          >
            {/* content counter-translates so the reel is uncovered in place */}
            <div
              ref={curtainInner}
              className="flex w-[min(92vw,1200px)] flex-col gap-4"
              style={{ willChange: "transform" }}
            >
              {/* press meta header, uncovered in place with the frame */}
              <div className="flex items-baseline justify-between">
                <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-black leading-none tracking-[-0.03em]">
                  In motion
                </h2>
                <span className="font-mono text-label uppercase tracking-[0.12em] text-accent-2">
                  live
                </span>
              </div>

              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border-2 border-ink bg-ink will-change-transform">
                <div ref={media} className="absolute inset-0 will-change-transform">
                  <ReelCanvas reduced={reduced} />
                </div>

                <div
                  ref={overlay}
                  className="absolute inset-0 flex items-center justify-center bg-ink/50 px-gutter text-bg backdrop-blur-md [container-type:inline-size]"
                  style={{ clipPath: "inset(100% 0 0 0)" }}
                >
                  {/* three screens, stacked in one centered cell, swapped on scroll */}
                  <div ref={titles} className="grid place-items-center text-center">
                    <p className="reel-title col-start-1 row-start-1 whitespace-nowrap text-[7cqw] font-black leading-[0.9] tracking-[-0.04em]">
                      Built in the browser
                    </p>
                    <p className="reel-title col-start-1 row-start-1 whitespace-nowrap text-[7cqw] font-black leading-[0.9] tracking-[-0.04em] opacity-0">
                      Motion that never blocks
                    </p>
                    <p className="reel-title col-start-1 row-start-1 whitespace-nowrap text-[7cqw] font-black leading-[0.9] tracking-[-0.04em] opacity-0">
                      Light enough to read
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Live generative flow-field. Particles drift along a smooth vector field and
   leave fading trails, drawn in the site palette over the ink frame. Reduced
   motion renders a single settled frame (no rAF). Swap for a <video> for a real
   reel. Canvas colors are raster approximations of the OKLCH tokens. */
function ReelCanvas({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const INK = "rgb(33,29,26)"; // ~oklch(0.19 .012 40)
    const TEAL = "rgba(44,150,190,0.7)"; // ~oklch(0.48 .13 210)
    const OXBLOOD = "rgba(165,52,40,0.7)"; // ~oklch(0.45 .15 25)

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0,
      h = 0;
    const particles: { x: number; y: number }[] = [];

    const seed = () => {
      const target = Math.round((w * h) / 4200);
      particles.length = 0;
      for (let i = 0; i < target; i++) {
        particles.push({ x: Math.random() * w, y: Math.random() * h });
      }
    };
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = INK;
      ctx.fillRect(0, 0, w, h);
      seed();
    };
    resize();

    let t = 0;
    const field = (x: number, y: number) =>
      Math.cos(x * 0.0026 + t) * 1.6 + Math.sin(y * 0.0031 - t * 0.7) * 1.6;

    const step = () => {
      ctx.fillStyle = "rgba(33,29,26,0.045)"; // fade trails toward ink (slow = longer trails)
      ctx.fillRect(0, 0, w, h);
      ctx.lineWidth = 1.2;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const a = field(p.x, p.y);
        const nx = p.x + Math.cos(a) * 1.5;
        const ny = p.y + Math.sin(a) * 1.5;
        ctx.strokeStyle = i % 11 === 0 ? OXBLOOD : TEAL;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(nx, ny);
        ctx.stroke();
        p.x = nx;
        p.y = ny;
        if (p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
          p.x = Math.random() * w;
          p.y = Math.random() * h;
        }
      }
      t += 0.0009;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    if (reduced) {
      // settle into a single static composition, then stop
      for (let k = 0; k < 160; k++) step();
      return () => ro.disconnect();
    }

    let raf = 0;
    const loop = () => {
      step();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [reduced]);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}
