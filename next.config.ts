import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
