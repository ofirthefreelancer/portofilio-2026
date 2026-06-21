"use client";

import { Component, type ReactNode } from "react";

/**
 * The WebGL accents are decorative. If a visitor's browser can't create a GL
 * context (no GPU, blocked, headless), three throws — without this boundary it
 * surfaces as an unhandled rejection and can take the section down. Here we
 * swallow it and fall back to a quiet static layer, so the page stays whole.
 */
export class WebGLBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    /* decorative — intentionally swallowed */
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}
