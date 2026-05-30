"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skills } from "@/lib/projects";
import { useReducedMotion } from "@/lib/useReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

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
    <section ref={root} id="about" className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 sm:py-28">
      <div className="grid gap-12 md:grid-cols-2 md:gap-20">
        <p
          data-about
          className="max-w-[17ch] text-[clamp(30px,4.5vw,52px)] font-black leading-[1.05] tracking-[-0.035em]"
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
              className="flex justify-between border-t border-border py-4 font-mono text-[14px]"
            >
              <dt className="text-dim">{k}</dt>
              <dd className="font-medium text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
