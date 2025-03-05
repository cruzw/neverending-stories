import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kwz3rkbxnu5qcfv7.public.blob.vercel-storage.com',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
