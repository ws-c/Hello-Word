import { word } from '@/types/word'
import { useCallback, useState } from 'react'

export default function useGetData() {
  const [word, setWord] = useState<word>()
 
  const fetchData = useCallback(async (id: number) => {
    try {
      const response = await fetch(`/apis/getData?id=${id}`);
      const res = await response.json();
      const data = res.data[0];
      setWord(data);
      console.log(data);
        
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [setWord]);
  
  return {word, fetchData}
}