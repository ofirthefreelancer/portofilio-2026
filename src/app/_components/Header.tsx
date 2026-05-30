import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-bg/85 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between border-b-2 border-ink px-5 sm:px-8">
        <Link
          href="/"
          className="text-[15px] font-extrabold uppercase tracking-[-0.01em]"
        >
          Ofir Cohen
        </Link>
        <nav className="flex items-center gap-5 text-[14px] sm:gap-7">
          <a href="#work" className="hidden text-muted transition-colors hover:text-ink sm:inline">
            Work
          </a>
          <a href="#about" className="hidden text-muted transition-colors hover:text-ink sm:inline">
            About
          </a>
          <a href="#contact" className="hidden text-muted transition-colors hover:text-ink sm:inline">
            Contact
          </a>
          {/* Templates demoted to a single header link */}
          <Link
            href="/templates"
            className="bg-accent px-4 py-2 font-mono text-[13px] font-medium text-accent-ink press-hover-ink"
          >
            Templates ↗
          </Link>
        </nav>
      </div>
    </header>
  );
}
