import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    proxyClientMaxBodySize: "50mb",
  },
  serverExternalPackages: ['pdf-parse'],
};

export default nextConfig;
