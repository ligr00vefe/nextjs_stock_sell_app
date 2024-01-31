'use client';

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import NavItem from './NavItem';
// import SearchBox from './SearchBox';
import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import getCurrentUser from '@/app/actions/getCurrentUser';

interface NavbarProps {
  // 유저가 로그인 되어서 props로 user 데이터를 받아왔을 때는 Prisma/client에서 제공하는 기본 User 안의 타입을 쓰고 로그인이 안되었을 때는 타입 null 
  currentUser?: User | null; 
}

const Navbar = () => {

  const [menu, setMenu] = useState(false);
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // const [currentPath, setCurrentPath] = useState('');

  const handleMenu = () => {
    setMenu(!menu);
  }

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