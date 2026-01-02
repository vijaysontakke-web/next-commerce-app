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
            stringArrayThreshold: 0.5, // Reduced from 0.75 for better performance
            splitStrings: true,
            stringArrayEncoding: ["base64"], // More efficient than multiple encodings
            debugProtection: true,
            debugProtectionInterval: 10000, // Increased interval to reduce runtime overhead
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
