// pages/api/favorites.ts
import { NextApiRequest, NextApiResponse } from 'next';
import getFavorites from '@/app/actions/getFavorites';
import getCurrentUser from '@/app/actions/getCurrentUser';
import { IStocksParams } from '@/app/actions/getFavorites';


export default async function favoritesHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 여기에 데이터를 가져오는 로직을 구현
    const searchParams: IStocksParams = {
      symbol: req.query.symbol as string,
      company: req.query.company as string,
      currency: req.query.currency as string,
      price: typeof req.query.price === 'string' ? Number(req.query.price) : null,
      desired_selling_price: typeof req.query.desired_selling_price === 'string' ? Number(req.query.desired_selling_price) : null,
      userId: req.query.userId as string,
      stockId: req.query.stockId as string
    };

    const stocks = await getFavorites(searchParams);
    const currentUser = await getCurrentUser();

    // 데이터를 클라이언트에 반환
    res.status(200).json({ stocks, currentUser });
  } catch (error) {
    // 에러가 발생한 경우 처리
    console.error('Error in fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
}