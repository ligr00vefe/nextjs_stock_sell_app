'use client';

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import NavItem from './NavItem';
// import SearchBox from './SearchBox';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { env } from 'process';
import getCurrentUser from '@/app/actions/getCurrentUser';
import { User } from '@prisma/client';

const Navbar = () => {
  // console.log('currentUser', currentUser);

  const [menu, setMenu] = useState(false);
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleMenu = () => {
    setMenu(!menu);
  }

  // useEffect(() => {
  //   // 페이지 로드 시에도 경로 업데이트
  //   setCurrentPath(window.location.pathname);  
  // }, []);


  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Failed to fetch current user:', error);
        // 적절한 오류 처리를 여기에 추가하세요.
      }
    };

    fetchCurrentUser();

    // // 만약 로그인이 되어 있지 않다면 로그인 페이지로 리다이렉트합니다.
    // if (!currentUser && window.location.pathname !== '/auth/login') {
    //   router.push('/api/auth/signin'); // 로그인 페이지 경로
    // } 
    console.log('currentUser', currentUser);

  }, [currentUser, router]); 

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