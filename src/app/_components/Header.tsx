"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const SECTIONS: [string, string][] = [
  ["Work", "#work"],
  ["About", "#about"],
  ["Contact", "#contact"],
];

export function Header() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Lock background scroll, wire Escape, and manage focus while the menu is open.
  useEffect(() => {
    if (!open) return;

    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden"; // also halts Lenis (it reads the scroller)

    const toggle = toggleRef.current; // stable node; capture for cleanup
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);

    // Move focus into the sheet so keyboard / screen-reader users land inside it.
    firstLinkRef.current?.focus();

    return () => {
      html.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      // Return focus to the control that opened the sheet.
      toggle?.focus();
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-bg/85 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between border-b-2 border-ink px-gutter">
          <Link
            href="/"
            className="text-body font-extrabold uppercase tracking-[0.03em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            Ofir Cohen
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 text-body sm:flex">
            {SECTIONS.map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="text-muted transition-colors hover:text-ink focus-visible:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                {label}
              </a>
            ))}
            {/* Templates demoted to a single header link */}
            <Link
              href="/templates"
              className="bg-accent px-4 py-2 font-mono text-label font-medium text-accent-ink press-hover-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              Templates ↗
            </Link>
          </nav>

          {/* Mobile toggle — only affordance in the bar; Templates lives inside the sheet */}
          <button
            ref={toggleRef}
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
            className="-mr-2 flex h-11 w-11 items-center justify-center sm:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span className="flex w-6 flex-col gap-[5px]">
              <span className="h-[2px] w-full bg-ink" />
              <span className="h-[2px] w-full bg-ink" />
            </span>
          </button>
        </div>
      </header>

      {/* Full-screen sheet — sibling of the blurred bar so `fixed` resolves to the
          viewport, not the backdrop-filter containing block. Always mounted;
          visibility toggling keeps links out of the tab order while closed. */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        className={`fixed inset-0 z-50 flex flex-col bg-bg transition-[opacity,visibility] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {/* Sheet top row mirrors the bar so the takeover reads as continuous. */}
        <div
          className="flex h-16 shrink-0 items-center justify-between border-b-2 border-ink px-gutter"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <span className="text-body font-extrabold uppercase tracking-[0.03em]">
            Ofir Cohen
          </span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="-mr-2 flex h-11 w-11 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span className="relative block h-6 w-6">
              <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 rotate-45 bg-ink" />
              <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 -rotate-45 bg-ink" />
            </span>
          </button>
        </div>

        <nav className="flex flex-1 flex-col justify-between px-gutter pb-[max(2rem,env(safe-area-inset-bottom))] pt-10">
          <ul className="flex flex-col">
            {SECTIONS.map(([label, href], i) => (
              <li key={label} className="overflow-hidden border-b border-border">
                <a
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={href}
                  onClick={() => setOpen(false)}
                  style={{ transitionDelay: open ? `${80 + i * 60}ms` : "0ms" }}
                  className={`flex items-baseline justify-between py-5 text-title font-black transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                    open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                >
                  {label}
                  <span className="text-lead text-accent">↗</span>
                </a>
              </li>
            ))}
          </ul>

          {/* Templates + contact sit at the foot, deliberately subordinate. */}
          <div className="flex items-end justify-between">
            <Link
              href="/templates"
              onClick={() => setOpen(false)}
              className="bg-accent px-4 py-2.5 font-mono text-label font-medium text-accent-ink press-hover-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              Templates ↗
            </Link>
            <a
              href="mailto:aguralog@gmail.com"
              onClick={() => setOpen(false)}
              className="font-mono text-label text-muted transition-colors hover:text-ink"
            >
              aguralog@gmail.com
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
