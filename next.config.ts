import type { NextConfig } from "next";
import JavaScriptObfuscator from "webpack-obfuscator";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.plugins.push(
        new JavaScriptObfuscator(
          {
            rotateStringArray: true,
            stringArray: true,
            stringArrayThreshold: 0.75,
            debugProtection: true,
            debugProtectionInterval: 4000,
            disableConsoleOutput: true,
          },
          []
        )
      );
    }
    return config;
  },
};

export default nextConfig;
