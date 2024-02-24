import prisma from "@/helpers/prismadb";
import { getSession } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";

// 즐겨찾기 가져오기
// GET 요청 처리
export default async function handler(req:any, res:any) {
  // 요청이 GET 메소드일 때만 처리
  if (req.method === 'GET') {
    try {
      const currentSession = await getSession();
      if (!currentSession || !currentSession.user || typeof currentSession.user.id !== 'string') {
        // 로그인되지 않은 경우 에러 응답
        return res.status(401).json({ message: 'Unauthorized' });
      }
      console.log('favorites_currentSession', currentSession);
      
      let query: any = {};
      
      if (currentSession?.user?.id) {
        query.userId = currentSession.user.id;
      }

      if (currentSession?.user?.favoriteIds) {
        const user = await prisma.user.findUnique({
          where: { id: currentSession.user.id },
          select: { favoriteIds: true }
        });

        if (user) {
          query.stockId = { in: user.favoriteIds };
        }
      }

      console.log('query', query);
      const favorites = await prisma.favorite.findMany({
        where: query,
        orderBy: {
          createdAt: 'desc'
        },
      });

      const totalItems = await prisma.favorite.count({
        where: query
      });

      const resultData = {
        data: favorites,
        currentSession,
        totalItems
      };

      console.log('favorites_route_resultData: ', resultData);

      // 성공적인 응답 반환
      return NextResponse.json({ resultData });
    } catch (error) {
      // 오류 처리
      console.error('Error fetching favorites:', error);
      return NextResponse.json({ error: 'Error fetching favorites' });
    }
  }
}