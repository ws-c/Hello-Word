import { useUserStore } from '@/store/useStore'
import { useCallback } from 'react'

export default function useGetStarList() {
  const { USER_TOKEN } = useUserStore()
  const fetchStarList = useCallback(async (currentPage: number) => {
    try {
      const response = await fetch(
        `/apis/starList/getStarList?currentpage=${currentPage}&token=${USER_TOKEN}`
      )
      const res = await response.json()
      return res.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }, [])

  return { fetchStarList }
}
