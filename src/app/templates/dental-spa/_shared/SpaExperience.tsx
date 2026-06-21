import Link from "next/link";
import { Sanctuary } from "./Sanctuary";
import { MascotJourney } from "./MascotJourney";
import { SignatureMenu } from "./SignatureMenu";
import { BookAppointment } from "./BookAppointment";
import { THEME } from "./theme";

/**
 * Assembles the five-section Dental Spa page. The scope class (.spa-root
 * .spa-light) is applied by the route page, so this stays a plain server
 * component handing the (serializable) theme down to the islands.
 */
export function SpaExperience() {
  const theme = THEME;

  return (
    <>
      {/* Quiet top bar — sits over the hero on the page background */}
      <header className="absolute inset-x-0 top-0 z-40 flex items-center justify-between px-[var(--spacing-gutter)] py-5 text-[var(--spa-ink)]">
        <span className="font-semibold tracking-[-0.02em]" style={{ fontSize: "1.125rem" }}>
          Almond Whitening <span className="font-normal opacity-70">Bali</span>
        </span>
        <nav className="flex items-center gap-5 text-[0.9375rem]">
          <Link
            href="/templates"
            className="hidden opacity-70 transition-opacity hover:opacity-100 sm:inline"
          >
            ← Templates
          </Link>
          <a
            href="#spa-book"
            className="spa-cta-ghost px-4 py-2 font-medium transition-colors duration-200"
          >
            Book
          </a>
        </nav>
      </header>

      <main>
        <Sanctuary theme={theme} />
        <MascotJourney theme={theme} />
        <SignatureMenu />
        <BookAppointment />
      </main>

      <footer className="border-t px-[var(--spacing-gutter)] py-10" style={{ borderColor: "var(--spa-line)" }}>
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <span className="font-semibold tracking-[-0.02em]">Almond Whitening Studio</span>
          <p className="text-[0.875rem]" style={{ color: "var(--spa-ink-soft)" }}>
            Template · {theme.label} · {theme.tagline}
          </p>
        </div>
      </footer>
    </>
  );
}
