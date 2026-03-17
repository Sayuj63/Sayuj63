import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "marktaleevents.com",
      },
      {
        protocol: "http",
        hostname: "marktaleevents.com",
      },
    ],
  },
};
export default nextConfig;