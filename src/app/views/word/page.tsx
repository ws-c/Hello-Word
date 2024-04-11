'use client'
import Image from 'next/image'
import './index.css'
import icon from '../../../assets/trumpet.png'
import useGetData from './hooks/useGetData'
import useGetVoice from './hooks/useGetVoice'
import { useEffect, useState } from 'react'
import { getLocalIndex, setLocalIndex } from '@/utils/localStorage'
export default function Word() {
  //获取单词
  const [index, setIndex] = useState(getLocalIndex())
  const { word, fetchData } = useGetData()
  useEffect(() => {
    if (localStorage.getItem('index') === null) {
      setIndex(1)
    }
    fetchData(index!)
  }, [fetchData, index])
  //获取音频
  const {getVoice}  = useGetVoice()
  const onPlay = async (type: string, audio: string) => {
    await getVoice(type, audio)
  }
  // 认识
  const onKnow = (flag: boolean, text: string) => {
    setIndex(index! + 1)
    setLocalIndex(index! + 1)
  }

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
          <span onClick={() => onKnow(true, word?.cet4_word!)}>认识</span>
          <span>不认识</span>
        </div>
      </div>
    </div>
  )
}
