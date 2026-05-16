/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Booking.com hotel photo CDN
      { protocol: 'https', hostname: 'cf.bstatic.com' },
      { protocol: 'https', hostname: 'q-xx.bstatic.com' },
    ],
  },
};

module.exports = nextConfig;
