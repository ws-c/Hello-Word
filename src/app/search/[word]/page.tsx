'use client'
import '@/app/detail/[...id]/index.css'
import useGetVoice from '@/hooks/useGetVoice'
import { useSettingStore, useUserStore } from '@/store/useStore'
import debounce from '@/utils/debounce'
import { mergeEveryNumber, removeEveryElement } from '@/utils/mergeEveryNumber'
import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import icon from '@/assets/trumpet.png'
import { word_sample_filter } from '@/types/word'
import { CloseOutlined, StarFilled, StarOutlined } from '@ant-design/icons'
import useSearchData from '@/hooks/useSearchData'
import Link from 'next/link'
import style from './search.module.css'

export default function Page({ params }: { params: { word: string } }) {
  const { USER_TOKEN } = useUserStore()
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
      fetch(`/apis/setStar?id=${index}&token=${USER_TOKEN}`)
    } else {
      fetch(`/apis/delStar?id=${index}&token=${USER_TOKEN}`)
    }
  }
  const isExist = useCallback(async (id: number) => {
    const res = await fetch(`/apis/isStar?id=${id}&token=${USER_TOKEN}`)
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
      500 // 设置延迟时间，以毫秒为单位
    ),
    [getVoice]
  )
  useEffect(() => {
    const getWord = async () => {
      try {
        const data = await fetchData(params.word)
        const sampleList = removeEveryElement(data.samples.split('\n'))
        const phraseList = data.phrase.split('\n')
        const translateList = data.translate.split('\n')
        data.samples = mergeEveryNumber(sampleList, 2, false)
        data.phrase = mergeEveryNumber(phraseList, 2, false)
        data.translate = translateList
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
    }, 500)

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
              <div className="word">{word?.word}</div>
              <div className="soundmark">
                <span>{word?.phonetic}</span>
                <Image
                  onClick={() => onPlay('1', word?.word!)}
                  src={icon}
                  alt="trumpet"
                  className={isUKActive ? 'audio-active audio' : 'audio'}
                ></Image>
                <Image
                  onClick={() => onPlay('0', word?.word!)}
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
              <div className="translate">
                {word?.translate.map((item: string, index: number) => {
                  return <p key={index}>{item}</p>
                })}
              </div>
            </div>
            <div className="detail-body">
              <div className="samples">
                <div className="content-tag">例句</div>
                {word?.samples.map((item: any, index: number) => {
                  // 在遇到 '.' 和 '?' 符号时添加换行符，并分割句子
                  const splitItems = item.replace(/[.?]/g, '\n').split('\n')
                  return (
                    <div key={item} className="samples-item">
                      <p style={{ marginRight: '8px' }}>{index + 1}. </p>
                      <div>
                        {splitItems.map(
                          (splitItem: any, splitIndex: number) => (
                            <p key={splitIndex}>
                              {splitItem}
                              {splitIndex === 0 ? '.' : null}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="phrase">
                <div className="content-tag">词组短语</div>
                <div className="phrase-list">
                  {word?.phrase.map((item: any) => {
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
                {word?.distortion}
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
