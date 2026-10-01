import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [70, 90, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "8brkwckz0zwemks0.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
