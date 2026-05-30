"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/lib/useInView";
import { useReducedMotion } from "@/lib/useReducedMotion";

const ANSWER =
  "Refunds post to the original card in 3-5 business days. I can start one now — want me to?";
const FULL_WORDS = ANSWER.split(" ");

/**
 * Nimbus — streaming AI copilot. A live token stream: the assistant answer
 * types in word-by-word on a loop, with a measured first-token readout.
 * The preview IS the product (sub-100ms streaming, zero layout shift).
 */
export function NimbusPreview() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (reduced) return;
    if (!inView) {
      if (timer.current) clearTimeout(timer.current);
      return;
    }
    let n = 0;
    const tick = () => {
      n++;
      setCount(n);
      if (n < FULL_WORDS.length) {
        timer.current = setTimeout(tick, 95 + Math.random() * 70);
      } else {
        timer.current = setTimeout(() => {
          setCount(0);
          n = 0;
          timer.current = setTimeout(tick, 700);
        }, 2400);
      }
    };
    timer.current = setTimeout(tick, 500);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [inView, reduced]);

  const shown = reduced ? FULL_WORDS.length : count;
  const streaming = !reduced && count > 0 && count < FULL_WORDS.length;

  return (
    <div
      ref={ref}
      className="flex h-full w-full flex-col bg-surface font-mono text-[12px]"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5 text-dim">
        <span className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 bg-accent" /> nimbus · assistant
        </span>
        <span>40k docs</span>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-4 py-4 leading-relaxed">
        <div className="self-end max-w-[78%] bg-ink px-3 py-1.5 text-bg">
          how long do refunds take?
        </div>
        <div className="max-w-[88%] text-ink">
          {FULL_WORDS.slice(0, shown).join(" ")}
          {streaming && (
            <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-accent" />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border px-4 py-2 text-dim">
        <span>first token <span className="text-accent">92ms</span></span>
        <span>0 CLS</span>
      </div>
    </div>
  );
}
