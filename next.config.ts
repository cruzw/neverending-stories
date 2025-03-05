import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '9qpzi4iakq6aikre.public.blob.vercel-storage.com',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
