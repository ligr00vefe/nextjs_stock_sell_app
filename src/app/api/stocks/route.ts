import { NextResponse } from "next/server";

import prisma from "@/helpers/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { useSession } from "next-auth/react";

export async function POST(
    request: Request
  ) {

  const currentUser1 = await getCurrentUser();
  const currentUser2 = useSession();
  console.log('stocks_currentUser1: ', currentUser1);
  console.log('stocks_currentUser2: ', currentUser2);

  // 로그인 정보가 없으면 에러 출력
  if (!currentUser1) {
    return NextResponse.error();
  }

  const body = await request.json();

  const {
    symbol,
    company,
    currency,
    price
  } = body;
  console.log('stocks_body: ', body);

  // body에 값이 하나라도 없으면 에러 호출
  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });

  // 주식이 이미 존재하는지 확인
  const existingStock = await prisma.stock.findFirst({
    where: {
        symbol: symbol,
        userId: currentUser1.id
    }
  });

  if (existingStock) {
       // 이미 존재하는 경우 해당 주식을 업데이트
       const updatedStock = await prisma.stock.update({
        where: { id: existingStock.id },
        data: {
            company,
            currency,
            price: Number(price),
        }
    });

    return NextResponse.json(updatedStock);
  } else {
      // 존재하지 않는 경우 새로운 주식 생성
      const newStock = await prisma.stock.create({
          data: {
              symbol,
              company,
              currency,
              price: Number(price),
              userId: currentUser1.id,
          }
      });

      return NextResponse.json(newStock);
  }
}