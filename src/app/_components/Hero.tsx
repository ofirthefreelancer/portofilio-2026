"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Avatar } from "./Avatar";
import { profile } from "@/lib/profile";
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
    <section ref={root} className="flex min-h-screen items-center bg-bg">
      <div
        data-panel-inner
        className="mx-auto w-full max-w-[1180px] px-gutter py-section"
      >
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[1.5fr_1fr] md:gap-14">
        <div className="min-w-0">
          <h1 className="text-display font-black">
            <span className="block overflow-hidden">
              <span data-anim="line" className="block">Creative</span>
            </span>
            <span className="block overflow-hidden">
              <span data-anim="line" className="block text-accent">developer.</span>
            </span>
          </h1>
          <p
            data-anim="fade"
            className="mt-9 max-w-[58ch] text-lead text-muted"
          >
            {profile.bio}
          </p>
          <div data-anim="fade" className="mt-6 flex flex-wrap gap-3">
            <a
              href="#work"
              className="bg-accent px-6 py-3 text-body font-semibold text-accent-ink press-hover-ink"
            >
              View work →
            </a>
            <a
              href="#contact"
              className="border-2 border-ink px-6 py-3 text-body font-semibold transition-colors hover:bg-ink hover:text-bg"
            >
              Get in touch
            </a>
          </div>
        </div>

          <div data-anim="plate" className="mx-auto w-full min-w-0 max-w-[320px] md:mx-0 md:max-w-none">
            <Avatar />
          </div>
        </div>
      </div>
    </section>
  );
}
