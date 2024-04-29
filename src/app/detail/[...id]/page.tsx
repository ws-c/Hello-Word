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
  getCardNumber,
  getLocalGoal,
  getLocalIndex,
  getLocalTodayIndex,
  setCardNumber,
  setLocalIndex,
  setLocalTodayIndex,
} from '@/utils/localStorage'
import { mergeEveryNumber, removeEveryElement } from '@/utils/mergeEveryNumber'
import Prompt from '@/components/prompt/page'
import { useCardStore, useSettingStore, useUserStore } from '@/store/useStore'
import { useTenWordStore } from '@/store/useStore'
import { Divider, Spin, notification } from 'antd'
import useGetFilterData from '@/hooks/useGetFilterData'
import isSameDay from '@/utils/isSameDay'

export default function Detail({ params }: { params: { id: string } }) {
  const { USER_TOKEN } = useUserStore()
  const { tenWord, addTenWord, formatTenWord } = useTenWordStore()
  const { isMuted } = useSettingStore()
  const router = useRouter()
  const [isUSActive, setIsUSActive] = useState(false)
  const [isUKActive, setIsUKActive] = useState(false)
  // 获取单词
  const [index, setIndex] = useState(getLocalIndex()! + getLocalTodayIndex()!)
  const { word } = useGetFilterData(index)
  const { word: nextWord } = useGetData(index + 1)
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
      if (localStorage.getItem('index') === null) {
        setIndex(1)
      }
      isExist(index)
    }
    getWord()
  }, [index, isExist, word])
  //设置认识或不认识
  const setWordState = useCallback(
    debounce(
      async (flag: boolean) => {
        if (getLocalTodayIndex()! + 1 === getLocalGoal()) {
          router.push('/')
          setLocalIndex(getLocalIndex()! + getLocalTodayIndex()!)
          setLocalTodayIndex(0)

          // 获取卡片信息
          const card = getCardNumber()

          // 如果卡片信息不存在，则创建一个新的卡片
          if (!card) {
            const today = new Date()
            const newCard = { cardNum: 1, date: today }
            setCardNumber(newCard)
          } else {
            const today = new Date()
            const parsedCardDate = new Date(card.date)

            // 检查是否是同一天
            if (!isSameDay(today, parsedCardDate)) {
              const newCard = { cardNum: card.cardNum + 1, date: today }
              setCardNumber(newCard)
            }
          }
          notification.success({
            message: '成功',
            description: '您已完成目标，请继续加油！',
            duration: 2,
          })
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
      500 // 设置延迟时间，以毫秒为单位
    ),
    [index, onPlay]
  )
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
  useKeydown({ onPlay, word, setWordState, flag: params.id })

  return (
    <>
      <div className="detail-container">
        <div className="detail-head">
          <div className={params.id === 'forget' ? 'forget-word word' : 'word'}>
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
          onClick={() => setWordState(params.id === 'know' ? true : false)}
          className="RightOutlined"
        />
      </div>
      <Prompt></Prompt>
    </>
  )
}
