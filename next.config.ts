import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: false,
    experimental: {
        serverActions: {
            bodySizeLimit: "20mb",
        },
    },
};

export default nextConfig;
