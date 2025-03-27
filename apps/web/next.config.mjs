/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],

  images: {
    remotePatterns: [
      {
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
