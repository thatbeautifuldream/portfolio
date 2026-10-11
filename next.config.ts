import type { NextConfig } from "next";
import { headers, redirects, rewrites } from "./src/lib/routing";
const config: NextConfig = {
  agentRules: false,
  experimental: { globalNotFound: true },
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingIncludes: {
    "/*": [
      "./.generated/content.json",
      "./.generated/images.json",
      "./src/assets/fonts/*.ttf",
    ],
  },
  headers,
  redirects,
  rewrites,
};
export default config;
