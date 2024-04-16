/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import Image from 'next/image'
import './index.css'
import icon from '@/assets/trumpet.png'
import useGetData from '../../hooks/useGetData'
import useGetVoice from '../../hooks/useGetVoice'
import useKeydown from '../../hooks/useKeydown'
import { useCallback, useEffect, useState } from 'react'
import { getLocalIndex, setLocalIndex } from '@/utils/localStorage'
import debounce from '../../utils/debounce'
import { useRouter } from 'next/navigation'
import type { word } from '@/types/word'
import Prompt from '../prompt/page'

export default function Word() {
  const router = useRouter()
  // 动态class
  const [isUSActive, setIsUSActive] = useState(false)
  const [isUKActive, setIsUKActive] = useState(false)
  const [isKnowActive, setIsKnowActive] = useState(false)
  const [isForgetActive, setIsForgetActive] = useState(false)

  // 获取单词
  const [index, setIndex] = useState(getLocalIndex())
  const [word, setWord] = useState<word>()
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
      setWord(await fetchData(index!))
    }
    getWord()
  }, [fetchData, index])
  // 设置认识或不认识
  const setWordState = useCallback(
    debounce(
      (flag: boolean) => {
        onPlay('1', word?.cet4_word!)
        if (flag) {
          // router.push(`/detail?id=${index}&type=know`)
          router.push(`/detail/${index}/know`)
          setIsKnowActive(true)
          // 设置本地存储索引
          setIndex(index! + 1)
          setLocalIndex(index! + 1)
        } else {
          router.push(`/detail/${index}/forget`)
          setIsForgetActive(true)
        }
      },
      300 // 设置延迟时间，以毫秒为单位
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
    }, 300)

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
          <span>{word?.cet4_word}</span>
          <p>{word?.cet4_phonetic}</p>
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
        <div className="body">
          <span
            className={isKnowActive ? 'know-active' : ''}
            onClick={() => setWordState(true)}
          >
            认识
          </span>
          <span
            className={isForgetActive ? 'forget-active' : ''}
            onClick={() => setWordState(false)}
          >
            不认识
          </span>
        </div>
      </div>
      <Prompt></Prompt>
    </>
  )
}
