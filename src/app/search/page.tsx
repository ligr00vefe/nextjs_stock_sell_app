// Search.tsx
'use client'

import React, { useEffect, useState } from 'react';
import fetchStockData from '@/app/actions/getStockData';
import axios from 'axios';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import AddBoxIcon from '@mui/icons-material/AddBox';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import getCurrentUser from '../actions/getCurrentUser';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const SearchPage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedStock, setSelectedStock] = useState<any>({
    symbol: '',
    company: '',
    currency: '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      symbol: '',
      company: '',
      currency: '',
      price: 0,
      userId: '',
      desired_selling_price: 0,
    }
  });  

  // 검색된 데이터 불러오기
  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get('q');
    setSearchTerm(query || '');
  }, []);

  useEffect(() => {
    const fetchAndSetData = async () => {
      if (searchTerm !== '') {
        try {
          const results = await fetchStockData(searchTerm);
          if (results) {
            setSearchResults(results);
          }
        } catch (error) {
          console.error('Error fetching stock data:', error);
        }
      }
    };

    fetchAndSetData();
  }, [searchTerm]);

  
  // 등록버튼으로 관심종목을 바로 등록할 때 사용.
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    const requestData = {
      ...data,
      ...selectedStock
    };

    // console.log('requestData', requestData);

    try {
      await axios.post(`/api/stocks`, requestData);
      router.push(`/stocks`);
      reset();
      toast.success('성공적으로 등록했습니다.');
    } catch (error) {
      console.error('Error while adding stock:', error);
      toast.error('문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }


  // 등록버튼으로 price값을 구하는 api로 전달할 때 사용.
  async function handleRegisterButtonClick(
    symbol:string, 
    company:string, 
    currency:string
  ) {
    // console.log('symbol:', symbol);
    // console.log('company:', company);
    // console.log('currency:', currency);
    // API 요청 주소 구성  
    try {
      // AlphaVantage API를 호출하는 서버측 API에 요청
      const response = await axios.get(`/api/search?symbol=${encodeURIComponent(symbol)}&currency=${encodeURIComponent(currency)}`);
      const data = response.data;
  
      // console.log('response: ', response);
      // console.log('data: ', data);
      // console.log('data.price: ', data.price);

      // 성공적으로 데이터를 받아온 경우, StockUploadPage로 리다이렉트
      if (data.price) {
        const queryParams = new URLSearchParams({
          symbol,
          company,
          currency,
          price: data.price,
        }).toString();
  
        router.push(`/stocks/upload?${queryParams}`);
      } else {
        const queryParams = new URLSearchParams({
          symbol,
          company,
          currency,
          price: '0',
        }).toString();

        router.push(`/stocks/upload?${queryParams}`);
      }
    } catch (error) {
      console.error('Error fetching current price', error);
    }
  }

  return (
    <div className='flex items-start justify-center w-full h-full py-20'>
      {searchResults.length > 0 ? (
        <table className="w-[70vw] max-w-[1000px] border-2 border-black border-collapse border-spacing-0 p-10">
          <thead>
            <tr>
              <th className='p-2 border-[1px] border-black bg-blue-100'>종목코드</th>
              <th className='p-2 border-[1px] border-black bg-blue-100'>종목명</th>
              <th className='p-2 border-[1px] border-black bg-blue-100'>통화</th>
              <th className='p-2 border-[1px] border-black bg-blue-100'>관심종목 등록</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((stock) => (
              <tr key={stock.symbol}>
                <td className='px-5 py-2 border-[1px] border-black'>{stock.symbol}</td>
                <td className='px-5 py-2 border-[1px] border-black'>{stock.name}</td>
                <td className='px-5 py-2 border-[1px] border-black text-center'>{stock.currency}</td>
                <td className='px-5 py-2 border-[1px] border-black text-center'>
                  {/* <form onSubmit={handleSubmit(onSubmit)}> */}
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={<AddBoxIcon />}
                      className="bg-blue-500"

                      // 등록버튼으로 관심종목으로 바로 등록
                      // onClick={() => {
                      //   setSelectedStock({
                      //     symbol: stock.symbol,
                      //     company: stock.name,
                      //     currency: stock.currency,
                      //   });
                      // }}

                      // 파라미터로 symbol, company, currency값만 전달
                      // component={Link}
                      // href={`/stocks/upload?symbol=${stock.symbol}&company=${stock.name}&currency=${stock.currency}`}
                    
                      // 
                      onClick={() => {handleRegisterButtonClick(stock.symbol, stock.name, stock.currency)}}
                    >
                      등록
                    </Button>
                  {/* </form>                   */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className='flex w-full h-full items-center justify-center'>
          <strong>일치하는 종목을 찾을 수 없습니다.</strong>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
