import prisma from "@/helpers/prismadb";

export interface IStocksParams {
  symbol?: string;
  company?: string;
  currency?: string;
  price: number;
  desired_selling_price: number;
  userId?: string;
  stockId?: string;
}

export default async function getStocks(params: IStocksParams) {

  try {

    const { symbol, currency, company, price, desired_selling_price } = params
    
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