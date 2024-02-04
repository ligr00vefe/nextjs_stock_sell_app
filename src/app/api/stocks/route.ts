import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/helpers/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getStocks from '@/app/actions/getStocks';

// GET 요청 처리
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 데이터 가져오기
    const stocks = await getStocks();
    const currentUser = await getCurrentUser();

    // 성공적인 응답 반환
    res.status(200).json({ stocks, currentUser });
  } catch (error) {
    // 오류 처리
    res.status(500).json({ error: 'Error fetching stocks' });
  }
}

// POST 요청 처리
export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 현재 사용자 가져오기
    const currentUser = await getCurrentUser();

    // 요청에서 데이터 추출
    const { symbol, company, currency, price } = req.body;

    // 새로운 주식 생성
    const newStock = await prisma.stock.create({
      data: {
        symbol,
        company,
        currency,
        price: Number(price),
        userId: currentUser!.id,
      }
    });

    // 성공적인 응답 반환
    res.status(201).json({ newStock, currentUser });
  } catch (error) {
    // 오류 처리
    res.status(500).json({ error: 'Error creating new stock' });
  }
}
