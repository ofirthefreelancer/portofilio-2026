"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { inkA, accentA } from "@/lib/tokens";

/**
 * Hero signature: a generative flow field of short ink strokes on paper.
 * Each stroke orients to a slowly-evolving field; near the cursor the field
 * bends toward the pointer and strokes flare oxblood. The piece IS a work
 * sample — bespoke canvas, DPR-aware, 60fps, full reduced-motion fallback.
 */
export function HeroCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0,
      h = 0,
      dpr = 1;
    const GAP = 26; // px between stroke origins
    let cols = 0,
      rows = 0;
    // pointer in css px, starts off-canvas
    const pointer = { x: -9999, y: -9999, has: false };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / GAP) + 1;
      rows = Math.ceil(h / GAP) + 1;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const field = (x: number, y: number, t: number) =>
      Math.sin(x * 0.012 + t) * 1.1 +
      Math.cos(y * 0.014 - t * 0.7) * 1.1 +
      Math.sin((x + y) * 0.008 + t * 0.5);

    const render = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const len = GAP * 0.62;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * GAP + GAP / 2;
          const y = j * GAP + GAP / 2;
          let angle = field(x, y, t);

          // pointer influence: bend toward cursor, flare accent within radius
          let hot = 0;
          if (pointer.has) {
            const dx = pointer.x - x;
            const dy = pointer.y - y;
            const d2 = dx * dx + dy * dy;
            const R = 130;
            if (d2 < R * R) {
              const d = Math.sqrt(d2) || 1;
              const infl = 1 - d / R;
              const target = Math.atan2(dy, dx);
              // rotate angle toward target by influence
              let diff = target - angle;
              diff = Math.atan2(Math.sin(diff), Math.cos(diff));
              angle += diff * infl * 0.9;
              hot = infl;
            }
          }

          const ca = Math.cos(angle);
          const sa = Math.sin(angle);
          ctx.beginPath();
          ctx.moveTo(x - ca * len * 0.5, y - sa * len * 0.5);
          ctx.lineTo(x + ca * len * 0.5, y + sa * len * 0.5);
          ctx.lineWidth = 1.1 + hot * 1.7;
          ctx.strokeStyle =
            hot > 0.02 ? accentA(0.4 + hot * 0.55) : inkA(0.42);
          ctx.stroke();
        }
      }
    };

    // pointer tracking (global, like the rest of the site's offset feel)
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.has =
        pointer.x >= -60 &&
        pointer.x <= w + 60 &&
        pointer.y >= -60 &&
        pointer.y <= h + 60;
    };
    const onLeave = () => {
      pointer.has = false;
    };

    if (reduced) {
      render(0.8);
      window.addEventListener("pointermove", onMove);
      const repaint = () => render(0.8);
      window.addEventListener("pointermove", repaint);
      return () => {
        ro.disconnect();
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointermove", repaint);
      };
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerout", onLeave);

    let raf = 0;
    const loop = (ms: number) => {
      render(ms * 0.00035);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onLeave);
    };
  }, [reduced]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="relative aspect-square w-full overflow-hidden border-2 border-ink bg-surface"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* monogram, set into the field as a deliberate mark */}
      <div className="pointer-events-none absolute inset-0 flex items-end justify-between p-4 font-mono text-[11px] text-dim">
        <span>flow field</span>
        <span className="text-accent">oc / &rsquo;26</span>
      </div>
    </div>
  );
}
