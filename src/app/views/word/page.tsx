/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import Image from 'next/image'
import './index.css'
import icon from '../../../assets/trumpet.png'
import useGetData from './hooks/useGetData'
import useGetVoice from './hooks/useGetVoice'
import useKeydown from './hooks/useKeydown'
import { useCallback, useEffect, useState } from 'react'
import { getLocalIndex, setLocalIndex } from '@/utils/localStorage'
import debounce from '../../../utils/debounce'

export default function Word() {
  // 获取单词
  const [index, setIndex] = useState(getLocalIndex())
  const { word, fetchData } = useGetData()
  useEffect(() => {
    if (localStorage.getItem('index') === null) {
      setIndex(1)
    }
    fetchData(index!)
  }, [fetchData, index])
  // 获取音频
  const { getVoice } = useGetVoice()
  const onPlay = useCallback(
    debounce(
      (type: string, audio: string) => {
        getVoice(type, audio)
      },
      500 // 设置延迟时间，以毫秒为单位
    ),
    [getVoice]
  )
  // 设置认识或不认识
  const setWordState = useCallback(
    debounce(
      (flag: boolean, text: string) => {
        if (flag) {
          setIndex(index! + 1)
          setLocalIndex(index! + 1)
        } else {
          setIndex(index! + 1)
          setLocalIndex(index! + 1)
        }
      },
      500 // 设置延迟时间，以毫秒为单位
    ),
    [index]
  )
  // 键盘事件
  useKeydown({ onPlay, word, setWordState })
  return (
    <div className="page-container">
      <div className="word-container">
        <div className="head">
          <span>{word?.cet4_word}</span>
          <p>{word?.cet4_phonetic}</p>
          <div className="icon-container">
            <Image
              onClick={() => onPlay('1', word?.cet4_word!)}
              src={icon}
              alt="trumpet"
              className="icon"
            ></Image>
            <Image
              onClick={() => onPlay('0', word?.cet4_word!)}
              src={icon}
              alt="trumpet"
              className="icon"
            ></Image>
          </div>
        </div>
        <div className="body">
          {/* <div className="sentence">
            <p>{word?.cet4_samples}</p>
            <p>我祝她生日快乐。</p>
          </div> */}
          <span onClick={() => setWordState(true, word?.cet4_word!)}>认识</span>
          <span onClick={() => setWordState(false, word?.cet4_word!)}>
            不认识
          </span>
        </div>
      </div>
    </div>
  )
}
