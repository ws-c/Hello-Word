import { useEffect, useState } from 'react'
import type { word } from '@/types/word'

export default function useGetData(id: number) {
  const [loading, setLoading] = useState(true)
  const [word, setWord] = useState<word>()

  useEffect(() => {
    const fetchData = async (id: number) => {
      try {
        const response = await fetch(`/apis/getData?id=${id}`)
        const res = await response.json()
        const data = res.data[0]
        setWord(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData(id)
  }, [id])
  return { word, loading }
}
