import React from 'react'
import getFavorites, { IStocksParams } from '@/app/actions/getFavorites'
import getCurrentUser from '@/app/actions/getCurrentUser';
import EmptyState from '@/components/EmptyState';

import StockTableRow from '@/components/stocks/StockTableRow';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Favorite, User } from '@prisma/client';

interface IFavoritesPageProps {
  stocks: { data: Favorite[] };
  currentUser: User | null;
}

const FavoritesPage = async ({ stocks, currentUser }:IFavoritesPageProps) => {

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

export const getServerSideProps: GetServerSideProps<IFavoritesPageProps> = async (context: GetServerSidePropsContext) => {
  const searchParams: IStocksParams = {
    symbol: context.query.symbol as string,
    company: context.query.company as string,
    currency: context.query.currency as string,
    price: typeof context.query.price === 'string' ? Number(context.query.price) : null,
    desired_selling_price: typeof context.query.desired_selling_price === 'string' ? Number(context.query.desired_selling_price) : null,
    userId: context.query.userId as string,
    stockId: context.query.stockId as string
  }

  // 데이터를 가져옵니다.
  const stocks = await getFavorites(searchParams);
  const currentUser = await getCurrentUser();

  // 페이지에 props로 데이터를 전달합니다.
  return { props: { stocks, currentUser } };
};

export default FavoritesPage