// Static-export asset URLs. On GitHub Pages the site is served under a base
// path (e.g. /portofilio-2026), but raw <video>/<img> string srcs don't get
// Next's basePath prepended the way next/image does — so plain public assets
// 404 there. Prefix them through here. Local dev/build leaves the var unset.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Resolve a path under /public to a basePath-aware URL. */
export function asset(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${BASE}${clean}`;
}
