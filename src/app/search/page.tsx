// Search.tsx
'use client'

import React, { useEffect, useState } from 'react';
import fetchStockData from '@/app/actions/getStockData';
import axios from 'axios';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Button, ButtonBase, IconButton } from '@mui/material';
import { toast } from 'react-toastify';

const SearchPage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();  

  const [symbolValue, setSymbolValue] = useState('');
  const [companyValue, setCompanyValue] = useState('');
  const [currencyValue, setCurrencyValue] = useState('');

  const {
    // useForm에서 제공해주는 property
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
    },
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

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    const requestData = {
      ...data,
      symbol: symbolValue,
      company: companyValue,
      currency: currencyValue

    };

    // console.log('requestData:', requestData);    
  
    try {       
      // 관심종목을 추가하려는 경우 post로 axios 전송
      axios.post(`/api/stocks`, requestData)
      .then((response) => {
        router.push(`/stocks`);
        reset();
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      })  

      // 즐겨찾기 반영을 위해 router refresh
      window.location.reload();

      toast.success('성공했습니다.');

    } catch (error) {
      toast.error('문제가 발생했습니다.');
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fetchAndSetData = async () => {
        const searchTerm = router.query.q as string;
        if (searchTerm && searchTerm !== '') {
          try {
            const results = await fetchStockData(searchTerm);
            if (results !== undefined) {
              setSearchResults(results);
            }
          } catch (error) {
            console.error('Error fetching stock data:', error);
          }
        }
      };
    
      fetchAndSetData();
    }
  }, [router.query.q]);

  if (searchResults.length > 0) {
    return (
      <div className='flex items-start justify-center w-[100vw] h-[100vh] py-[150px]'>
        <table className="w-[70vw] max-w-[1000px] border-[2px] border-black border-collapse border-spacing-0 p-10">
          <colgroup>
            <col className='w-[15%]' />
            <col className='' />
            <col className='w-[12%]' />
            <col className='w-[15%]' />
          </colgroup>
          <thead>
            <tr>
              <th className='p-2 border-[1px] border-black bg-blue-100'>종목코드</th>
              <th className='p-2 border-[1px] border-black bg-blue-100'>종목명</th>
              <th className='p-2 border-[1px] border-black bg-blue-100'>통화</th>
              <th className='p-2 border-[1px] border-black bg-blue-100'>관심종목 등록</th>
              {/* <th className='p-2 border-[1px] border-black'>즐겨찾기</th> */}

            </tr>           
          </thead>
          <tbody>
            {searchResults.map((stock) => (
              <tr key={stock.id}>
                <td className='px-5 py-2 border-[1px] border-black'>{stock.symbol}</td>
                <td className='px-5 py-2 border-[1px] border-black'>{stock.name}</td>
                <td className='px-5 py-2 border-[1px] border-black text-center'>{stock.currency}</td>
                <td className='px-5 py-2 border-[1px] border-black text-center'>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="primary" 
                      startIcon={<AddBoxIcon />}
                      className="bg-blue-500"
                      onClick={() => {
                        setSymbolValue(stock.symbol);
                        setCompanyValue(stock.name);
                        setCurrencyValue(stock.currency);
                      }}
                    >
                      등록
                    </Button>             
                  </form>                
                </td>
              </tr>               
            ))}
          </tbody>          
        </table>
      </div>
    )
  } else {
    return (
      <div
        className='flex w-[100vw] h-[100vh] items-center justify-center p-10'
      >
        <strong>일치하는 종목을 찾을 수 없습니다.</strong>
      </div>
    )
  }  
}

export default SearchPage;

