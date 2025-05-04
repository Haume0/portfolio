import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  // Optional: Configure the base path if your site will be hosted in a subdirectory
  // basePath: '/your-base-path',
  // Optional: Disable image optimization for static exports
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
