'use client';

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import NavItem from './NavItem';
// import SearchBox from './SearchBox';
import { useRouter } from 'next/navigation';
import { User } from '@prisma/client';

interface NavbarProps {
  // 유저가 로그인 되어서 props로 user 데이터를 받아왔을 때는 Prisma/client에서 제공하는 기본 User 안의 타입을 쓰고 로그인이 안되었을 때는 타입 null 
  currentUser?: User | null; 
}

const Navbar = ({ currentUser }:NavbarProps) => {
  // console.log('currentUser', currentUser);

  const [menu, setMenu] = useState(false);
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState('');

  const handleMenu = () => {
    setMenu(!menu);
  }

  useEffect(() => {
    // 페이지 로드 시에도 경로 업데이트
    setCurrentPath(window.location.pathname);

    // 만약 로그인이 되어 있지 않다면 로그인 페이지로 리다이렉트합니다.
    if (!currentUser) {
      router.push('/api/auth/signin'); // 로그인 페이지 경로
    } 

    // console.log('router', router);
    // console.log('currentUser', currentUser);
    // console.log('Current Path:', currentPath);

  }, [currentUser, currentPath, router]);
 

  return (
    <nav className='relative z-10 w-full bg-blue-500 text-white py-2'>
      <div className='flex items-center justify-between mx-5 sm:mx-10 lg:mx-20'>
        <div className='flex items-center text2xl h-14'>
          <Link href="/">주식알리미</Link>
        </div>

        {/* { currentUser && currentPath !== '/' && 
          <div className='text-2xl'>
            <SearchBox />
          </div>
        }    */}

        <div className='text-2xl sm:hidden'>
          {menu === false ? <button onClick={handleMenu}>+</button> : <button onClick={handleMenu}>-</button>}
        </div>
        
        <div className='hidden sm:block'>
          <NavItem currentUser={currentUser} />
        </div>
      </div>

      <div className='block sm:hidden'>
        {(menu === false) ? null : <NavItem mobile />}
      </div>
    </nav>
  )
}

export default Navbar