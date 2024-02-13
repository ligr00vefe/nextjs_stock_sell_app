import { NextResponse } from 'next/server';
import getSellStocks from '@/app/actions/getSellStocks';

// GET 요청 처리
export async function GET() {
  try {
    // 데이터 가져오기
    const resultData = await getSellStocks();
    console.log('sellStocks_route_resultData: ', resultData);
    console.log('sellStocks_route_resultData.data: ', resultData.data);
    console.log('sellStocks_route_resultData.currentSession: ', resultData.currentSession);
    console.log('sellStocks_route_resultData.totalItems: ', resultData.totalItems);

    // 성공적인 응답 반환
    return NextResponse.json({ resultData });
  } catch (error) {
    // 오류 처리
    return NextResponse.json({ error: 'Error fetching stocks' });
  }
}