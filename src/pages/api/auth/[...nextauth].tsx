import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

// const prisma = new PrismaClient()
import prisma from "@/helpers/prismadb"

export const authOptions: NextAuthOptions = { 
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET! 
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text"},
        password: { label: "Password", type: "password" }
      },

      // credentials는 CredentialsProvider를 통해서 이메일, 패스워드로 입력 받은 값을 말한다.
      async authorize(credentials, req) {

        // credentials에 이메일 값이 없거나 패스워드 값이 없는 경우 error message 출력
        if(!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        // user를 찾는 부분
        // prisma 인스턴스 객체를 통해 db에 credentials로 받은 이메일 값과 일치하는 데이터가 있는지 확인 
        const user = await prisma.user.findUnique({
          // 찾을 컬럼 선택
          where: {
            email: credentials.email,
          }
        })

        // user가 없거나 user가 있는데 해쉬된 비밀번호가 없는 경우 error message 출력
        if(!user || !user?.hashedPassword) {
          // 아이디가 존재하지 않거나 비밀번호가 존재하지 않을 경우
		      // 소셜로그인 데이터일 경우 hashedPassword가 없기 때문에 수정이 필요함.
          throw new Error('아이디가 존재하지 않습니다.');
        }
        
        // 비밀번호 체크 - compare 매개변수 2개(pure 비밀번호, 해쉬된 비밀번호)를 입력하면 일치하는지 여부확인 해준다.
        // credentials를 통해 입력된 순수 비밀번호와 db에 등록된 해쉬 비밀번호를 비교해서 일치 여부를 알려준다. 
        const isCorrectPassword = await bcrypt.compare(
         credentials.password,
         user.hashedPassword
        )

        // pure 패스워드와 해쉬된 비밀번호가 일치하지 않을 때 error message 출력
        if(!isCorrectPassword) {
          throw new Error('비밀번호가 일치하지 않습니다.');
        }

        return user;
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  jwt: {    
    secret: process.env.JWT_SECRET,
    // 유효기간(30 days)
    maxAge: 30 * 24 * 60 * 60
  },
  pages: {
    // 로그인 페이지 경로 지정
    signIn: '/auth/login'
  },
  callbacks: {
    async jwt({ token, user}) {
      // console.log('token', token);
      // console.log('user', user);
      return { ...token, ...user }
    },
    async session({ session, token }) {
      // console.log('@', session, token);

      session.user = token;
      return session;
    }
  }
}

export default NextAuth(authOptions);