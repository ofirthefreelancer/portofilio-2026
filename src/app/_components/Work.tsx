"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, type PreviewId } from "@/lib/projects";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { NimbusPreview } from "./previews/NimbusPreview";
import { OrbitPreview } from "./previews/OrbitPreview";
import { ForgePreview } from "./previews/ForgePreview";
import { PulsePreview } from "./previews/PulsePreview";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PREVIEWS: Record<PreviewId, () => React.ReactNode> = {
  nimbus: NimbusPreview,
  orbit: OrbitPreview,
  forge: ForgePreview,
  pulse: PulsePreview,
};

export function Work() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const rows = gsap.utils.toArray<HTMLElement>("[data-proj]");
      rows.forEach((row) => {
        gsap.from(row, {
          opacity: 0,
          y: 48,
          duration: 0.7,
          ease: "expo.out",
          scrollTrigger: { trigger: row, start: "top 82%" },
        });
      });
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <section
      ref={root}
      id="work"
      className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mb-12 flex items-end justify-between border-b-2 border-ink pb-4">
        <h2 className="text-[clamp(34px,6vw,64px)] font-black tracking-[-0.04em]">
          Selected work
        </h2>
        <span className="font-mono text-[13px] text-dim">
          {projects.length} live · not screenshots
        </span>
      </div>

      {/* Editorial rows: each project a different visual world. The preview is
          the proof — a real, running frontend sample, not a static image. */}
      <div className="border-2 border-ink">
        {projects.map((p, i) => {
          const Preview = PREVIEWS[p.preview];
          const flip = i % 2 === 1; // alternate sides on desktop
          return (
            <article
              key={p.index}
              data-proj
              className={`grid items-stretch md:grid-cols-2 ${
                i < projects.length - 1 ? "border-b-2 border-ink" : ""
              }`}
            >
              {/* preview panel */}
              <div
                className={`relative h-[280px] border-b-2 border-ink sm:h-[340px] md:h-auto md:min-h-[340px] md:border-b-0 ${
                  flip
                    ? "md:order-2 md:border-l-2 md:border-ink"
                    : "md:order-1 md:border-r-2 md:border-ink"
                }`}
              >
                <Preview />
              </div>

              {/* text panel */}
              <div
                className={`flex flex-col justify-between gap-6 p-7 sm:p-9 md:p-10 ${
                  flip ? "md:order-1" : "md:order-2"
                }`}
              >
                <div className="flex items-baseline justify-between font-mono text-[12px] text-dim">
                  <span className="text-accent">{p.index}</span>
                  <span>{p.year}</span>
                </div>
                <div>
                  <h3 className="text-[clamp(24px,3.2vw,38px)] font-black tracking-[-0.03em]">
                    {p.title}
                  </h3>
                  <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-muted">
                    {p.blurb}
                  </p>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-4 font-mono text-[12px] font-medium text-accent">
                  {p.stack.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
