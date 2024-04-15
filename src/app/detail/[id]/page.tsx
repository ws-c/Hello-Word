'use client'
import { RightOutlined } from '@ant-design/icons'
import './index.css'
import Image from 'next/image'
import icon from '@/assets/trumpet.png'
import { useCallback, useEffect, useState } from 'react'
import useGetVoice from '@/hooks/useGetVoice'
import debounce from '@/utils/debounce'
import useGetData from '@/hooks/useGetData'
import type { word } from '@/types/word'
export default function Detail({ params }: { params: { id: string } }) {
  const [isUSActive, setIsUSActive] = useState(false)
  const [isUKActive, setIsUKActive] = useState(false)
  // 获取单词
  const [index, setIndex] = useState(+params.id)
  const [word, setWord] = useState<word>()
  const { fetchData } = useGetData()
  useEffect(() => {
    const getWord = async () => {
      if (localStorage.getItem('index') === null) {
        setIndex(1)
      }
      const data = await fetchData(index)
  
      // 使用全局匹配模式来匹配多个结果
      const matches = data.cet4_samples.matchAll(/(.*?)》/g)
  
      // 创建一个新数组来保存分割后的结果
      const splitArray = []
  
      // 遍历匹配结果
      for (const match of matches) {
        // 如果匹配到的内容不是最后的空字符串（即不是由于字符串末尾的分隔符导致的额外匹配）
        if (match[0] !== '') {
          splitArray.push(match[0]) // 添加匹配到的内容（包括分隔符）
        }
      }
      data.cet4_samples = splitArray
      console.log(data.cet4_samples)
      setWord(data)
    }
    getWord()
  }, [fetchData, index])
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
        <div className="detail-head">
          <div className="word">{word?.cet4_word}</div>
        </div>
        <div className="detail-body">
          <div className="translate">
            {word?.cet4_translate}
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
          <div className="samples">
            <p className="content-tag">例句：</p>
            <p>{word?.cet4_samples}</p>
          </div>
          <div className="phrase">
            <p className="content-tag">词组短语：</p>
            {word?.cet4_phrase}
          </div>
          <div className="distortion">
            <p className="content-tag">派生词：</p>
            {word?.cet4_distortion}
          </div>
        </div>
        <RightOutlined className="RightOutlined" />
      </div>
    </>
  )
}
