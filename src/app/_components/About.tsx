"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { skills } from "@/lib/projects";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function About() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from("[data-about]", {
        opacity: 0,
        y: 36,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.07,
        scrollTrigger: { trigger: root.current, start: "top 74%" },
      });
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <section ref={root} id="about" className="flex min-h-screen items-center bg-bg">
      <div
        data-panel-inner
        className="mx-auto w-full max-w-[1180px] px-gutter py-section"
      >
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
        <p
          data-about
          className="max-w-[17ch] text-subtitle font-black"
        >
          I make interfaces that feel{" "}
          <span className="text-accent">inevitable</span>, and I never drop a
          frame doing it.
        </p>
        <dl className="self-end">
          {skills.map(([k, v]) => (
            <div
              key={k}
              data-about
              className="flex justify-between border-t border-border py-4 font-mono text-label"
            >
              <dt className="text-dim">{k}</dt>
              <dd className="font-medium text-accent-2">{v}</dd>
            </div>
          ))}
        </dl>
        </div>
      </div>
    </section>
  );
}
