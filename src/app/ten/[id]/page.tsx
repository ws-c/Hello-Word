'use client'
import useGetVoice from '@/hooks/useGetVoice'
import { useSettingStore } from '@/store/useStore'
import { word } from '@/types/word'
import debounce from '@/utils/debounce'
import { List, Spin } from 'antd'
import { useCallback, useEffect, useRef, useState } from 'react'
import icon from '@/assets/trumpet.png'
import Image from 'next/image'
import './index.css'
import useGetTenWord from '@/hooks/useGetTenWord'
import style from './page.module.css'
import { RightOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import useGetData from '@/hooks/useGetData'
import useKeydown from '@/hooks/useKeydown'
export default function Page({ params }: { params: { id: string } }) {
  const { word: nextWord } = useGetData(+params.id + 1)
  const router = useRouter()
  useEffect(() => {})
  const { getTenWordList } = useGetTenWord()
  const { isMuted } = useSettingStore()
  const [wordList, setWordList] = useState<word[]>()
  const [loading, setLoading] = useState(true) // 添加 loading 状态
  // 获取音频
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const { getVoice } = useGetVoice()
  const onPlay = useCallback(
    debounce((type: string, audio: string, index: number) => {
      setActiveIndex(index)
      if (isMuted) return
      getVoice(type, audio)
    }, 500),
    [getVoice]
  )
  // 获取十个单词列表
  useEffect(() => {
    const setTenWord = async () => {
      const res = await getTenWordList(params.id)
      res.reverse()
      setWordList(res)
      setLoading(false)
    }
    setTenWord()
  }, [getTenWordList, params.id])

  // 触发显示效果
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setActiveIndex(null)
    }, 500)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [onPlay, setActiveIndex])
  // 下一个
  const setWordState = debounce(
    async (flag: boolean) => {
      if (flag) {
        router.push(`/word`)
        onPlay('1', nextWord?.word)
      }
    },
    500 // 设置延迟时间，以毫秒为单位
  )
  // 遮蔽单词
  const [activeDesc, setActiveDesc] = useState<number[]>([]) // 修改为数组来存储多个单词的状态
  const handleShow = (index: number) => {
    // 如果已经点击过，直接返回，不再执行切换显示状态的逻辑
    if (activeDesc.includes(index)) return
    // 将当前单词的索引添加到 activeDesc 数组中
    setActiveDesc([...activeDesc, index])
  }
  useKeydown({ setWordState, flag: 'know' })
  return (
    <>
      <div className="star-book">
        <div className="star-book-header">
          <span>单词小结</span>
        </div>
        {loading ? ( // 根据 loading 状态来决定是否显示加载状态
          <div className="Spin">
            <Spin size="large" />
          </div>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={wordList}
            renderItem={(item, index) => (
              <List.Item className={style.tenItem}>
                <List.Item.Meta
                  title={
                    <div className={style.tenTitle}>
                      <span>{index + 1}.</span> <span>{item.word}</span>
                      <Image
                        onClick={() => onPlay('1', item.word, index)}
                        src={icon}
                        alt="trumpet"
                        width={20}
                        height={20}
                        className={`${
                          activeIndex === index ? 'audio-active ' : ''
                        } audio star-audio`}
                      ></Image>
                    </div>
                  }
                  description={
                    <>
                      <p
                        className={
                          activeDesc.includes(index)
                            ? style.active
                            : style.itemDescription
                        }
                      >
                        {item.translate}
                      </p>
                      <div
                        onClick={() => handleShow(index)}
                        className={
                          activeDesc.includes(index)
                            ? style.NoHideDescription
                            : style.hideDescription
                        }
                      ></div>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>
      <RightOutlined
        onClick={() => setWordState(true)}
        className={style.right}
      />
    </>
  )
}
