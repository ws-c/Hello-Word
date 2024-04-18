import { useCallback } from 'react'

export default function useSearchData() {
  const fetchData = useCallback(async (word: string) => {
    try {
      const response = await fetch(`/apis/getSearch?word=${word}`)
      const res = await response.json()
      const data = res.data[0]
      return data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }, [])

  return { fetchData }
}
