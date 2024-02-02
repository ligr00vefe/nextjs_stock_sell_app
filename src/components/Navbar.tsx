'use client';

import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import NavItem from './NavItem';
// import SearchBox from './SearchBox';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import getCurrentUser from '@/app/actions/getCurrentUser';
import { User } from '@prisma/client';

const Navbar = () => {
  // console.log('currentUser', currentUser);

  const [menu, setMenu] = useState(false);
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState('');
  const [currentSession, setCurrentSession] = useState({});
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleMenu = () => {
    setMenu(!menu);
  }

  useEffect(() => {
    // 페이지 로드 시에도 경로 업데이트
    setCurrentPath(window.location.pathname);    

    const loginCheck = async () => {    
      const userSession = await getSession();
      const user = await getCurrentUser();
  
      if(userSession) {
        setCurrentSession(userSession);
      }
      if(user) {
        setCurrentUser(user);
      }
  
      // 만약 로그인이 되어 있지 않다면 로그인 페이지로 리다이렉트합니다.
      if (!userSession || !user) {
        if (!window.location.pathname.startsWith('/auth/login')) {
          router.push('/api/auth/signin'); // 로그인 페이지 경로
        }
      }   
      console.log('Navbar_currentSession', currentSession);       
      console.log('Navbar_currentUser', currentUser); 
    };     

    loginCheck();

    // console.log('router', router);       
    // console.log('Current Path:', currentPath);
  }, [router]);

  

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