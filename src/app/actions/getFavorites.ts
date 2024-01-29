import prisma from "@/helpers/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export interface IStocksParams {
  symbol?: string;
  company?: string;
  currency?: string;
  price: number | null;
  desired_selling_price: number | null;
  userId?: string;
  stockId?: string;
}

export default async function getFavorites(params: IStocksParams) {

  const currentUser = await getCurrentUser();

  try {

    const { symbol, currency, company, price, desired_selling_price } = params
    
    let query: any = {};
    
    if (currentUser?.favoriteIds) {
      // 사용자 ID로 사용자의 favoriteIds 필드에 포함된 주식만 가져오도록 수정
      const user = await prisma.user.findUnique({
        where: { id: currentUser.id },
        select: { favoriteIds: true }
      });

      if (user) {
        query.stockId = { in: user.favoriteIds };
      }
    }
    
    if (currentUser?.id) {
      // 현재 사용자의 ID로 favorite 테이블에서 해당 사용자의 데이터만 가져옵니다.
      query.userId = currentUser.id;
    }

    // totalItems 전체 아이템 개수
    const totalItems = await prisma.favorite.count({
      where: query
    });

    // 테이블의 데이터를 여러개 가져올 때 findMany() 사용    
    const favorite = await prisma.favorite.findMany({
      where: query,
      orderBy: {
        createdAt: 'desc'
      },
    })

    return {
      data: favorite,
      totalItems
    }

  } catch (error: any) {
    throw new Error(error);
  }
}