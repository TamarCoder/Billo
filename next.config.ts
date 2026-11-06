import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build plain HTML/JS into ./out. Electron loads these files.
  output: "export",
  // Static export has no image server.
  images: { unoptimized: true },
  // Every route becomes folder/index.html. The Electron protocol handler expects this.
  trailingSlash: true,
};

export default nextConfig;
