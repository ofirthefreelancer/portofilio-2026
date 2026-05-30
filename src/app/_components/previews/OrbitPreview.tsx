"use client";

import { useEffect, useRef } from "react";
import { useInView } from "@/lib/useInView";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { inkA, accentA } from "@/lib/tokens";

/**
 * Orbit — high-throughput WebGL-style scatter. A live point cloud rotating
 * in faux-3D at a locked frame budget. Canvas 2D, DPR-aware, paused when
 * offscreen. Evidence of comfort with dense realtime rendering.
 */
const N = 720;

export function OrbitPreview() {
  const [wrapRef, inView] = useInView<HTMLDivElement>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pts = Array.from({ length: N }, () => {
      // points on a tilted disc + a little vertical spread
      const r = Math.sqrt(Math.random()) * 1;
      const a = Math.random() * Math.PI * 2;
      return {
        x: Math.cos(a) * r,
        y: (Math.random() - 0.5) * 0.5,
        z: Math.sin(a) * r,
        hot: Math.random() < 0.12,
      };
    });

    let raf = 0;
    let w = 0,
      h = 0,
      dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const TILT = 0.42;
    const render = (rot: number) => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const scale = Math.min(w, h) * 0.42;
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      for (let i = 0; i < N; i++) {
        const p = pts[i];
        const x = p.x * cos - p.z * sin;
        const z = p.x * sin + p.z * cos;
        const y = p.y * Math.cos(TILT) - z * Math.sin(TILT);
        const depth = (z + 1.4) / 2.8; // 0..1, back..front
        const sx = cx + x * scale;
        const sy = cy + y * scale;
        const size = 0.6 + depth * 1.9;
        ctx.fillStyle = p.hot
          ? accentA(0.35 + depth * 0.6)
          : inkA(0.12 + depth * 0.5);
        ctx.fillRect(sx - size / 2, sy - size / 2, size, size);
      }
    };

    if (reduced || !inView) {
      resize();
      render(0.6);
      return () => {
        ro.disconnect();
      };
    }

    let rot = 0;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      rot += dt * 0.32;
      render(rot);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [inView, reduced, wrapRef]);

  return (
    <div ref={wrapRef} className="relative h-full w-full bg-surface">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute bottom-3 left-4 font-mono text-[11px] text-dim">
        1,000,000 pts · <span className="text-accent">60 fps</span>
      </div>
    </div>
  );
}
