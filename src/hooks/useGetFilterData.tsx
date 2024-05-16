import { useEffect, useState } from 'react'
import type { word_sample_filter } from '@/types/word'
import { mergeEveryNumber, removeEveryElement } from '@/utils/mergeEveryNumber'

export default function useGetData(id: number) {
  const [loading, setLoading] = useState(true)
  const [word, setWord] = useState<word_sample_filter>()

  useEffect(() => {
    const fetchData = async (id: number) => {
      try {
        const response = await fetch(`/apis/getData?id=${id}`)
        const res = await response.json()
        const data = res.data[0]

        const sampleList = removeEveryElement(data.samples.split('\n'))
        const phraseList = data.phrase.split('\n')
        const translateList = data.translate.split('\n')
        data.samples = mergeEveryNumber(sampleList, 2, false).slice(0, 3)
        data.phrase = mergeEveryNumber(phraseList, 2, false).slice(0, 3)
        data.translate = translateList.slice(0, 3)

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
