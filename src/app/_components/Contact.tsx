const LINKS: [string, string][] = [
  ["Email", "mailto:aguralog@gmail.com"],
  ["GitHub", "https://github.com"],
  ["X", "https://x.com"],
];

export function Contact() {
  return (
    <footer id="contact" className="mx-auto max-w-[1180px] px-5 sm:px-8">
      <div className="border-t-2 border-ink pb-12 pt-16">
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[12ch] text-[clamp(36px,6vw,72px)] font-black leading-[0.92] tracking-[-0.04em]">
            Let&rsquo;s build something{" "}
            <span className="text-accent">sharp</span>.
          </p>
          <nav className="flex flex-col gap-2.5 font-mono text-[15px]">
            {LINKS.map(([label, href]) => {
              const external = href.startsWith("http");
              return (
              <a
                key={label}
                href={href}
                {...(external && { target: "_blank", rel: "noreferrer" })}
                className="group flex items-center gap-3 text-muted transition-colors hover:text-ink"
              >
                <span className="text-accent">↗</span>
                <span className="border-b border-transparent group-hover:border-ink">
                  {label}
                </span>
              </a>
              );
            })}
          </nav>
        </div>
        <div className="mt-16 flex justify-between font-mono text-[12px] text-dim">
          <span>Ofir Cohen · 2026</span>
          <span>built with intent</span>
        </div>
      </div>
    </footer>
  );
}
