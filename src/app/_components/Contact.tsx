const LINKS: [string, string][] = [
  ["Email", "mailto:aguralog@gmail.com"],
  ["GitHub", "https://github.com"],
  ["X", "https://x.com"],
];

export function Contact() {
  return (
    <footer id="contact" className="flex min-h-screen items-center bg-surface-2">
      <div className="mx-auto w-full max-w-[1180px] px-gutter">
        <div className="border-t-2 border-ink pb-12 pt-16">
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[12ch] text-title font-black">
            Let&rsquo;s build something{" "}
            <span className="text-accent">sharp</span>.
          </p>
          <nav className="flex flex-col gap-2.5 font-mono text-body">
            {LINKS.map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="group flex items-center gap-3 text-muted transition-colors hover:text-ink"
              >
                <span className="text-accent">↗</span>
                <span className="border-b border-transparent group-hover:border-ink">
                  {label}
                </span>
              </a>
            ))}
          </nav>
        </div>
          <div className="mt-16 flex justify-between font-mono text-label tabular-nums text-dim">
            <span>Ofir Cohen, 2026</span>
            <span>built with intent</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
