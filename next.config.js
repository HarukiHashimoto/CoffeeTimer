/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/CoffeeTimer',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
