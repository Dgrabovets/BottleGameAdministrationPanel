/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "t.me",
      },
      {
        protocol: "https",
        hostname: "telegram.org",
      },
      {
        protocol: "https",
        hostname: "**.telegram.org",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "connect-src 'self'",
              "base-uri 'self'",
              "form-action 'self'",
              "font-src 'self' data:",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },

  async rewrites() {
    if (process.env.NODE_ENV !== "development") {
      return [];
    }

    const devApiTarget =
      process.env.DEV_API_REWRITE_TARGET || "https://127.0.0.1:6001";

    return [
      {
        source: "/dev-api/:path*",
        destination: `${devApiTarget}/:path*`,
      },
    ];
  },
};

export default nextConfig;
