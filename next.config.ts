import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://marshal-lms-ali.t3.storage.dev/**')],
  },
};

export default nextConfig;
