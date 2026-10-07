import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "codequest.ucscieee.lk",
        pathname: "/_next/static/media/**",
      },
    ],
  },
};

export default nextConfig;
