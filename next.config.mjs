import { execSync } from "child_process"
import { withContentCollections } from "@content-collections/next"

const commitHash = execSync("git rev-parse HEAD").toString().trim()

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_COMMIT_SHA: commitHash,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "abs.twimg.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.microlink.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "iad.microlink.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/whatsapp",
        destination: "https://wa.me/919631333128",
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: "/resume",
        destination:
          "https://cdn.jsdelivr.net/gh/thatbeautifuldream/resume-tex/resume.pdf",
      },
      {
        source: "/merlin",
        destination:
          "https://www.getmerlin.in",
      },
    ]
  },
}

export default withContentCollections(nextConfig)
