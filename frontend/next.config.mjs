/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      },
      {
        protocol: "http",
        hostname: "*",
        port: "",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*", // Локальный путь
        destination: "https://127.0.0.1:6001/:path*",
      },
    ];
  },
};

export default nextConfig;
