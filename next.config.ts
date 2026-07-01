import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  serverExternalPackages: ["bcryptjs", "@libsql/client"],
}

export default nextConfig
