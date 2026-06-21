"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { profile, skillGroups } from "@/lib/profile";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function About() {
  const root = useRef<HTMLElement>(null);
  const compare = useRef<HTMLDivElement>(null);
  const before = useRef<HTMLDivElement>(null);
  const after = useRef<HTMLDivElement>(null);
  const afterInner = useRef<HTMLDivElement>(null);
  const motionWord = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  // Self-referential delight: the word "motion" performs a quick expo wave when
  // you hover or tap it. A motion developer's portfolio where the word moves.
  const waveMotion = () => {
    if (reduced || !motionWord.current) return;
    gsap.to(motionWord.current.querySelectorAll("[data-letter]"), {
      keyframes: [
        { yPercent: -45, duration: 0.22, ease: "expo.out" },
        { yPercent: 0, duration: 0.34, ease: "expo.out" },
      ],
      stagger: 0.035,
      overwrite: "auto",
    });
  };
  // Only show meta rows that have a real value (no placeholder city/year/school).
  const meta = profile.meta.filter(([, v]) => v.trim() !== "");
  // Right-side wipe reads design (creative stack) -> engineering from skillGroups.
  const design = skillGroups[0]?.[1] ?? [];
  const engineering = skillGroups[1]?.[1] ?? [];

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

      // Image-mask wipe (progressive enhancement): the stacked plates become
      // two overlapping layers, then the engineering plate slides over the
      // design plate while its content counter-translates, so it reads as one
      // fixed image being uncovered. Scrubbed as the panel passes through view.
      if (compare.current && before.current && after.current && afterInner.current) {
        // Landscape, not portrait: a horizontal wipe wants width, and keeping the
        // panel short keeps the About section under one viewport so Panels.tsx
        // uses its simple-pin branch (a taller panel triggers the pinned
        // fake-scroll path, which reads as the section being "stuck").
        gsap.set(compare.current, { aspectRatio: "16 / 10" });
        gsap.set([before.current, after.current], {
          position: "absolute",
          inset: 0,
        });
        gsap.set(after.current, { overflow: "hidden" });

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: compare.current,
              start: "top 78%",
              end: "bottom 38%",
              scrub: 1,
            },
          })
          .fromTo(after.current, { xPercent: 100 }, { xPercent: 0 }, 0)
          .fromTo(afterInner.current, { xPercent: -100 }, { xPercent: 0 }, 0);
      }
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
          {/* statement + meta + recognition */}
          <div className="flex flex-col gap-12">
            <p data-about className="max-w-[20ch] text-subtitle font-black">
              Design and engineering,{" "}
              <span className="text-accent">one craft</span>. I build interactive
              interfaces and the{" "}
              <span
                ref={motionWord}
                onMouseEnter={waveMotion}
                onClick={waveMotion}
                aria-label="motion"
                className="relative inline-block cursor-default align-baseline"
              >
                {"motion".split("").map((c, i) => (
                  <span key={i} data-letter aria-hidden className="inline-block">
                    {c}
                  </span>
                ))}
                <span
                  aria-hidden
                  className="absolute -bottom-0.5 left-0 h-0.5 w-full bg-accent-2"
                />
              </span>{" "}
              behind them.
            </p>

            {meta.length > 0 && (
              <dl
                data-about
                className="flex flex-wrap gap-x-12 gap-y-4 border-t border-border pt-4 font-mono text-label"
              >
                {meta.map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-1">
                    <dt className="uppercase tracking-[0.1em] text-dim">{k}</dt>
                    <dd className="font-medium text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            )}

            {profile.awards.length > 0 && (
              <div data-about className="font-mono text-label">
                <p className="uppercase tracking-[0.1em] text-dim">Recognition</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {profile.awards.map((a) => (
                    <li
                      key={a.name}
                      className="flex justify-between border-t border-border pt-2"
                    >
                      <span className="font-medium text-ink">{a.name}</span>
                      <span className="text-accent-2">{a.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* stack as a before/after wipe: design plate is uncovered to reveal
              the engineering plate on scroll. Stacked + readable without JS. */}
          <div data-about ref={compare} className="relative flex flex-col gap-4">
            {/* DESIGN plate (before / underneath) */}
            <div
              ref={before}
              className="flex min-h-[15rem] flex-col justify-between gap-8 rounded-3xl border-2 border-ink bg-design-surface p-6 sm:p-8"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-label uppercase tracking-[0.12em] text-accent">
                  Design
                </span>
                <span className="font-mono text-label text-design-dim">the intent</span>
              </div>
              <ul className="flex flex-wrap gap-2 font-mono text-label font-medium">
                {design.map((t) => (
                  <li
                    key={t}
                    className="border border-accent/40 px-2.5 py-1 text-ink transition-[transform,box-shadow,border-color] duration-150 ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-accent hover:shadow-[3px_3px_0_var(--color-accent)] motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* ENGINEERING plate (after / wipes over) */}
            <div
              ref={after}
              className="rounded-3xl border-2 border-ink bg-eng-surface text-bg"
            >
              <div
                ref={afterInner}
                className="flex h-full w-full min-h-[15rem] flex-col justify-between gap-8 p-6 sm:p-8"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-label uppercase tracking-[0.12em] text-eng-line">
                    Engineering
                  </span>
                  <span className="font-mono text-label text-eng-dim">the build</span>
                </div>
                <ul className="flex flex-wrap gap-2 font-mono text-label font-medium">
                  {engineering.map((t) => (
                    <li
                      key={t}
                      className="border border-eng-line/45 px-2.5 py-1 text-bg transition-[transform,box-shadow,border-color] duration-150 ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-eng-line hover:shadow-[3px_3px_0_var(--color-accent-2)] motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
