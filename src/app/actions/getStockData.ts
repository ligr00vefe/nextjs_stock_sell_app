'use client'

import axios from "axios";

const fetchStockData = async (searchTerm: string) => {
  try {
    if (!searchTerm) {
      // 검색어가 없으면 아무것도 하지 않고 함수 종료
      return;
    }

    // financialmodelingprep API 호출
    const apiKey = '760add19e6a62895d03f01b029c4d3c1';
    const apiUrl = `https://financialmodelingprep.com/api/v3/search?query=${encodeURIComponent(searchTerm)}&apikey=${apiKey}`;

    const response = await axios.get(apiUrl);
    const data = response.data;

    // API 응답에서 필요한 정보 추출하여 업데이트
    if (data && Array.isArray(data)) {
      return data;
    } else {
      console.error('Financial Modeling Prep에서 데이터를 가져오는 중 오류 발생: 잘못된 데이터 형식');
    }
  } catch (error) {
    console.error('Error fetching data from Financial Modeling Prep:', error);
  }
}

export default fetchStockData;