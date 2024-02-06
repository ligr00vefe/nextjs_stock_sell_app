import { User } from '@prisma/client';
import { Session } from 'next-auth';
import { getSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link'
import React from 'react'

interface NavItemProps {
  mobile?: boolean;

  // 유저가 로그인 되어서 props로 user 데이터를 받아왔을 때는 Prisma/client에서 제공하는 기본 User 안의 타입을 쓰고 로그인이 안되었을 때는 타입 null 
  currentUser?: Session | null; 
}

const NavItem = ({ mobile, currentUser }: NavItemProps) => {
  // useSession을 통해서 session 데이터 바로 확인하기
  // const { data: session, status } = useSession();
  // console.log({ session }, status );
  // console.log('NavItem_session: ', session);
  
  // session?.user?.id

  // getServerSession을 모듈화하여 session 데이터 확인
  // console.log('NavItem_currentUser', currentUser);      

  return (
    <ul className={`text-md justify-center flex gap-4 w-full items-center ${mobile && "flex-col h-full pt-2 pb-5"}`}>
      <li className='py-2 text-center cursor-pointer'><Link href="/stocks">관심종목</Link></li>
      <li className='py-2 text-center cursor-pointer'><Link href="/favorites">즐겨찾기</Link></li>
      <li className='py-2 text-center cursor-pointer'><Link href="/sell">매도종목</Link></li>
      {currentUser ?      
        <li className='py-2 text-center cursor-pointer'><button onClick={() => signOut()}>로그아웃</button></li>
        :
        <li className='py-2 text-center cursor-pointer'><button onClick={() => signIn()}>로그인</button></li>
      }
    </ul>
  )
}

export default NavItem