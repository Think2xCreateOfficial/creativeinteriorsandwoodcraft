import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [480, 768, 1024, 1440, 1920, 2560],
    qualities: [75, 78, 80, 82, 84, 88, 90, 95, 100],
  },
};

export default nextConfig;
