"use client";

import { Fragment, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { asset } from "@/lib/asset";
import type { SpaTheme } from "./theme";

const HERO_VIDEO = "/templates/dentist/scan-to-smile.mp4";
const HERO_POSTER = "/templates/dentist/scan-to-smile-poster.jpg";

/**
 * §1 The Sanctuary. A centered hero that flows at natural height — no pin, no
 * viewport lock. The brand line leads, the CTAs sit just beneath it, and the
 * "scan to smile" clip closes the section in a cinematic frame. On load the
 * headline clip-reveals line-by-line, the CTAs rise, and the frame lifts in.
 * Reduced motion shows a static poster with no entrance animation. Nothing
 * here blocks a click.
 */
export function Sanctuary({ theme }: { theme: SpaTheme }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;

      // Entrance only: headline clip-reveals up, CTAs rise, the frame lifts in.
      gsap.from("[data-hero-line]", {
        yPercent: 115,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.08,
      });
      gsap.from("[data-hero-rise]", {
        y: 18,
        opacity: 0,
        duration: 0.7,
        ease: "expo.out",
        delay: 0.28,
        stagger: 0.08,
      });
      gsap.from("[data-hero-video]", {
        y: 46,
        opacity: 0,
        scale: 0.96,
        duration: 1.1,
        ease: "expo.out",
        delay: 0.18,
      });

      // Scroll: the clip grows as the section scrolls through the viewport —
      // no pin, no height lock. The frame's layout width is 90vw; scrubbing
      // transform scale up to 1 lands its peak at exactly 90% of the page —
      // never wider, so nothing crops — while staying crisp and reflow-free.
      gsap.fromTo(
        "[data-hero-frame]",
        { scale: 0.62 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-hero-video]",
            start: "top bottom",
            end: "center center",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }
      );
    },
    { scope: root, dependencies: [reduced] }
  );

  // Two balanced display lines; the final word gets the brand accent.
  const words = theme.hero.headline.split(" ");
  const splitAt = Math.ceil(words.length / 2);
  const headlineLines = [words.slice(0, splitAt), words.slice(splitAt)];

  return (
    <section
      ref={root}
      className="relative flex flex-col items-center overflow-x-clip px-[var(--spacing-gutter)] pb-[clamp(4rem,10vh,7rem)] pt-[clamp(6rem,16vh,10rem)]"
    >
      {/* Copy column — title leads, supporting line and CTAs beneath it. */}
      <div className="relative z-20 mx-auto w-full max-w-3xl overflow-hidden text-center">
        <h1
          className="font-bold tracking-[-0.035em] text-balance text-[var(--spa-ink)]"
          style={{
            fontSize: "clamp(2.1rem, 5.6vw, 4rem)",
            lineHeight: 1.02,
            fontWeight: 700,
          }}
        >
          {headlineLines.map((lineWords, li) => (
            // each line is its own clip box so the reveal rises line-by-line
            <span key={li} className="block overflow-hidden pb-[0.08em]">
              <span data-hero-line className="block">
                {lineWords.map((w, wi) => {
                  const isAccent =
                    li === headlineLines.length - 1 && wi === lineWords.length - 1;
                  return (
                    <Fragment key={wi}>
                      {isAccent ? (
                        <span style={{ color: "var(--spa-accent-strong)" }}>{w}</span>
                      ) : (
                        w
                      )}
                      {wi < lineWords.length - 1 ? " " : ""}
                    </Fragment>
                  );
                })}
              </span>
            </span>
          ))}
        </h1>

        <p
          data-hero-rise
          className="mx-auto mt-5 max-w-[46ch] text-pretty text-[var(--spa-ink-soft)]"
          style={{ fontSize: "1.125rem", lineHeight: 1.6 }}
        >
          {theme.hero.sub}
        </p>

        <div data-hero-rise className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#spa-book"
            className="spa-cta-primary inline-flex items-center px-6 py-3.5 font-semibold transition-transform duration-200 hover:-translate-y-0.5"
          >
            Book appointment
          </a>
          <a
            href="#spa-services"
            className="spa-cta-ghost inline-flex items-center gap-2 px-6 py-3.5 font-medium transition-colors duration-200"
          >
            Our services
          </a>
        </div>
      </div>

      {/* Video — "scan to smile", closing the hero in a cinematic frame. */}
      <figure
        data-hero-video
        className="relative z-0 mt-[clamp(3rem,7vh,5rem)] flex w-full justify-center"
      >
        {/* Soft cool glow seats the frame on the airy page */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-12 -inset-y-10 -z-10"
          style={{
            background:
              "radial-gradient(60% 56% at 50% 44%, color-mix(in oklch, var(--spa-glow) 72%, transparent), transparent 72%)",
          }}
        />
        <div
          data-hero-frame
          className="relative aspect-[16/9] overflow-hidden"
          style={{
            width: "90vw",
            borderRadius: "1.75rem",
            border: "1px solid var(--spa-line)",
            background: "var(--spa-ink)",
            boxShadow:
              "0 50px 100px -50px color-mix(in oklch, var(--spa-ink) 58%, transparent)",
          }}
        >
          {reduced ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              data-hero-clip
              src={asset(HERO_POSTER)}
              alt="A dull smile brightening to a natural white shade"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <video
              data-hero-clip
              src={asset(HERO_VIDEO)}
              poster={asset(HERO_POSTER)}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          {/* Gentle floor gradient grounds the frame on the airy page */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, transparent 62%, color-mix(in oklch, var(--spa-ink) 30%, transparent))",
            }}
          />
        </div>
      </figure>
    </section>
  );
}
