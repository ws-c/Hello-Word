'use client' 
import { word } from '@/types/word'
import { useEffect, useState } from 'react'

export default function useGetDate(): word[] {
  const [data, setData] = useState<word[]>([])
 
  useEffect(() => {
    fetchData()
  }, [])
 
  const fetchData = async () => {
    try {
      const response = await fetch('/apis/getData')
      const res = await response.json()
      const data = res.data
      
      setData(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  return data
}
