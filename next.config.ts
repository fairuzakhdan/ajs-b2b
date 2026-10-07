import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Placeholder produk menggunakan SVG — izinkan next/image merender SVG lokal.
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
