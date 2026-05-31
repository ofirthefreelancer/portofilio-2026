"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Hero portrait inside a square "press" frame. The image drifts slightly toward
 * the cursor; it's overscanned (scale 1.08) so the drift never reveals an edge.
 * Swap the avatar by changing the `src` (avatar1.png / avatar2.png in /public).
 */
export function Avatar() {
  const root = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !root.current || !mark.current) return;
      const el = root.current;
      const qx = gsap.quickTo(mark.current, "x", { duration: 0.6, ease: "power3.out" });
      const qy = gsap.quickTo(mark.current, "y", { duration: 0.6, ease: "power3.out" });
      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        qx(px * 12);
        qy(py * 12);
      };
      const onLeave = () => {
        qx(0);
        qy(0);
      };
      window.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      return () => {
        window.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <div
      ref={root}
      className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-full"
    >
      <div ref={mark} className="absolute inset-0 scale-[1.08]">
        <Image
          src="/avatar1.png"
          alt="Ofir Cohen"
          fill
          priority
          sizes="(max-width: 768px) 320px, 33vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
