/** @type {import('next').NextConfig} */
const nextConfig = {
  // 필요한 다른 구성 옵션들
  publicRuntimeConfig: {
    // NEXTAUTH_URL 값을 런타임에서 접근할 수 있게 설정
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
}


module.exports = nextConfig;
