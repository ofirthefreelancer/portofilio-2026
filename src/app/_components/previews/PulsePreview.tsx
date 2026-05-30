"use client";

import { useEffect, useRef } from "react";
import { useInView } from "@/lib/useInView";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { INK, ACCENT, BG, DIM, BORDER, inkA } from "@/lib/tokens";

/**
 * Pulse — realtime collaborative dashboard. A live throughput sparkline that
 * streams right-to-left while two remote presence cursors drift across it.
 * Canvas 2D, DPR-aware, paused offscreen. Evokes presence + conflict-free sync.
 */
const PEERS = [
  { name: "maya", color: ACCENT, phase: 0 },
  { name: "dev", color: INK, phase: 2.3 },
];

export function PulsePreview() {
  const [wrapRef, inView] = useInView<HTMLDivElement>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SAMPLES = 48;
    const data: number[] = Array.from({ length: SAMPLES }, (_, i) =>
      0.5 + 0.32 * Math.sin(i * 0.5)
    );
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

    const chartTop = () => h * 0.32;
    const chartH = () => h * 0.5;

    const drawCursor = (x: number, y: number, color: string, name: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 13);
      ctx.lineTo(x + 3.6, y + 9.5);
      ctx.lineTo(x + 8.5, y + 9.2);
      ctx.closePath();
      ctx.fill();
      ctx.font = "600 10px ui-monospace, monospace";
      const tw = ctx.measureText(name).width;
      ctx.fillRect(x + 10, y + 2, tw + 10, 14);
      ctx.fillStyle = BG;
      ctx.fillText(name, x + 15, y + 12.5);
    };

    const render = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const top = chartTop();
      const ch = chartH();
      const stepX = w / (SAMPLES - 1);

      // baseline grid
      ctx.strokeStyle = BORDER;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, top + ch);
      ctx.lineTo(w, top + ch);
      ctx.stroke();

      // sparkline
      ctx.beginPath();
      for (let i = 0; i < SAMPLES; i++) {
        const x = i * stepX;
        const y = top + ch - data[i] * ch;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.8;
      ctx.stroke();
      // area fill
      ctx.lineTo(w, top + ch);
      ctx.lineTo(0, top + ch);
      ctx.closePath();
      ctx.fillStyle = inkA(0.06);
      ctx.fill();

      // last point marker
      const lx = (SAMPLES - 1) * stepX;
      const ly = top + ch - data[SAMPLES - 1] * ch;
      ctx.fillStyle = ACCENT;
      ctx.fillRect(lx - 2.5, ly - 2.5, 5, 5);

      // presence cursors drifting over the chart
      for (const p of PEERS) {
        const px = (0.5 + 0.42 * Math.sin(t * 0.0006 + p.phase)) * w;
        const py =
          top + ch * (0.25 + 0.5 * (0.5 + 0.5 * Math.cos(t * 0.0008 + p.phase)));
        drawCursor(px, py, p.color, p.name);
      }

      // label
      ctx.fillStyle = DIM;
      ctx.font = "11px ui-monospace, monospace";
      ctx.fillText("ops/sec", 4, 14);
    };

    let raf = 0;
    let acc = 0;
    let last = performance.now();

    if (reduced || !inView) {
      render(1200);
      return () => ro.disconnect();
    }

    const loop = (now: number) => {
      const dt = now - last;
      last = now;
      acc += dt;
      // push a new sample ~5x/sec
      if (acc > 200) {
        acc = 0;
        data.shift();
        const prev = data[data.length - 1];
        data.push(Math.max(0.08, Math.min(0.92, prev + (Math.random() - 0.5) * 0.4)));
      }
      render(now);
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
      <div className="pointer-events-none absolute right-4 top-3 flex items-center gap-1.5 font-mono text-[11px] text-dim">
        <span className="inline-block h-1.5 w-1.5 animate-pulse bg-accent" /> live · 2 peers
      </div>
    </div>
  );
}
