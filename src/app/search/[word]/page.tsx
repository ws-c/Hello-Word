'use client'
import './index.css'
import useGetVoice from '@/hooks/useGetVoice'
import { useSettingStore } from '@/store/settingStore'
import debounce from '@/utils/debounce'
import { mergeEveryNumber } from '@/utils/mergeEveryNumber'
import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import icon from '@/assets/trumpet.png'
import { word_sample_filter } from '@/types/word'
import { CloseOutlined, StarFilled, StarOutlined } from '@ant-design/icons'
import useSearchData from '@/hooks/useSearchData'
import Link from 'next/link'
import style from './search.module.css'

export default function Page({ params }: { params: { word: string } }) {
  const [isError, setIsError] = useState(false)
  const { isMuted } = useSettingStore()
  const [isUSActive, setIsUSActive] = useState(false)
  const [isUKActive, setIsUKActive] = useState(false)
  // 获取单词
  const [index, setIndex] = useState()
  const [word, setWord] = useState<word_sample_filter>()
  const { fetchData } = useSearchData()
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
      try {
        const data = await fetchData(params.word)
        const sampleList = data.cet4_samples.split('\n')
        const phraseList = data.cet4_phrase.split('\n')
        data.cet4_samples = mergeEveryNumber(sampleList, 3, true)
        data.cet4_phrase = mergeEveryNumber(phraseList, 2, false)
        setWord(data)
        setIndex(data.id)
        isExist(data.id)
      } catch (error) {
        setIsError(true)
      }
    }
    getWord()
  }, [fetchData, index, isExist, params.word])
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
  return (
    <>
      <div className="detail-container">
        {!isError && (
          <>
            <div className="detail-head">
              <div className="word">{word?.cet4_word}</div>
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
                    onClick={() => setStar(true, index!)}
                  />
                ) : (
                  <StarFilled
                    className="StarFilled"
                    onClick={() => setStar(false, index!)}
                  />
                )}
              </div>
            </div>
            <div className="detail-body">
              <div className="translate">{word?.cet4_translate}</div>
              <div className="samples">
                <div className="content-tag">例句</div>
                {word?.cet4_samples.map((item: any) => {
                  return (
                    <div key={item} className="samples-item">
                      <p>{item}</p>
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
          </>
        )}
        {isError && <div>该单词不存在...</div>}
        <Link href="/">
          <CloseOutlined className={style.close} />
        </Link>
      </div>
    </>
  )
}
