'use client'
import { RightOutlined } from '@ant-design/icons'
import './index.css'
import Image from 'next/image'
import icon from '@/assets/trumpet.png'
import { useCallback, useEffect, useState } from 'react'
import useGetVoice from '@/hooks/useGetVoice'
import debounce from '@/utils/debounce'
import useGetData from '@/hooks/useGetData'
import type { word_sample_filter } from '@/types/word'
import useKeydown from '@/hooks/useKeydown'
import { useRouter } from 'next/navigation'
import { setLocalIndex } from '@/utils/localStorage'
import { mergeEveryThree } from '@/utils/stringSplit'
import Prompt from '@/components/prompt/page'

export default function Detail({ params }: { params: { id: string[] } }) {
  const router = useRouter()
  const [isUSActive, setIsUSActive] = useState(false)
  const [isUKActive, setIsUKActive] = useState(false)
  // 获取单词
  const [index, setIndex] = useState(+params.id[0])
  const [word, setWord] = useState<word_sample_filter>()
  const [nextWord, setNextWord] = useState<word_sample_filter>()
  const { fetchData } = useGetData()

  // 获取音频
  const { getVoice } = useGetVoice()
  const onPlay = useCallback(
    debounce(
      (type: string, audio: string) => {
        getVoice(type, audio)
        if (type === '1') {
          setIsUKActive(true)
        } else {
          setIsUSActive(true)
        }
      },
      300 // 设置延迟时间，以毫秒为单位
    ),
    [getVoice]
  )
  useEffect(() => {
    const getWord = async () => {
      if (localStorage.getItem('index') === null) {
        setIndex(1)
      }
      const data = await fetchData(index)
      const nextData = await fetchData(index + 1)
      const sampleList = data.cet4_samples.split('\n')
      data.cet4_samples = mergeEveryThree(sampleList)

      setWord(data)
      setNextWord(nextData)
    }
    getWord()
  }, [fetchData, index])
  //设置认识或不认识
  const setWordState = useCallback(
    debounce(
      async (flag: boolean) => {
        if (flag) {
          router.push(`/`)
          // 设置本地存储索引
          setIndex(index! + 1)
          setLocalIndex(index! + 1)

          onPlay('1', nextWord?.cet4_word!)
        } else {
          onPlay('1', word?.cet4_word!)
          router.push(`/`)
        }
      },
      300 // 设置延迟时间，以毫秒为单位
    ),
    [index, onPlay]
  )
  // 触发显示效果
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsUKActive(false)
      setIsUSActive(false)
    }, 300)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [onPlay])
  useKeydown({ onPlay, word, setWordState })
  return (
    <>
      <div className="detail-container">
        <div className="detail-head">
          <div className={params.id[1] === 'forget' ? 'forget-word word' : 'word'}>
            {word?.cet4_word}
          </div>
          <div className="soundmark">
            <span>{word?.cet4_phonetic}</span>
            <Image
              onClick={() => onPlay('1', word?.cet4_word!)}
              src={icon}
              alt="trumpet"
              className={isUKActive ? 'audio-active audio' : 'audio'}
            ></Image>
            <Image
              onClick={() => onPlay('0', word?.cet4_word!)}
              src={icon}
              alt="trumpet"
              className={isUSActive ? 'audio-active audio' : 'audio'}
            ></Image>
          </div>
        </div>
        <div className="detail-body">
          <div className="translate">{word?.cet4_translate}</div>
          <div className="samples">
            <div className="content-tag">例句</div>
            {word?.cet4_samples.map((item: any) => {
              return <p key={item}>{item}</p>
            })}
          </div>

          <div className="phrase">
            <div className="content-tag">词组短语</div>
            {word?.cet4_phrase}
          </div>
          <div className="distortion">
            <div className="content-tag">派生词</div>
            {word?.cet4_distortion}
          </div>
        </div>
        <RightOutlined
          onClick={() => setWordState(params.id[1] === 'know' ? true : false)}
          className="RightOutlined"
        />
      </div>
      <Prompt></Prompt>
    </>
  )
}
