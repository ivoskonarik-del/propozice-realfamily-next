import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/propozice-realfamily-next',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
