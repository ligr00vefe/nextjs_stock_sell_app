// (home)/page.tsx
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation';

import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';

const Home = () => {

  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>('');


  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      // Next.js에서의 프로그래밍적인 라우팅
      router.push(`/search?q=${searchTerm}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // console.log('e.target.value: ', e.target.value);
  };

  return (
    <main className='w-full h-[calc(100vh-75px)] flex flex-col items-center justify-center -my-[5%]'>
      <div className='flex flex-col items-center pb-[70px]'>
        {/* <h1>[작업중입니다.]</h1> */}
        <h2 className='pb-5 text-2xl font-semibold'>종목을 검색해 주세요.</h2>
        <p className='text-sm'>
          예시)
          애플: AAPL,
          넷플릭스: NFLX,
          쿠팡: CPNG
        </p>
      </div>
      
      <div className='flex items-center'>
        <input
          type="text"
          placeholder="영어로 검색해주세요"
          value={searchTerm}
          onChange={handleChange}
          className="bg-transparent/50 rounded text-base text-black bg-white p-2 border-[1px] border-[#CD93D7] focus:outline-0"
        />
        <Button 
          variant="outlined"
          size="medium"
          color="secondary"
          startIcon={<SearchIcon />}
          onClick={handleSearch}
          className="ml-2 h-[100%]"
        >검색</Button>
      </div>
    </main>
  );
};

export default Home;