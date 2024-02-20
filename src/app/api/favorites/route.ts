import { NextResponse } from "next/server";
import prisma from "@/helpers/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

// 즐겨찾기 가져오기
// GET 요청 처리
export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    // console.log('favorites_currentUser', currentUser);
    
    let query: any = {};
    
    if (currentUser?.id) {
      query.userId = currentUser.id;
    }

    if (currentUser?.favoriteIds) {
      const user = await prisma.user.findUnique({
        where: { id: currentUser.id },
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
      currentUser,
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