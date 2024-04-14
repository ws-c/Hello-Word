import { useCallback } from 'react'

export default function useGetData() {
  const fetchData = useCallback(async (id: number) => {
    try {
      const response = await fetch(`/apis/getData?id=${id}`)
      const res = await response.json()
      const data = res.data[0]
      console.log(data)
      return data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }, [])

  return { fetchData }
}
