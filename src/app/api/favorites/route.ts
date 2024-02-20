import { NextResponse } from "next/server";
import prisma from "@/helpers/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

// 즐겨찾기 가져오기
// GET 요청 처리
export async function GET() {
  try {
    const currentSession = await getServerSession(authOptions);
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