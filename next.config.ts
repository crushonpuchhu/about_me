import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Allow dev server access from other machines on the LAN (HMR + /_next assets).
  allowedDevOrigins: ["10.88.207.92"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
