"use client";

import { useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { BOOKING, SERVICES } from "./theme";

/**
 * §5 Book an appointment. The page's one real conversion moment, kept calm.
 * Bespoke full-border inputs, a quiet hours/location aside, and a celebratory
 * mascot peek. Submit is a template placeholder (no backend).
 */
export function BookAppointment() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const validateName = (v: string) => (v.trim() ? "" : "Please enter your name.");
  const validateEmail = (v: string) =>
    !v.trim()
      ? "Please enter your email."
      : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
        ? ""
        : "Enter a valid email, like name@studio.com.";

  // Validate on blur; clear a field's error the moment it becomes valid again.
  const onBlurValidate =
    (key: "name" | "email", fn: (v: string) => string) =>
    (e: React.FocusEvent<HTMLInputElement>) =>
      setErrors((p) => ({ ...p, [key]: fn(e.currentTarget.value) || undefined }));
  const onInputClear =
    (key: "name" | "email", fn: (v: string) => string) =>
    (e: React.FormEvent<HTMLInputElement>) => {
      if (errors[key] && !fn(e.currentTarget.value))
        setErrors((p) => ({ ...p, [key]: undefined }));
    };

  const errText = {
    color: "var(--spa-danger)",
    fontSize: "0.8125rem",
    marginTop: "0.375rem",
    fontWeight: 500,
  } as const;

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from("[data-spa-reveal]", {
        y: 26,
        opacity: 0,
        duration: 0.7,
        ease: "expo.out",
        stagger: 0.07,
        scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
      });
    },
    { scope: root, dependencies: [reduced] }
  );

  const field =
    "spa-field w-full border bg-transparent px-4 py-3 text-[1rem] outline-none transition-[border-color,box-shadow] duration-200";
  const fieldStyle = {
    borderColor: "var(--spa-line)",
    borderRadius: "calc(var(--spa-radius) * 0.4)",
    color: "var(--spa-ink)",
  } as const;
  const labelCls = "mb-2 block text-[0.8125rem] font-medium text-[var(--spa-ink-soft)]";

  return (
    <section
      id="spa-book"
      ref={root}
      className="px-[var(--spacing-gutter)] py-[var(--spacing-section)]"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1.3fr_1fr]">
        {/* Form */}
        <div>
          <h2
            data-spa-reveal
            className="font-semibold tracking-[-0.03em]"
            style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", lineHeight: 1 }}
          >
            {BOOKING.heading}
          </h2>
          <p
            data-spa-reveal
            className="mt-4 max-w-[52ch] text-pretty"
            style={{ color: "var(--spa-ink-soft)", fontSize: "1.125rem", lineHeight: 1.6 }}
          >
            {BOOKING.sub}
          </p>

          {sent ? (
            <div
              data-spa-reveal
              className="mt-8 border p-7"
              style={{ borderColor: "var(--spa-accent)", borderRadius: "var(--spa-radius)", background: "var(--spa-surface)" }}
              role="status"
            >
              <p className="font-semibold" style={{ fontSize: "1.25rem" }}>
                Request received.
              </p>
              <p className="mt-2" style={{ color: "var(--spa-ink-soft)" }}>
                We will confirm your time by email within the hour during studio hours.
              </p>
            </div>
          ) : (
            <form
              data-spa-reveal
              noValidate
              className="mt-8 grid gap-5 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const data = new FormData(form);
                const nameErr = validateName(String(data.get("name") ?? ""));
                const emailErr = validateEmail(String(data.get("email") ?? ""));
                if (nameErr || emailErr) {
                  setErrors({ name: nameErr || undefined, email: emailErr || undefined });
                  (
                    form.querySelector(
                      nameErr ? "#b-name" : "#b-email"
                    ) as HTMLElement | null
                  )?.focus();
                  return;
                }
                setErrors({});
                setSent(true);
              }}
            >
              <div className="sm:col-span-2">
                <label htmlFor="b-name" className={labelCls}>Full name</label>
                <input
                  id="b-name"
                  name="name"
                  required
                  className={field}
                  style={fieldStyle}
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "b-name-err" : undefined}
                  onBlur={onBlurValidate("name", validateName)}
                  onInput={onInputClear("name", validateName)}
                />
                {errors.name && (
                  <p id="b-name-err" role="alert" style={errText}>
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="b-email" className={labelCls}>Email</label>
                <input
                  id="b-email"
                  name="email"
                  type="email"
                  required
                  className={field}
                  style={fieldStyle}
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "b-email-err" : undefined}
                  onBlur={onBlurValidate("email", validateEmail)}
                  onInput={onInputClear("email", validateEmail)}
                />
                {errors.email && (
                  <p id="b-email-err" role="alert" style={errText}>
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="b-phone" className={labelCls}>Phone</label>
                <input id="b-phone" name="phone" type="tel" className={field} style={fieldStyle} autoComplete="tel" />
              </div>
              <div>
                <label htmlFor="b-service" className={labelCls}>Service</label>
                <select id="b-service" name="service" className={field} style={fieldStyle} defaultValue={SERVICES[0].name}>
                  {SERVICES.map((s) => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="b-date" className={labelCls}>Preferred date</label>
                <input id="b-date" name="date" type="date" className={field} style={fieldStyle} />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="spa-cta-primary mt-1 inline-flex items-center gap-2 px-7 py-4 font-semibold transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Book appointment
                  <span aria-hidden>→</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Aside: hours + location. */}
        <aside data-spa-reveal className="relative">
          <div
            className="border p-7"
            style={{ borderColor: "var(--spa-line)", borderRadius: "var(--spa-radius)", background: "var(--spa-surface)" }}
          >
            <h3 className="text-[0.8125rem] font-medium uppercase tracking-[0.2em] text-[var(--spa-ink-soft)]">
              Studio hours
            </h3>
            <dl className="mt-4 space-y-2">
              {BOOKING.hours.map(([d, h]) => (
                <div key={d} className="flex justify-between border-b pb-2 text-[1rem]" style={{ borderColor: "var(--spa-line)" }}>
                  <dt style={{ color: "var(--spa-ink-soft)" }}>{d}</dt>
                  <dd className="font-medium">{h}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-[1rem]" style={{ color: "var(--spa-ink-soft)" }}>
              {BOOKING.location}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
