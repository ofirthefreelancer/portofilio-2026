import Link from "next/link";

const SECTIONS: [string, string][] = [
  ["Work", "#work"],
  ["About", "#about"],
  ["Contact", "#contact"],
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-bg/85 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between gap-3 border-b-2 border-ink px-5 sm:px-8">
        <Link
          href="/"
          className="font-extrabold uppercase tracking-[-0.01em]"
          aria-label="Ofir Cohen, home"
        >
          <span className="sm:hidden">OC</span>
          <span className="hidden text-[15px] sm:inline">Ofir Cohen</span>
        </Link>
        <nav className="flex items-center gap-4 text-[13px] sm:gap-7 sm:text-[14px]">
          {SECTIONS.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="text-muted transition-colors hover:text-ink"
            >
              {label}
            </a>
          ))}
          {/* Templates demoted to a single header link */}
          <Link
            href="/templates"
            className="bg-accent px-3 py-2 font-mono text-[12px] font-medium text-accent-ink press-hover-ink sm:px-4 sm:text-[13px]"
          >
            Templates ↗
          </Link>
        </nav>
      </div>
    </header>
  );
}
