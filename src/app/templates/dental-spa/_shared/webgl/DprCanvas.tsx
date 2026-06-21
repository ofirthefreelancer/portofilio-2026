"use client";

import { Canvas, type RenderProps } from "@react-three/fiber";
import { useEffect, useRef, useState, type ReactNode } from "react";

// When a client can't create a GL context, three rejects asynchronously — not
// catchable by an error boundary. The accent is decorative and already has a
// static fallback, so we quietly absorb that one rejection (real GPU browsers
// never hit it). This file is client-only + dynamically imported, so it loads
// before any <Canvas> mounts; register at module load to win the race.
if (typeof window !== "undefined") {
  window.addEventListener("unhandledrejection", (e) => {
    const msg = String((e.reason as Error)?.message ?? e.reason ?? "");
    if (/webgl context|creating webgl/i.test(msg)) e.preventDefault();
  });
}

// Shared <Canvas> wrapper. Transparent, click-through, dpr-capped, and — the
// perf win — only runs its render loop while it's actually on screen. Off
// screen it drops to "never" so the transmission shader / instanced grid stop
// burning frames behind you.
export function DprCanvas({
  children,
  reduced = false,
  camera,
  className,
}: {
  children: ReactNode;
  reduced?: boolean;
  camera?: RenderProps<HTMLCanvasElement>["camera"];
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin: "120px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Reduced motion → paint one frame then idle. Otherwise run only while visible.
  const frameloop = reduced ? "demand" : onScreen ? "always" : "never";

  return (
    <div ref={wrap} className={`h-full w-full ${className ?? ""}`}>
      <Canvas
        style={{ pointerEvents: "none" }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={frameloop}
        camera={camera ?? { position: [0, 0, 6], fov: 42 }}
      >
        {children}
      </Canvas>
    </div>
  );
}
