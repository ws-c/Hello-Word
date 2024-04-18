import { useCallback } from 'react'

export default function useGetStarList() {
  const fetchStarList = useCallback(async (currentPage: number) => {
    try {
      const response = await fetch(
        `/apis/starList/getStarList?currentpage=${currentPage}`
      )
      const res = await response.json()
      return res.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }, [])

  return { fetchStarList }
}
