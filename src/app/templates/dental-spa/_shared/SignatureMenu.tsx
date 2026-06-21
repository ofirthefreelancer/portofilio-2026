"use client";

import { useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { asset } from "@/lib/asset";
import { SERVICES } from "./theme";

/**
 * Per-service full-bleed brand wash sitting behind each mascot pose. The glow
 * shifts position and deepens its blue across the three slides so the clip-path
 * wipe edge reads as it sweeps the section — all kept light so the overlaid copy
 * stays legible (the template is light-dominant, airy).
 */
const SLIDE_BG = [
  "radial-gradient(115% 100% at 82% 18%, var(--spa-glow), var(--spa-surface) 68%)",
  "radial-gradient(120% 110% at 50% 58%, color-mix(in oklch, var(--spa-accent) 18%, var(--spa-surface)), var(--spa-surface) 74%)",
  "radial-gradient(125% 115% at 18% 82%, color-mix(in oklch, var(--spa-accent) 26%, var(--spa-glow)), var(--spa-surface) 80%)",
];

/**
 * §4 Signature Menu & the Mascot Journey. One pinned track: scroll progress
 * (0→1) advances the active service while the next service's full-bleed scene
 * (brand wash + mascot pose) wipes in over the current one across the WHOLE
 * section via a scrubbed clip-path mask — the "image comparison on scroll"
 * reveal, item to item. id="spa-services" is the hero CTA target.
 */
export function SignatureMenu() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const lastIdx = useRef(0);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      if (reduced) return;
      // Poses stacked in service order; later ones sit on top. Each starts
      // clipped away from the right and wipes open (left→right) as scroll
      // crosses into its service.
      const poses = gsap.utils.toArray<HTMLElement>("[data-pose]");
      if (poses.length < SERVICES.length) return;
      gsap.set(poses.slice(1), { clipPath: "inset(0 100% 0 0)" });
      gsap.set(poses[0], { clipPath: "inset(0 0% 0 0)" });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          id: "spa-services",
          trigger: root.current,
          start: "top top",
          end: `+=${SERVICES.length * 90}%`,
          scrub: true,
          pin: "[data-menu-stage]",
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Switch the highlighted card at each wipe's midpoint (timeline
            // total = 7: wipes at 1→3 and 4→6, so midpoints ≈ 0.285 / 0.715).
            const p = self.progress;
            const idx = p < 0.285 ? 0 : p < 0.715 ? 1 : 2;
            if (idx !== lastIdx.current) {
              lastIdx.current = idx;
              setActive(idx);
            }
          },
        },
      });
      // dwell on pose 0 → wipe pose 1 in → dwell → wipe pose 2 in → dwell.
      tl.to(poses[1], { clipPath: "inset(0 0% 0 0)", duration: 2 }, 1)
        .to(poses[2], { clipPath: "inset(0 0% 0 0)", duration: 2 }, 4)
        .to({}, { duration: 1 }, 6);

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <section
      id="spa-services"
      ref={root}
      className={(reduced ? "" : "h-[360vh] ") + "relative z-10"}
      style={{ background: "var(--spa-bg)" }}
    >
      <div
        data-menu-stage
        className="relative flex min-h-screen items-center overflow-hidden"
      >
        {/* Full-bleed masked slides — each service's scene (brand wash + mascot
            pose) wipes in over the previous across the WHOLE section. The GSAP
            timeline animates each slide's clip-path; reduced motion shows the
            first slide only. */}
        <div className="absolute inset-0" aria-hidden>
          {SERVICES.map((s, i) => (
            <div
              key={s.name}
              data-pose={i}
              className="absolute inset-0"
              style={{
                // Pre-GSAP initial state (also the reduced-motion state):
                // first slide open, the rest clipped away until they wipe in.
                clipPath: i === 0 ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                opacity: reduced && i !== 0 ? 0 : 1,
                willChange: "clip-path",
                background: SLIDE_BG[i],
              }}
            >
              <div className="spa-float absolute bottom-0 right-[2%] h-[64%] sm:h-[78%] lg:h-[84%]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset(`/templates/dentist/mascot/pose-${s.pose}.png`)}
                  alt=""
                  draggable={false}
                  className="h-full w-auto object-contain"
                  style={{
                    filter:
                      "drop-shadow(0 30px 50px color-mix(in oklch, var(--spa-ink) 22%, transparent))",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Legibility scrim on the copy side — guarantees contrast for the
            overlaid list regardless of which slide is showing. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, var(--spa-bg) 4%, color-mix(in oklch, var(--spa-bg) 55%, transparent) 36%, transparent 60%)",
          }}
        />

        {/* Foreground copy + service list, overlaid on the masked scene */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-[var(--spacing-gutter)] py-[var(--spacing-section)]">
          <div className="max-w-xl">
            <p className="mb-3 text-[0.8125rem] font-medium uppercase tracking-[0.24em] text-[var(--spa-ink-soft)]">
              Whitening menu
            </p>
            <h2
              className="mb-8 font-semibold tracking-[-0.03em]"
              style={{ fontSize: "clamp(1.9rem, 4.5vw, 3rem)", lineHeight: 1.02 }}
            >
              Three ways in.
            </h2>

            <ul className="space-y-3">
              {SERVICES.map((s, i) => {
                const on = reduced || i === active;
                return (
                  <li
                    key={s.name}
                    className="border p-5 transition-all duration-300"
                    style={{
                      borderColor: on ? "var(--spa-accent)" : "var(--spa-line)",
                      background: on
                        ? "color-mix(in oklch, var(--spa-surface) 88%, transparent)"
                        : "color-mix(in oklch, var(--spa-surface) 30%, transparent)",
                      backdropFilter: "blur(6px)",
                      borderRadius: "var(--spa-radius)",
                      opacity: on ? 1 : 0.6,
                      transform: on && !reduced ? "translateX(6px)" : "none",
                    }}
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <h3
                        className="font-semibold tracking-[-0.02em]"
                        style={{ fontSize: "clamp(1.25rem, 2.4vw, 1.7rem)" }}
                      >
                        {s.name}
                      </h3>
                      <span className="font-mono text-[0.8125rem] text-[var(--spa-accent-strong)]">
                        {s.duration}
                      </span>
                    </div>
                    {/* body only on the active card (or all, reduced) keeps the list calm */}
                    <div
                      className="grid transition-[grid-template-rows,opacity] duration-300"
                      style={{
                        gridTemplateRows: on ? "1fr" : "0fr",
                        opacity: on ? 1 : 0,
                      }}
                    >
                      <p
                        className="overflow-hidden text-pretty"
                        style={{ color: "var(--spa-ink-soft)", fontSize: "1.0625rem", lineHeight: 1.6, marginTop: on ? "0.5rem" : 0 }}
                      >
                        {s.body}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
