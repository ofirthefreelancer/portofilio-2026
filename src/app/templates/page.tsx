import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Templates — Ofir Cohen",
  description: "Free, deploy-ready AI SaaS templates.",
};

export default function Templates() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[1180px] flex-col justify-center px-5 sm:px-8">
      <Link
        href="/"
        className="mb-8 font-mono text-[13px] text-dim transition-colors hover:text-ink"
      >
        ← back
      </Link>
      <h1 className="text-[clamp(44px,9vw,104px)] font-black leading-[0.9] tracking-[-0.045em]">
        Templates <span className="text-accent">soon</span>.
      </h1>
      <p className="mt-8 max-w-[52ch] font-mono text-[14px] leading-relaxed text-muted">
        {"// "}Free, deploy-ready AI SaaS starters are on the way. The portfolio
        comes first.
      </p>
    </main>
  );
}
