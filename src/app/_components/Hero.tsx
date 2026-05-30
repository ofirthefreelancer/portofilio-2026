"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Avatar } from "./Avatar";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) {
        gsap.set("[data-anim]", { opacity: 1, y: 0 });
        return;
      }
      gsap.from("[data-anim='line']", {
        yPercent: 110,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.09,
      });
      gsap.from("[data-anim='fade']", {
        opacity: 0,
        y: 18,
        duration: 0.8,
        ease: "expo.out",
        delay: 0.3,
        stagger: 0.1,
      });
      gsap.from("[data-anim='plate']", {
        opacity: 0,
        scale: 0.94,
        duration: 1,
        ease: "expo.out",
        delay: 0.25,
      });
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <section
      ref={root}
      className="mx-auto max-w-[1180px] px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24"
    >
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[1.5fr_1fr] md:gap-14">
        <div className="min-w-0">
          <div
            data-anim="fade"
            className="mb-7 font-mono text-[13px] tracking-[0.04em] text-accent"
          >
            FRONTEND ENGINEER — PORTFOLIO &rsquo;26
          </div>
          <h1 className="text-[clamp(52px,11vw,118px)] font-black leading-[0.86] tracking-[-0.05em]">
            <span className="block overflow-hidden">
              <span data-anim="line" className="block">Built to</span>
            </span>
            <span className="block overflow-hidden">
              <span data-anim="line" className="block text-accent">feel</span>
            </span>
            <span className="block overflow-hidden">
              <span data-anim="line" className="block">inevitable.</span>
            </span>
          </h1>
          <p
            data-anim="fade"
            className="mt-9 max-w-[58ch] text-[17px] leading-relaxed text-muted"
          >
            I build production AI SaaS with obsessive attention to the frame.
            Server-first React, real-time streams, motion that never blocks a
            click. The interface itself is the proof.
          </p>
          <div data-anim="fade" className="mt-9 flex flex-wrap gap-3">
            <a
              href="#work"
              className="bg-ink px-6 py-3 text-[15px] font-semibold text-bg press-hover"
            >
              View work →
            </a>
            <a
              href="#contact"
              className="border-2 border-ink px-6 py-3 text-[15px] font-semibold transition-colors hover:bg-ink hover:text-bg"
            >
              Get in touch
            </a>
          </div>
        </div>

        <div data-anim="plate" className="press-hover mx-auto w-full min-w-0 max-w-[320px] md:mx-0 md:max-w-none">
          <Avatar />
        </div>
      </div>
    </section>
  );
}
