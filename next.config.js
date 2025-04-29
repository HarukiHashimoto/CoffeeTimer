const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/middleware-manifest\.json$/],
  fallbacks: {
    // フォントのフォールバック
    font: '/static/fonts/fallback.woff2',
    // 画像のフォールバック
    image: '/static/images/fallback.png',
    // 音声のフォールバック
    audio: false,
    // 動画のフォールバック
    video: false,
    // ドキュメントのフォールバック
    document: false,
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
