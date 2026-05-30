import type { NextConfig } from "next";

// On GitHub Pages this is served from https://<user>.github.io/portofilio-2026/,
// so a base path is required. The deploy workflow sets PAGES_BASE_PATH; local
// dev/build leaves it unset and serves from the root.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
