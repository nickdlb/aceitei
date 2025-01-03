import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['nokrffogsfxouxzrrkdp.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nokrffogsfxouxzrrkdp.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/images/**',
      },
    ],
  },
};

export default nextConfig;
