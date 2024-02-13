import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

// GET 요청 처리
export async function GET() {
  try {
    // 데이터 가져오기
    const currentUser = await getCurrentUser();
    console.log('user_route_currentUser: ', currentUser);

    // 성공적인 응답 반환
    return NextResponse.json({ currentUser });
  } catch (error) {
    // 오류 처리
    return NextResponse.json({ error: 'Error fetching user' });
  }
}