import prisma from "@/helpers/prismadb";
import { Stock, User } from "@prisma/client";
import getCurrentUser from "./getCurrentUser";

export interface StocksData {
  data: Stock[] | null;
  currentUser: User | null;
  totalItems: number;
}

export default async function getStocks(): Promise<StocksData> {

  const currentUser = await getCurrentUser();

  try {
   
    let query: any = {};  

    // totalItems 전체 아이템 개수
    const totalItems = await prisma.stock.count({
      where: query
    });

    // 테이블의 데이터를 여러개 가져올 때 findMany() 사용    
    const stock = await prisma.stock.findMany({
      where: query,
      orderBy: {
        createdAt: 'desc'
      },
    })

    return {
      data: stock,
      currentUser,
      totalItems
    }

  } catch (error: any) {
    throw new Error(error);
  }
}