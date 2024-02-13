import prisma from "@/helpers/prismadb";
import { getSession } from "@/app/actions/getCurrentUser";
import { FavoritesData } from "@/app/actions/getFavorites";

export default async function getSellStocks(): Promise<FavoritesData> {

  const currentSession = await getSession();
  // console.log('sellStocks_currentSession', currentSession);

  try {
    
    let query: any = {};
         
    if (currentSession?.user?.id) {
      // 현재 사용자의 ID로 favorite 테이블에서 해당 사용자의 데이터만 가져옵니다.
      query.userId = currentSession.user.id;
    }

    if (currentSession?.user?.favoriteIds) {
      // 사용자 ID로 사용자의 favoriteIds 필드에 포함된 주식만 가져오도록 수정
      const user = await prisma.user.findUnique({
        where: { id: currentSession.user.id },
        select: { favoriteIds: true }
      });

      if (user) {
        query.stockId = { in: user.favoriteIds };
      }
    }   

    // 테이블의 데이터를 여러개 가져올 때 findMany() 사용    
    const favorites = await prisma.favorite.findMany({
      where: query,
      orderBy: {
        createdAt: 'desc'
      },
    })

    const newFavorites = favorites.filter(favorite => {
      if (favorite.price !== null && favorite.price > 0 && favorite.desired_selling_price !== null && favorite.desired_selling_price > 0) {
        // favorite.price가 favorite.desired_selling_price보다 크거나 같은지를 체크하여 필터링
        return favorite.price >= favorite.desired_selling_price;
      }
      return false;
    });
    
    const totalItems = await prisma.favorite.count({
      where: query
    });
    
    return {
      data: newFavorites,
      currentSession,
      totalItems
    }

  } catch (error: any) {
    throw new Error(error);
  }
}