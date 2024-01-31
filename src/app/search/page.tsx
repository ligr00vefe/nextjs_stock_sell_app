import React, { useEffect, useState } from 'react';
import fetchStockData from '@/app/actions/getStockData';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';

const SearchPage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();  

  const {
    register,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      symbol: '',
      company: '',
      currency: '',
      price: 0,
      userId: '',
      desired_selling_price: 0,
    }
  });

  useEffect(() => {
    const fetchAndSetData = async () => {
      if (!router.isReady) return;
      const searchTerm = router.query.q as string;
      if (searchTerm && searchTerm !== '') {
        try {
          const results = await fetchStockData(searchTerm);
          setSearchResults(results || []);
        } catch (error) {
          console.error('Error fetching stock data:', error);
        }
      }
    };
  
    fetchAndSetData();
  }, [router.isReady, router.query.q]);

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {       
      await axios.post(`/api/stocks`, data);
      router.push(`/stocks`);
      toast.success('성공했습니다.');
    } catch (error) {
      toast.error('문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
      reset();
    }
  }

  if (searchResults.length > 0) {
    return (
      <div className='flex flex-col items-center justify-start w-[100vw] h-[100vh] py-[150px]'>
        <table className="w-[80vw] max-w-[1400px] border-[2px] border-black border-collapse border-spacing-0 p-10">
          <colgroup>
            <col className='w-[15%]' />
            <col className='' />
            <col className='w-[10%]' />
            <col className='w-[12%]' />
          </colgroup>
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
