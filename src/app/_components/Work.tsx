"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/projects";
import { useReducedMotion } from "@/lib/useReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Work() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from("[data-proj]", {
        opacity: 0,
        y: 50,
        duration: 0.7,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 78%" },
      });
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <section ref={root} id="work" className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 sm:py-28">
      <div className="mb-12 flex items-end justify-between border-b-2 border-ink pb-4">
        <h2 className="text-[clamp(34px,6vw,64px)] font-black tracking-[-0.04em]">
          Selected work
        </h2>
        <span className="font-mono text-[13px] text-dim">{projects.length} projects</span>
      </div>

      {/* press grid: shared 2px outer frame, hairline dividers */}
      <div className="grid border-2 border-ink sm:grid-cols-2">
        {projects.map((p, i) => (
          <article
            key={p.index}
            data-proj
            className={`flex flex-col gap-5 p-7 sm:p-9 ${
              i % 2 === 0 ? "sm:border-r-2 sm:border-ink" : ""
            } ${i < projects.length - (projects.length % 2 === 0 ? 2 : 1) ? "border-b-2 border-ink" : ""}`}
          >
            <div className="flex items-baseline justify-between font-mono text-[12px] text-dim">
              <span className="text-accent">{p.index}</span>
              <span>{p.year}</span>
            </div>
            <h3 className="text-[clamp(22px,3vw,30px)] font-bold tracking-[-0.025em]">
              {p.title}
            </h3>
            <p className="max-w-[44ch] text-[15px] leading-relaxed text-muted">{p.blurb}</p>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[12px] font-medium text-accent">
              {p.stack.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
