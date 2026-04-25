import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
      },
    ],
  },
  async headers() {
    const rules = []

    // /_next/static caching is handled automatically by Next.js in production.
    // Setting it manually here breaks HMR in dev (browser serves stale bundles).
    // if (process.env.NODE_ENV === 'production') {
    //   rules.push({
    //     source: '/_next/static/(.*)',
    //     headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    //   })
    // }

    rules.push({
      source: '/(.*)\\.(svg|png|jpg|jpeg|gif|ico|woff2|woff)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    })

    return rules
  },
};

export default nextConfig;
