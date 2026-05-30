"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Gate expensive animation work to when the element is on screen.
 * Continuous (not once): canvases pause when scrolled away, resume on return.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  margin = "0px 0px -10% 0px"
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: margin, threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);

  return [ref, inView] as const;
}
