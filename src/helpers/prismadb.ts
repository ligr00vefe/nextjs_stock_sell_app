import { PrismaClient } from "@prisma/client";

// 타입스크립트를 위한 선언부
declare global {
	// 인스턴스에 데이터가 할당되면 PrismaClient 타입을 받지만 할당받기 전에는 타입이 undefined가 되어야함.
  var prisma: PrismaClient | undefined;
}

// globalThis에 prisma 인스턴스 객체가 있거나 없으면 새로 PrismaClient에서 인스턴스 객체를 생성함.
const client = globalThis.prisma || new PrismaClient();

// development 환경에서만 동작하도록 조건처리
if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;

// 이 코드는 서버가 시작하는 부분에 위치해야 합니다.
if (process.env.NODE_ENV === "development") {
  process.env.NEXTAUTH_URL = "http://localhost:3000";
} else {
  process.env.NEXTAUTH_URL = "https://your-production-url.com";
}

export default client