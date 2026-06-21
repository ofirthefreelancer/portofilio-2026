"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { projects, type Project } from "@/lib/projects";
import { asset } from "@/lib/asset";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Selected work as pinned stacking cards. Each card pins near the top; as you
 * scroll, the card below slides up and stacks over it while the ones beneath
 * scale down and tilt back (rotationX), so the pile recedes in 3D. Adapted from
 * a GSAP "stacking cards" pattern into the Press system: tall ink-bordered cards
 * (no gradients/radius), two-ink accents. pinSpacing:false means no pin-spacer is
 * inserted (kinder to React reconciliation). Lenis smooths scroll globally.
 *
 * A card with a `preview` becomes an editorial split: copy on one side, a live
 * preview of the real work on the other (poster at rest, the actual clip plays
 * on hover/focus), with the mascot breaking the frame. With a single project the
 * stack can't run, so the card earns its life from the entrance + preview.
 *
 * data-standalone -> Panels skips it. Reduced motion / no JS: plain vertical list.
 */
// A note for anyone who opens devtools. Logged once. The audience reads source.
let greeted = false;

export function Work() {
  const root = useRef<HTMLElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (greeted) return;
    greeted = true;
    console.log(
      "%c Selected work %c Next 16 + GSAP + OKLCH. The source is part of the portfolio.\n Found something off in it? ofirthefreelancer@gmail.com",
      "background:#962d23;color:#f6f2eb;font-weight:700;padding:2px 7px",
      "color:#14789a;font-weight:500;padding-left:4px"
    );
  }, []);

  useGSAP(
    () => {
      if (!wrapper.current) return;
      if (reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        return;

      const wrappers = gsap.utils.toArray<HTMLElement>(".card-wrapper", root.current);
      const cards = gsap.utils.toArray<HTMLElement>(".card", root.current);

      // Stacking only makes sense with multiple cards; a single piece just sits.
      if (cards.length <= 1) return;

      wrappers.forEach((w, i) => {
        const card = cards[i];
        const isLast = i === cards.length - 1;
        gsap.to(card, {
          scale: isLast ? 1 : 0.9 + 0.025 * i,
          rotationX: isLast ? 0 : -8,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: w,
            // staggered pin point, offset to clear the sticky header (64px)
            start: "top " + (104 + 12 * i),
            end: "bottom 620",
            endTrigger: wrapper.current,
            scrub: true,
            pin: w,
            pinSpacing: false,
            invalidateOnRefresh: true,
            id: String(i + 1),
          },
        });
      });
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <section ref={root} id="work" data-standalone className="bg-surface">
      <div
        ref={wrapper}
        className="mx-auto w-full max-w-[1040px] px-gutter pb-[34vh] pt-section"
      >
        <div className="mb-12 flex items-baseline justify-between">
          <h2 className="text-title font-black">Selected work</h2>
          <span className="font-mono text-label text-dim">
            {projects.length} project{projects.length === 1 ? "" : "s"}
          </span>
        </div>

        {projects.map((p) => (
          <WorkCard key={p.index} p={p} />
        ))}
      </div>
    </section>
  );
}

function WorkCard({ p }: { p: Project }) {
  const reduced = useReducedMotion();
  const card = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const hasPreview = !!p.preview;

  // Entrance: copy rises in a stagger, the preview clips up from its base, and
  // the mascot drifts in. Scoped to this card so it composes with the parent's
  // stacking timeline (which drives the .card transform, not these children).
  useGSAP(
    () => {
      if (reduced) return;
      const st = { trigger: card.current, start: "top 82%", once: true } as const;

      gsap.from("[data-rise]", {
        y: 22,
        opacity: 0,
        duration: 0.7,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: st,
      });

      if (hasPreview) {
        gsap.from("[data-media]", {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.9,
          ease: "expo.out",
          clearProps: "clipPath",
          scrollTrigger: st,
        });
        gsap.from("[data-mascot]", {
          y: -18,
          x: 14,
          rotate: -10,
          opacity: 0,
          duration: 0.85,
          ease: "expo.out",
          delay: 0.18,
          clearProps: "transform,opacity",
          scrollTrigger: st,
        });
      }
    },
    { scope: card, dependencies: [reduced] }
  );

  const play = () => video.current?.play().catch(() => {});
  const stop = () => {
    const v = video.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };
  // Hover/focus drives the clip only when there's a video and motion is allowed.
  const hoverProps =
    p.preview?.video && !reduced
      ? { onMouseEnter: play, onMouseLeave: stop, onFocus: play, onBlur: stop }
      : {};

  // Shared copy column — meta, title, blurb, stack + live link.
  const copy = (
    <div className="flex min-w-0 flex-col justify-between gap-7">
      <div
        data-rise
        className="flex items-start justify-between font-mono text-label tabular-nums"
      >
        <span className="text-accent-2">{p.index}</span>
        <span className="text-dim">{p.year}</span>
      </div>

      <div>
        <h3 data-rise className="text-h3 font-black sm:text-title">
          {p.title}
        </h3>
        <p data-rise className="mt-4 max-w-[52ch] text-body text-muted">
          {p.blurb}
        </p>
      </div>

      <div data-rise className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap gap-2 font-mono text-label font-medium">
          {p.stack.map((t) => (
            <span
              key={t}
              className="border border-accent-2 px-2 py-0.5 text-accent-2 transition-colors duration-150 group-hover:bg-accent-2 group-hover:text-accent-2-ink"
            >
              {t}
            </span>
          ))}
        </div>
        {p.href && (
          <span className="inline-flex items-center gap-1.5 font-mono text-label font-medium text-accent">
            View site
            <span
              aria-hidden
              className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
            >
              ↗
            </span>
          </span>
        )}
      </div>
    </div>
  );

  // Live preview column — real poster + clip, mascot breaking the frame.
  const media = hasPreview && p.preview && (
    <div className="relative">
      <div
        data-media
        className="relative aspect-[16/10] w-full overflow-hidden border-2 border-ink bg-eng-surface lg:absolute lg:inset-0 lg:aspect-auto lg:h-full"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(p.preview.poster)}
          alt={p.preview.alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
        {!reduced && p.preview.video && (
          <video
            ref={video}
            src={asset(p.preview.video)}
            poster={asset(p.preview.poster)}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}

        {/* Play affordance — signals the frame is alive, fades as it plays. */}
        {!reduced && p.preview.video && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 grid place-items-center transition-opacity duration-300 group-hover:opacity-0"
          >
            <span
              className="grid h-14 w-14 place-items-center rounded-full"
              style={{ background: "color-mix(in oklch, var(--color-ink) 82%, transparent)" }}
            >
              <span
                className="ml-1 h-0 w-0 border-y-[7px] border-l-[12px] border-y-transparent"
                style={{ borderLeftColor: "var(--color-bg)" }}
              />
            </span>
          </span>
        )}

        {/* Engineering-ink caption chip, legible on any poster. */}
        <span
          className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 font-mono text-[11px] font-medium"
          style={{
            background: "var(--color-ink)",
            color: "var(--color-bg)",
            padding: "0.2rem 0.5rem",
          }}
        >
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--color-accent-2)" }}
          />
          Live preview
        </span>
      </div>

      {p.mascot && (
        <span
          data-mascot
          className="pointer-events-none absolute -top-7 right-2 z-10 block w-[72px] sm:w-[92px]"
        >
          <span className="work-mascot-float block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset(p.mascot)}
              alt=""
              draggable={false}
              className="h-auto w-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 group-hover:-rotate-6"
              style={{
                filter:
                  "drop-shadow(0 12px 18px color-mix(in oklch, var(--color-ink) 30%, transparent))",
              }}
            />
          </span>
        </span>
      )}
    </div>
  );

  const richClass =
    "card group relative grid min-h-[460px] grid-cols-1 gap-7 border-2 border-ink bg-bg p-7 will-change-transform sm:p-9 lg:min-h-[520px] lg:grid-cols-[1.05fr_1fr] lg:items-stretch lg:gap-12";
  const plainClass =
    "card group flex h-[400px] flex-col justify-between border-2 border-ink bg-bg p-8 will-change-transform sm:h-[440px] sm:p-10";

  const inner = hasPreview ? (
    <>
      {copy}
      {media}
    </>
  ) : (
    copy
  );

  const className = `${hasPreview ? richClass : plainClass} press-hover-2`;

  return (
    <div
      ref={card}
      className="card-wrapper mb-16 last:mb-0"
      style={{ perspective: "1000px" }}
    >
      {p.href ? (
        <Link href={p.href} className={className} {...hoverProps}>
          {inner}
        </Link>
      ) : (
        <div className={hasPreview ? richClass : plainClass}>{inner}</div>
      )}
    </div>
  );
}
