import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  serverExternalPackages: ["bcryptjs"],
}

export default nextConfig
