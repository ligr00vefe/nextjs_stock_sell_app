import prisma from "@/helpers/prismadb";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Favorite } from "@prisma/client";
import { Session, getServerSession } from "next-auth";
import { getSession } from "next-auth/react";

export interface IStocksParams {
  symbol?: string;
  company?: string;
  currency?: string;
  price: number | null;
  desired_selling_price: number | null;
  userId?: string;
  stockId?: string;
}

export interface FavoritesData {
  data: Favorite[] | null;
  currentSession: Session | null;
  totalItems: number;
}

export default async function getFavorites(): Promise<FavoritesData> {

  const currentSession = await getServerSession(authOptions);
  console.log('favorites_currentSession', currentSession);
  
  try {
     
    let query: any = {};
    
    if (currentSession?.user?.id) {
      // 현재 사용자의 ID로 favorite 테이블에서 해당 사용자의 데이터만 가져옵니다.
      query.userId = currentSession.user.id;
      // console.log('query', query);
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
      // console.log('query', query);
    }

    // 테이블의 데이터를 여러개 가져올 때 findMany() 사용    
    const favorites = await prisma.favorite.findMany({
      where: query,
      orderBy: {
        createdAt: 'desc'
      },
    })

    // console.log('favorites_all', favorites);

    // totalItems 전체 아이템 개수
    const totalItems = await prisma.favorite.count({
      where: query
    });

    return {
      data: favorites,
      currentSession,
      totalItems
    }

  } catch (error: any) {
    throw new Error(error);
  }
}