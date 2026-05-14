/** @type {import('next').NextConfig} */
const nextConfig = {
  // برای پشتیبانی از bodyهای بزرگتر (اختیاری)
  experimental: {
    middlewareBodySizeLimit: '10mb'
  }
}

module.exports = nextConfig
