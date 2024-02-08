'use client'

import React, { useCallback, useEffect, useState } from 'react'
import EmptyState from '@/components/EmptyState';

import StockTableRow from '@/components/stocks/StockTableRow';
import { Favorite, User } from '@prisma/client';
import { FavoritesData } from '@/app/actions/getFavorites';
import axios from 'axios';

const FavoritesPage = () => {

  const [stocks, setStocks] = useState<Favorite[] | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {  
    const fetchData = async () => {
      try {
        setLoading(true);      
        
        const response = await axios.get('/api/favorites'); // GET 요청을 보냅니다.
        const { data, currentUser } = response.data.resultData; // 응답 데이터에서 stocks와 currentUser를 추출합니다.
  
        setStocks(data);
        setCurrentUser(currentUser);
          
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!stocks || stocks.length === 0) {
    return (
      <EmptyState title="즐겨찾기된 종목이 없습니다." subtitle="종목을 즐겨찾기 해 주세요." />
    )
  }

  return (    
    <div className='flex flex-col items-center justify-start w-full h-full py-[150px]'>
      <table className="w-[80vw] max-w-[1400px] border-[2px] border-black border-collapse border-spacing-0 p-10">
        <colgroup>
          <col className='w-[15%]' />
          <col className='' />
          <col className='w-[10%]' />
          <col className='w-[12%]' />
          <col className='w-[22%]' />
        </colgroup>
        <thead>
          <tr>
            <th className='p-2 border-[1px] border-black bg-blue-100'>종목코드</th>
            <th className='p-2 border-[1px] border-black bg-blue-100'>종목명</th>
            <th className='p-2 border-[1px] border-black bg-blue-100'>통화</th>
            <th className='p-2 border-[1px] border-black bg-blue-100'>현재가</th>
            <th className='p-2 border-[1px] border-black bg-blue-100'>희망매도가</th>
          </tr>           
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <StockTableRow stock={stock} key={stock.id} currentUser={currentUser} hasPrice={true} hasFavorite={false} hasSellingPrice={true} readonly={false} />           
          ))}
        </tbody>          
      </table>
    </div>
  )
}

export default FavoritesPage