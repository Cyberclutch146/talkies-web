import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/achievements",
        destination: "/acheivements",
        permanent: true,
      },
      {
        source: "/achievements/:path*",
        destination: "/acheivements/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/achievements",
        destination: "/api/acheivements",
      },
      {
        source: "/api/achievements/:path*",
        destination: "/api/acheivements/:path*",
      },
    ];
  },
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
