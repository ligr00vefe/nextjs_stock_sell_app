import prisma from "@/helpers/prismadb";
import { Stock } from "@prisma/client";

interface StocksData {
  data: Stock[];
  totalItems: number;
}

export default async function getStocks(): Promise<StocksData> {

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
      totalItems
    }

  } catch (error: any) {
    throw new Error(error);
  }
}