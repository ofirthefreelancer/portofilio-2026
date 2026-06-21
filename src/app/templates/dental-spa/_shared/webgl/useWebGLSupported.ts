"use client";

import { useEffect, useState } from "react";

/**
 * True once we've confirmed (client-side) that a WebGL context can be created.
 * Starts false so the canvas never mounts on the server or before the check —
 * which keeps a context-creation failure from ever throwing into render.
 */
export function useWebGLSupported(): boolean {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") || canvas.getContext("webgl");
      setOk(!!gl);
    } catch {
      setOk(false);
    }
  }, []);

  return ok;
}
