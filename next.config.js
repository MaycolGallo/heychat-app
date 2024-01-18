/** @type {import('next').NextConfig} */
const nextConfig = {
  logging:{
    fetches:{
      fullUrl: true
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.com",
      },
      {
        protocol: "https",
        hostname: "**.es",
      },
    ],
  },
};

module.exports = nextConfig;
