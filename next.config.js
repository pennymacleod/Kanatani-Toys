/** @type {import('next').NextConfig} */
const { HIDDEN_PAGES } = require('./lib/hidden');
// Unfinished pages are hidden on the live site only (see lib/hidden.js).
const HIDE = process.env.VERCEL_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,
  env: { HIDE_PAGES: HIDE ? '1' : '' },
  async redirects() {
    if (!HIDE) return [];
    return HIDDEN_PAGES.flatMap(p => [
      { source: p, destination: '/', permanent: false },
      { source: `${p}/:path*`, destination: '/', permanent: false },
    ]);
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.squarecdn.com' },
      { protocol: 'https', hostname: '**.squareup.com' },
      { protocol: 'https', hostname: 'items-images-production.s3.us-west-2.amazonaws.com' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
    ],
  },
};

module.exports = nextConfig;
