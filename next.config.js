/** @type {import('next').NextConfig} */
const nextConfig = {
  // 필요한 다른 구성 옵션들
  reactStrictMode: true,
  env: {
      NEXT_URL: process.env.NEXT_PUBLIC_URL
    }
}


module.exports = nextConfig;
