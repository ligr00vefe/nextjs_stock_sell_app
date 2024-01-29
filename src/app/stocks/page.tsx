import React from 'react'
import getStocks from '@/app/actions/getStocks'
import { IStocksParams } from '@/app/actions/getFavorites'
import getCurrentUser from '@/app/actions/getCurrentUser';
import EmptyState from '@/components/EmptyState';

import { Button } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import StockTableRow from '@/components/stocks/StockTableRow';

interface IStocksProps {
  searchParams: IStocksParams
}

const StocksPage = async ({ searchParams }: IStocksProps) => {

  const stocks = await getStocks(searchParams);
  const currentUser = await getCurrentUser();

  // console.log('stocks: ', stocks);

  if (!stocks || stocks.data.length === 0) {
    return (
      <div className='flex flex-col items-center justify-start w-[100vw] h-[100vh] py-[120px]'>
        <div className='flex w-[80vw] max-w-[1400px] justify-end pb-3'>
          <Button variant="contained" href="/stocks/upload" startIcon={<AddCircleIcon />}>관심종목 등록</Button>
        </div>
        <EmptyState title="등록된 종목이 없습니다." subtitle="종목을 등록해 주세요." />
      </div>
    )
  }else {
    return (    
      <div className='flex flex-col items-center justify-start w-[100vw] h-[100vh] py-[150px]'>
        <div className='flex w-[80vw] max-w-[1400px] justify-end pb-3'>
          <Button variant="contained" href="/stocks/upload" startIcon={<AddCircleIcon />}>관심종목 등록</Button>
        </div>
        <table className="w-[80vw] max-w-[1400px] border-[2px] border-black border-collapse border-spacing-0 p-10">
          <colgroup>
            <col className='w-[15%]' />
            <col className='' />
            <col className='w-[10%]' />
            <col className='w-[12%]' />
            <col className='w-[10%]' />
          </colgroup>
          <thead>
            <tr>
              <th className='p-2 border-[1px] border-black bg-blue-100'>종목코드</th>
              <th className='p-2 border-[1px] border-black bg-blue-100'>종목명</th>
              <th className='p-2 border-[1px] border-black bg-blue-100'>통화</th>
              <th className='p-2 border-[1px] border-black bg-blue-100'>현재가</th>
              <th className='p-2 border-[1px] border-black bg-blue-100'>즐겨찾기</th>
            </tr>           
          </thead>
          <tbody>
            {stocks.data.map((stock) => (
              <StockTableRow stock={stock} key={stock.id} currentUser={currentUser} hasPrice={true} hasFavorite={true} hasSellingPrice={false} readonly={false} />           
            ))}
          </tbody>          
        </table>
      </div>
    )
  }  
}

export default StocksPage