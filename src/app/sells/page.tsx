'use client'

import React, { useEffect, useState } from 'react'
import EmptyState from '@/components/EmptyState';

import StockTableRow from '@/components/stocks/StockTableRow';
import { Favorite, User } from '@prisma/client';
import axios from 'axios';

const SellsPage = () => {

  const [stocks, setStocks] = useState<Favorite[] | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // 로딩 상태 추가
  const [error, setError] = useState<string | null>(null); // 에러 상태 추가

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/sells'); // GET 요청을 보냅니다.
        const { data, currentUser } = response.data.resultData; // 응답 데이터에서 stocks와 currentUser를 추출합니다.

        console.log('response: ', response);
        console.log('data: ', data);
        console.log('currentUser: ', currentUser);

        setStocks(data);
        setCurrentUser(currentUser);

      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>로딩 중...</div>; // 로딩 인디케이터 추가
  }

  if (error) {
    return <div>오류: {error}</div>; // 에러 메시지 표시
  }

  if (!stocks || stocks.length === 0) {
    return (
      <div className='flex flex-col items-center justify-start w-full h-full py-[120px]'>
        <EmptyState title="조건에 맞는 매도 종목이 없습니다." subtitle="희망 매도가를 수정해주세요." /> 
      </div>
    )
  }else {
    return (    
      <div className='flex flex-col items-center justify-start w-full h-full py-[150px]'>
        <div className='flex w-[80vw] max-w-[1400px] justify-center pb-10'>
          <h1 className='font-bold text-2xl'>매도 종목 리스트</h1>
        </div>
        <table className="w-[80vw] max-w-[1400px] border-[2px] border-black border-collapse border-spacing-0 p-10">
          <colgroup>
            <col className='w-[15%]'/>
            <col className=''/>
            <col className='w-[10%]'/>
            <col className='w-[12%]'/>
            <col className='w-[12%]'/>
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
              <StockTableRow stock={stock} key={stock.id} currentUser={currentUser} hasPrice={true} hasFavorite={false} hasSellingPrice={true} readonly />           
            ))}
          </tbody>          
        </table>
      </div>
    )
  }  
}

export default SellsPage