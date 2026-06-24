/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
