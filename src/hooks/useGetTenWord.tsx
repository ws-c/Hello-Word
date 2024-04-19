import { useCallback } from 'react'

export default function useGetTenWord() {
  const getTenWordList = useCallback(async (id: string) => {
    const response = await fetch(`/apis/getTen?id=${id}`)
    const res = await response.json()
    return res.data
  }, [])

  return { getTenWordList }
}
