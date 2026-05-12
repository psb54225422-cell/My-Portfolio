/** @type {import('next').NextConfig} */
import { join } from 'node:path'

const nextConfig = {
  outputFileTracingRoot: join(process.cwd(), '..'),
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
