import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work — Ofir Cohen",
  description: "Selected work.",
};

export default function Work() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[1180px] flex-col justify-center px-5 py-24 sm:px-8">
      <Link
        href="/"
        className="mb-8 font-mono text-[13px] text-dim transition-colors hover:text-ink"
      >
        ← back
      </Link>
      <h1 className="text-[clamp(44px,9vw,104px)] font-black leading-[0.9] tracking-[-0.045em]">
        Work.
      </h1>
      <p className="mt-8 max-w-[52ch] font-mono text-[14px] leading-relaxed text-muted">
        {"// "}Selected work, built to be experienced.
      </p>

      <Link
        href="/templates/dental-spa"
        target="_blank"
        rel="noopener noreferrer"
        className="press-hover-2 mt-12 flex max-w-2xl items-center justify-between border-2 border-ink bg-surface p-6 transition-transform sm:p-8"
      >
        <span>
          <span className="block text-[clamp(20px,3vw,28px)] font-bold tracking-[-0.02em]">
            Whitening Studio
          </span>
          <span className="mt-1 block font-mono text-[13px] text-muted">
            {"// "}GSAP scroll · WebGL · animated mascot
          </span>
        </span>
        <span className="ml-6 font-mono text-[13px] text-accent-2">View ↗</span>
      </Link>
    </main>
  );
}
