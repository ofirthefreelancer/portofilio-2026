"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Press-style avatar placeholder. Oxblood plate with a monogram that
 * shifts slightly toward the cursor — alive without a real likeness yet.
 *
 * To swap in your photo: drop a square image at /public/avatar.jpg and
 * replace the monogram block with
 * <Image src="/avatar.jpg" alt="Ofir Cohen" fill className="object-cover" />.
 */
export function Avatar() {
  const root = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLSpanElement>(null);
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
        qx(px * 18);
        qy(py * 18);
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
      aria-hidden="true"
      className="flex aspect-square w-full items-center justify-center overflow-hidden border-2 border-ink bg-accent"
    >
      <span
        ref={mark}
        className="select-none font-sans text-[clamp(64px,12vw,128px)] font-black leading-none tracking-[-0.05em] text-accent-ink"
      >
        OC
      </span>
    </div>
  );
}
