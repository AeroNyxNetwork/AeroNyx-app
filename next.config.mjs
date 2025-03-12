/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['imagedelivery.net'],
  },
  output: 'standalone',
};

export default nextConfig;
