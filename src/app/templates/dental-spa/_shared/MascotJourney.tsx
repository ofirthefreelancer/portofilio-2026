"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { asset } from "@/lib/asset";
import type { SpaTheme } from "./theme";

// The three lines, one per journey phase (the hero is Phase 1). Each splits
// into a lead and the trailing words that take the brand-blue accent.
const LINES = [
  { lead: "Whitening that fits ", accent: "your day." }, // Phase 2
  { lead: "Confirmed within ", accent: "the hour." }, // Phase 3
  { lead: "Book your ", accent: "bright hour." }, // Phase 4
];

/**
 * The mascot facing. The art faces RIGHT by default (gaze + open-arm lean point
 * right). So to face its travel direction we flip (scaleX -1) when moving left
 * and keep the default when moving right. If a future asset faces left instead,
 * swap these two constants and nothing else changes.
 */
const SX_FACING_LEFT = -1;
const SX_FACING_RIGHT = 1;

/**
 * §2 The Guide — a scroll-scrubbed, art-directed swim in three phases. The tooth
 * mascot arcs across the page while one brand line surfaces per phase; it turns
 * to face its travel direction, scales with emphasis, and on the last phase
 * descends to bottom-centre to hand the user off to the Signature Menu. The
 * mascot rides BEHIND the text (lower z-index) so Phase 3 reads as foreground/
 * background depth. Reduced motion collapses to a static stack of the lines.
 *
 *   Phase 2 (0→1): right  → centre-left, faces left,  70% — line 1
 *   Phase 3 (1→2): left   → centre-right, faces right, 85% — line 2 (peeks behind)
 *   Phase 4 (2→3): right  → bottom-centre, faces left, 50% — line 3, points down
 */
export function MascotJourney({ theme: _theme }: { theme: SpaTheme }) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const fish = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const stageEl = stage.current;
      const fishEl = fish.current;
      const imgEl = fishEl?.querySelector("img");
      if (!stageEl || !fishEl || !imgEl) return;

      // Normalized waypoints (fractions of the stage) -> pixels. Each phase is a
      // 3-point arc: start, a bowed control point, end. Computed at setup; the
      // trigger's invalidateOnRefresh re-runs this block on resize.
      const p = (x: number, y: number) => ({
        x: x * stageEl.clientWidth,
        y: y * stageEl.clientHeight,
      });
      const SEG_A = [p(0.75, 0.5), p(0.52, 0.32), p(0.25, 0.45)]; // right -> centre-left
      const SEG_B = [p(0.25, 0.45), p(0.47, 0.4), p(0.7, 0.55)]; // centre-left -> centre-right
      const SEG_C = [p(0.7, 0.55), p(0.63, 0.73), p(0.5, 0.86)]; // centre-right -> bottom-centre

      const mp = (path: { x: number; y: number }[]) => ({
        motionPath: { path, curviness: 1.3, alignOrigin: [0.5, 0.5], autoRotate: false },
      });

      // Starting pose: at SEG_A[0], 70%, facing left.
      gsap.set(fishEl, { scale: 0.7, rotation: 0, transformOrigin: "50% 50%" });
      gsap.set(imgEl, { scaleX: SX_FACING_LEFT, transformOrigin: "50% 50%" });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          // Buttery lag behind the wheel — weightless feel.
          scrub: 1,
          pin: stageEl,
          invalidateOnRefresh: true,
        },
      });

      // --- Travel: one motion-path tween per phase, equal scroll thirds.
      //     immediateRender on SEG_A so the fish is planted at its start waypoint
      //     (right-centre) the instant the section is on screen — without it the
      //     motion-path inits lazily and the fish sits parked at its raw 0,0
      //     corner until the scrub finally reaches it. ---
      tl.to(fishEl, { ...mp(SEG_A), duration: 1, immediateRender: true }, 0)
        .to(fishEl, { ...mp(SEG_B), duration: 1 }, 1)
        .to(fishEl, { ...mp(SEG_C), duration: 1 }, 2);

      // --- Scale emphasis: 70% -> 85% (grow into Phase 3) -> 50% (recede). ---
      tl.to(fishEl, { scale: 0.85, duration: 0.5, ease: "power2.out" }, 0.9)
        .to(fishEl, { scale: 0.5, duration: 0.5, ease: "power2.in" }, 1.9)
        // Phase 4 descent: a gentle dive tilt as it drops to the menu.
        .to(fishEl, { rotation: 9, duration: 0.6, ease: "power2.in" }, 2.0);

      // --- Facing: turn to face travel direction at each direction change. ---
      tl.to(imgEl, { scaleX: SX_FACING_RIGHT, duration: 0.32, ease: "power1.inOut" }, 0.9) // -> moving right
        .to(imgEl, { scaleX: SX_FACING_LEFT, duration: 0.32, ease: "power1.inOut" }, 1.9); // -> moving left

      tl.to("[data-journey-cue]", { opacity: 0, duration: 0.5, ease: "power2.out" }, 0.3);

      // --- Text: one line per phase. Fully cleared before the next surfaces
      //     (line i gone by ~i+1.13, next begins i+1.15) so they never collide. ---
      gsap.utils.toArray<HTMLElement>("[data-journey-msg]").forEach((el, i) => {
        tl.fromTo(
          el,
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.35, ease: "expo.out" },
          i + 0.15
        ).to(el, { opacity: 0, y: -26, duration: 0.35, ease: "power2.in" }, i + 0.78);
      });
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <section
      ref={root}
      aria-label="A guided swim through the spa experience"
      className={reduced ? "" : "h-[280vh]"}
    >
      <div
        ref={stage}
        className={
          (reduced ? "py-[var(--spacing-section)] " : "h-screen ") +
          "relative flex items-center justify-center overflow-hidden px-[var(--spacing-gutter)]"
        }
      >
        {/* Lines — non-reduced: each stacked in the same centered grid cell and
            scrubbed one at a time, ABOVE the mascot (z-20) for the depth read.
            Reduced: a simple centered column. */}
        <div
          className={
            reduced
              ? "relative z-20 text-center"
              : "pointer-events-none absolute inset-0 z-20 grid place-items-center px-[var(--spacing-gutter)] text-center"
          }
        >
          {LINES.map((line, i) => (
            <p
              key={line.accent}
              data-journey-msg
              className="font-semibold tracking-[-0.02em] text-[var(--spa-ink)] [text-wrap:balance]"
              style={{
                fontSize: "clamp(2.4rem, 7vw, 4.75rem)",
                lineHeight: 1.05,
                maxWidth: "16ch",
                ...(reduced
                  ? { marginInline: "auto", marginBottom: i === LINES.length - 1 ? 0 : "1.5rem" }
                  : { gridArea: "1 / 1", opacity: 0 }),
              }}
            >
              {line.lead}
              <span className="font-black text-[var(--spa-accent-strong)]">
                {line.accent}
              </span>
            </p>
          ))}
        </div>

        {/* The swimming mascot — rides behind the text (z-10) for parallax depth.
            Outer div = GSAP travel/scale/rotation; inner div = idle bob so it's
            alive the instant it scrolls into view (before the pin scrub engages);
            img = facing flip. Three nested transforms that never fight. */}
        <div
          ref={fish}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-10"
          style={{ width: "clamp(280px, 30vw, 460px)" }}
        >
          <div className={reduced ? "" : "spa-float"}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset("/templates/dentist/mascot/hero-tooth.png")}
              alt=""
              draggable={false}
              className="h-auto w-full"
              style={{
                filter: "drop-shadow(0 22px 36px color-mix(in oklch, var(--spa-ink) 24%, transparent))",
              }}
            />
          </div>
        </div>

        {/* Scroll cue */}
        {!reduced && (
          <div
            data-journey-cue
            className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-[var(--spa-ink-soft)]"
          >
            <span className="text-[0.75rem] uppercase tracking-[0.22em] opacity-80">Swim</span>
            <span className="h-9 w-px bg-current opacity-50" />
          </div>
        )}
      </div>
    </section>
  );
}
