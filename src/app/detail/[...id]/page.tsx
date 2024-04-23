'use client'
import { RightOutlined, StarFilled, StarOutlined } from '@ant-design/icons'
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
import {
  getLocalGoal,
  getLocalIndex,
  getLocalTodayIndex,
  setLocalIndex,
  setLocalTodayIndex,
} from '@/utils/localStorage'
import { mergeEveryNumber, removeEveryElement } from '@/utils/mergeEveryNumber'
import Prompt from '@/components/prompt/page'
import { useSettingStore } from '@/store/useStore'
import { useTenWordStore } from '@/store/useStore'

export default function Detail({ params }: { params: { id: string[] } }) {
  const { tenWord, addTenWord, formatTenWord } = useTenWordStore()
  const { isMuted } = useSettingStore()
  const router = useRouter()
  const [isUSActive, setIsUSActive] = useState(false)
  const [isUKActive, setIsUKActive] = useState(false)
  // 获取单词
  const [index, setIndex] = useState(getLocalIndex()! + getLocalTodayIndex()!)
  const [word, setWord] = useState<word_sample_filter>()
  const [nextWord, setNextWord] = useState<word_sample_filter>()
  const { fetchData } = useGetData()
  // 收藏单词
  const [isStar, setIsStar] = useState(false)
  const setStar = (flag: boolean, index: number) => {
    setIsStar(flag)
    if (flag) {
      fetch(`/apis/setStar?id=${index}`)
    } else {
      fetch(`/apis/delStar?id=${index}`)
    }
  }
  const isExist = useCallback(async (id: number) => {
    const res = await fetch(`/apis/isStar?id=${id}`)
    const { data } = await res.json()
    if (data && data[0].count > 0) {
      setIsStar(true)
    }
  }, [])
  // 获取音频
  const { getVoice } = useGetVoice()
  const onPlay = useCallback(
    debounce(
      (type: string, audio: string) => {
        if (isMuted) return
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
      const sampleList = removeEveryElement(data.cet4_samples.split('\n'))
      const phraseList = data.cet4_phrase.split('\n')
      const translateList = data.cet4_translate.split('\n')
      data.cet4_samples = mergeEveryNumber(sampleList, 2, false).slice(0, 3)
      data.cet4_phrase = mergeEveryNumber(phraseList, 2, false).slice(0, 3)
      data.cet4_translate = translateList.slice(0, 3)
      setWord(data)
      setNextWord(nextData)
      console.log('2', nextData)
      console.log('1', data)
      isExist(index)
    }
    getWord()
  }, [fetchData, index, isExist])
  //设置认识或不认识
  const setWordState = useCallback(
    debounce(
      async (flag: boolean) => {
        if (getLocalTodayIndex()! + 1 === getLocalGoal()) {
          router.push('/')
          setLocalIndex(getLocalIndex()! + getLocalTodayIndex()!)
          setLocalTodayIndex(0)
          return
        }
        if (flag) {
          router.push(`/word`)
          // 设置本地存储索引
          setLocalTodayIndex(getLocalTodayIndex()! + 1)
          addTenWord()
          if (tenWord === 10) {
            router.push(`/ten/${index}`)
            formatTenWord()
            return
          }
          onPlay('1', nextWord?.cet4_word!)
        } else {
          onPlay('1', word?.cet4_word!)
          router.push(`/word`)
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
  useKeydown({ onPlay, word, setWordState, flag: params.id[1] })
  return (
    <>
      <div className="detail-container">
        <div className="detail-head">
          <div
            className={params.id[1] === 'forget' ? 'forget-word word' : 'word'}
          >
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
            {isStar === false ? (
              <StarOutlined
                className="StarOutlined"
                onClick={() => setStar(true, index)}
              />
            ) : (
              <StarFilled
                className="StarFilled"
                onClick={() => setStar(false, index)}
              />
            )}
          </div>
          <div className="translate">
            {word?.cet4_translate.map((item: string, index: number) => {
              return <p key={index}>{item}</p>
            })}
          </div>
        </div>
        <div className="detail-body">
          <div className="samples">
            <div className="content-tag">例句</div>
            {word?.cet4_samples.map((item: any, index: number) => {
              // 在遇到 '.' 和 '?' 符号时添加换行符，并分割句子
              const splitItems = item.replace(/[.?]/g, '\n').split('\n')
              return (
                <div key={item} className="samples-item">
                  <p style={{ marginRight: '8px' }}>{index + 1}. </p>
                  <div>
                    {splitItems.map((splitItem: any, splitIndex: number) => (
                      <p key={splitIndex}>
                        {splitItem}
                        {splitIndex === 0 ? '.' : null}
                      </p>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="phrase">
            <div className="content-tag">词组短语</div>
            <div className="phrase-list">
              {word?.cet4_phrase.map((item: any) => {
                return (
                  <div key={item}>
                    <span>{item}</span>
                    <i>|</i>
                  </div>
                )
              })}
            </div>
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
