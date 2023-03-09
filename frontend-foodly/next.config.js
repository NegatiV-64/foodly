/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: false,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'localhost',
      }
    ]
  }
};

module.exports = nextConfig;
