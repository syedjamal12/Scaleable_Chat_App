import { Flashlight } from "lucide-react";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode:false,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  /* config options here */
};

export default nextConfig;
