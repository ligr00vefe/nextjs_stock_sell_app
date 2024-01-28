import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/helpers/prismadb";

interface IParams {
  symbol?: string;
}

// 즐겨찾기 가져오기
export async function GET(
  request: Request,
  { params }: { params: IParams }
) {

  const currentUser = await getCurrentUser();

  // 유저 정보가 없으면 error
  if (!currentUser) {
    return NextResponse.error();
  }
  
  const symbol = params;

  // 주식이 이미 존재하는지 확인
  const existingFavorite = await prisma.favorite.findFirst({
    where: {
      symbol: symbol,
      userId: currentUser.id
    }
  });

  return NextResponse.json(existingFavorite);
}