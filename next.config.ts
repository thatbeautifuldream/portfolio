import type { NextConfig } from "next";
const config: NextConfig = {
  output: "export",
  agentRules: false,
  experimental: { globalNotFound: true },
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: false,
};
export default config;
