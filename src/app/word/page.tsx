/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import Image from 'next/image'
import './index.css'
import icon from '@/assets/trumpet.png'
import useGetData from '../../hooks/useGetData'
import useGetVoice from '../../hooks/useGetVoice'
import useKeydown from '../../hooks/useKeydown'
import { useCallback, useEffect, useState } from 'react'
import {
  getLocalGoal,
  getLocalIndex,
  getLocalTodayIndex,
} from '@/utils/localStorage'
import debounce from '../../utils/debounce'
import { useRouter } from 'next/navigation'
import Prompt from '../../components/prompt/page'
import { Spin, Statistic } from 'antd'
import { useSettingStore } from '@/store/useStore'

export default function Word() {
  const { isMuted } = useSettingStore()
  const [countToday] = useState(getLocalTodayIndex() || 0)
  const router = useRouter()
  // 动态class
  const [isUSActive, setIsUSActive] = useState(false)
  const [isUKActive, setIsUKActive] = useState(false)
  const [isKnowActive, setIsKnowActive] = useState(false)
  const [isForgetActive, setIsForgetActive] = useState(false)

  // 获取单词
  const [index, setIndex] = useState(getLocalIndex()! + getLocalTodayIndex()!)
  const { word, loading } = useGetData(index)

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
    if (localStorage.getItem('index') === null) {
      setIndex(1)
    }
  }, [index])
  // 设置认识或不认识
  const setWordState = useCallback(
    debounce(
      (flag: boolean) => {
        onPlay('1', word?.cet4_word!)
        if (flag) {
          router.push(`/detail/know`)
          setIsKnowActive(true)
        } else {
          router.push(`/detail/forget`)
          setIsForgetActive(true)
        }
      },
      500 // 设置延迟时间，以毫秒为单位
    ),
    [index, onPlay]
  )

  // 触发显示效果
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsKnowActive(false)
      setIsForgetActive(false)
      setIsUKActive(false)
      setIsUSActive(false)
    }, 500)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [setIsKnowActive, setIsForgetActive, setWordState, onPlay])

  // 键盘事件
  useKeydown({ onPlay, word, setWordState, banKeydown: 'ArrowLeft' })
  return (
    <>
      <div className="word-container">
        <div className="head">
          {loading ? (
            <Spin size="large" style={{ marginBottom: '40px' }} />
          ) : (
            <>
              <span>{word?.cet4_word}</span>
              <div>{word?.cet4_phonetic}</div>
            </>
          )}
          <div className="icon-container">
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
        <div className="know-body">
          <span
            className={isKnowActive ? 'know-active' : ''}
            onClick={() => setWordState(true)}
          >
            认识
          </span>
          <div className="divider"></div>
          <span
            className={isForgetActive ? 'forget-active' : ''}
            onClick={() => setWordState(false)}
          >
            不认识
          </span>
        </div>
      </div>
      <Prompt></Prompt>
      <Statistic
        className="word-statistic"
        title="已完成"
        value={countToday}
        suffix={`/ ${getLocalGoal()}`}
      />
    </>
  )
}
