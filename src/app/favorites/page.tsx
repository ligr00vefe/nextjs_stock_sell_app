import React from 'react'
import getFavorites from '@/app/actions/getFavorites'
import { IStocksParams } from '@/app/actions/getStocks'
import getCurrentUser from '@/app/actions/getCurrentUser';
import EmptyState from '@/components/EmptyState';

import StockTableRow from '@/components/stocks/StockTableRow';

interface IStocksProps {
  searchParams: IStocksParams
}

const FavoritesPage = async ({ searchParams }: IStocksProps) => {

  const stocks = await getFavorites(searchParams);
  const currentUser = await getCurrentUser();

  // console.log('stocks: ', stocks);

  if (!stocks || stocks.data.length === 0) {
    return (
      <EmptyState title="즐겨찾기된 종목이 없습니다." subtitle="종목을 즐겨찾기 해 주세요." />
    )
  }

  return (    
    <div className='flex flex-col items-center justify-start w-[100vw] h-[100vh] py-[150px]'>
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
          {stocks.data.map((stock) => (
            <StockTableRow stock={stock} key={stock.id} currentUser={currentUser} hasPrice={true} hasFavorite={false} hasSellingPrice={true} readonly={false} />           
          ))}
        </tbody>          
      </table>
    </div>
  )
}

export default FavoritesPage