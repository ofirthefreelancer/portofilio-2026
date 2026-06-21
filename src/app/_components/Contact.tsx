"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { profile } from "@/lib/profile";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Closing "colophon plate": the site signs off like the back page of a press
 * work, not a sales pitch (quiet-footer ethos, PRODUCT.md). An oversized name
 * signature, a click-to-copy email, the external links with the signature
 * arrow-nudge, and a real colophon strip — typefaces, stack, a live local clock.
 * The facts are true of THIS site (Canvas 2D, not WebGL). Resting last panel:
 * Panels.tsx leaves it un-pinned. Reduced motion / no JS: everything is visible
 * and legible; only the entrance and the ticking clock are progressive.
 */
const EMAIL = "ofirthefreelancer@gmail.com";
const LINKS: [string, string][] = [
  ["GitHub", "https://github.com"],
  ["X", "https://x.com"],
];

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const rule = useRef<HTMLDivElement>(null);
  const name = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState<string | null>(null);

  // Live local clock. Rendered only after mount so server and client agree.
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — the address is on screen to copy by hand */
    }
  };

  useGSAP(
    () => {
      if (reduced) return;

      // Split the name signature into characters and fly them in from the right
      // (power4) — the entrance hero of the closing plate. SplitText sets the
      // aria so screen readers still read the whole name; revert restores the
      // plain DOM on cleanup.
      const split = SplitText.create(name.current, { type: "chars" });

      gsap
        .timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: { trigger: root.current, start: "top 78%" },
        })
        .from(rule.current, { scaleX: 0, duration: 0.7 })
        .from(
          split.chars,
          { x: 150, opacity: 0, duration: 0.7, ease: "power4", stagger: 0.04 },
          "-=0.4"
        )
        .from(
          "[data-contact]",
          { y: 32, opacity: 0, duration: 0.7, stagger: 0.08 },
          "-=0.5"
        );

      return () => split.revert();
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <footer
      id="contact"
      ref={root}
      className="flex min-h-screen flex-col bg-surface-2"
    >
      <div className="mx-auto flex w-full max-w-[1180px] flex-1 flex-col justify-center px-gutter py-section">
        {/* press masthead rule */}
        <div ref={rule} className="h-0.5 w-full origin-left bg-ink" />

        <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-2 md:items-end">
          {/* name signature */}
          <div>
            <h2
              ref={name}
              aria-label="Ofir Cohen."
              className="text-display font-black leading-[0.9]"
            >
              Ofir Cohen<span className="text-accent">.</span>
            </h2>
            <p
              data-contact
              className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-label uppercase tracking-[0.12em] text-muted"
            >
              <span>{profile.role}</span>
              <span aria-hidden className="text-dim">
                /
              </span>
              <span className="flex items-center gap-2 text-ink">
                <span aria-hidden className="size-1.5 rotate-45 bg-accent" />
                Available
              </span>
            </p>
          </div>

          {/* contact */}
          <div
            data-contact
            className="flex flex-col items-start gap-6 md:items-end"
          >
            <button
              type="button"
              onClick={copyEmail}
              aria-label={`Copy email address ${EMAIL}`}
              className="group flex flex-col items-start gap-1 text-left md:items-end md:text-right"
            >
              <span className="border-b-2 border-transparent pb-0.5 font-mono text-[clamp(1.2rem,2.6vw,1.85rem)] text-ink transition-colors duration-150 group-hover:border-ink">
                {EMAIL}
              </span>
              <span className="font-mono text-label uppercase tracking-[0.12em] text-accent-2">
                {copied ? "Copied" : "Click to copy"}
              </span>
            </button>

            <nav className="flex gap-6 font-mono text-body">
              {LINKS.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-muted transition-colors hover:text-ink"
                >
                  <span className="text-accent transition-transform duration-150 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none">
                    ↗
                  </span>
                  <span className="border-b border-transparent group-hover:border-ink">
                    {label}
                  </span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* colophon strip — real facts about this site */}
      <div data-contact className="border-t border-border">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-2 px-gutter py-6 font-mono text-label text-muted md:flex-row md:items-center md:justify-between">
          <span>Hanken Grotesk + Geist Mono · Next.js, GSAP, Canvas · No trackers</span>
          <span className="flex items-center gap-3 tabular-nums">
            <span aria-label="Local time">{time ?? "--:--:--"}</span>
            <span aria-hidden className="text-border">
              ·
            </span>
            <span>© 2026</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
