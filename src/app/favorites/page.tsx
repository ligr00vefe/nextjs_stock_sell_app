'use client'

import React, { useEffect, useState } from 'react'
import EmptyState from '@/components/EmptyState';

import StockTableRow from '@/components/stocks/StockTableRow';
import { Favorite } from '@prisma/client';
import axios from 'axios';
import { getSession} from 'next-auth/react';
import { Session } from 'next-auth';

const FavoritesPage = () => {

  const [stocks, setStocks] = useState<Favorite[] | null>(null);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // 에러 상태 추가

  useEffect(() => {  
    const fetchData = async () => {
      try {                 
        const currentSession = await getSession();
        console.log('favorites_currentSession: ', currentSession);   

        if (currentSession) {
          setCurrentSession(currentSession);

          if (currentSession.user && currentSession.user.id) {
            const favoritesApi_url = `/api/favorites`;
            const params = { userId: currentSession.user.id };
            await axios.get(favoritesApi_url, { params }) // GET 요청을 보냅니다.
            .then((res) => {
              console.log('favorites_data: ', res.data);
              const { data } = res.data.resultData;
              setStocks(data);
            }).catch((error) => {
              console.log('error: ',error);
            }); 
        
          }          
        }              
      } catch (error) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // console.log('FavoritesPage_currentSession: ', currentSession);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>오류: {error}</div>; // 에러 메시지 표시
  }

  if (!stocks || stocks.length === 0) {
    return (
      <div className='flex flex-col items-center justify-start w-full h-full py-[120px]'>
        <EmptyState title="즐겨찾기된 종목이 없습니다." subtitle="종목을 즐겨찾기 해 주세요." />
      </div>
    )
  }else {
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
              <th className='p-2 border-[1px] border-black bg-blue-100'>현재가(KRW/원)</th>
              <th className='p-2 border-[1px] border-black bg-blue-100'>희망매도가</th>
            </tr>           
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <StockTableRow stock={stock} key={stock.id} currentSession={currentSession} hasPrice={true} hasFavorite={false} hasSellingPrice={true} readonly={false} />           
            ))}
          </tbody>          
        </table>
      </div>
    )
  }  
}

export default FavoritesPage