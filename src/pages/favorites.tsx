import React from 'react';
import FavoritesPage, { IFavoritesPageProps } from '@/app/favorites/page';
import getFavorites, { IStocksParams } from '@/app/actions/getFavorites';
import getCurrentUser from '@/app/actions/getCurrentUser';
import { GetServerSidePropsContext, GetServerSideProps } from 'next';

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

const Favorites = (props: IFavoritesPageProps) => {
  return <FavoritesPage {...props} />;
};

export default Favorites;