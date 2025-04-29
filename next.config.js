const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/middleware-manifest\.json$/],
  fallbacks: {
    document: false,
    image: false,
    font: false,
    audio: false,
    video: false
  }
})

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

module.exports = withPWA(nextConfig)
