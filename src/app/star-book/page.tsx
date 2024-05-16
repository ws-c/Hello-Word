'use client'
import useGetStarList from '@/hooks/useGetStarList'
import './index.css'
import { word } from '@/types/word'
import { List, Pagination, Spin } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import Link from 'next/link'
import icon from '@/assets/trumpet.png'
import Image from 'next/image'
import useGetVoice from '@/hooks/useGetVoice'
import debounce from '@/utils/debounce'
import { useSettingStore, useUserStore } from '@/store/useStore'

export default function StarBook() {
  const { USER_TOKEN } = useUserStore()
  const { isMuted } = useSettingStore()
  const [wordList, setWordList] = useState<word[]>()
  const { fetchStarList } = useGetStarList()
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
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
  // 获取收藏单词总数
  const getSun = useCallback(async () => {
    const response = await fetch(
      `/apis/starList/getStarListSum?token=${USER_TOKEN}`
    )
    const res = await response.json()

    setTotal(res.data[0].count)
  }, [USER_TOKEN])

  useEffect(() => {
    getSun()
  }, [getSun])

  // 获取收藏单词列表
  const getWordList = useCallback(async () => {
    const res = await fetchStarList(currentPage)
    setWordList(res)
    setLoading(false) // 数据加载完成后设置 loading 状态为 false
  }, [currentPage, fetchStarList])

  useEffect(() => {
    getWordList()
  }, [currentPage, getWordList])

  // 分页
  const onChange = (page: number) => {
    setCurrentPage(page)
  }

  // 删除单项数据
  const deleteItem = (id: number) => {
    fetch(`/apis/delStar?id=${id}&token=${USER_TOKEN}`)
    getWordList()
    getSun()
  }
  // 触发显示效果
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setActiveIndex(null)
    }, 500)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [onPlay, setActiveIndex])
  return (
    <div className="star-book">
      <div className="star-book-header">
        <span>收藏单词本</span>
        <Link href="/">
          <CloseOutlined className="star-book-close" />
        </Link>
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
            <List.Item
              actions={[
                <div
                  className="star-book-delete"
                  key={item.id}
                  onClick={() => deleteItem(item.id)}
                >
                  删除
                </div>,
              ]}
            >
              <List.Item.Meta
                title={
                  <div className="star-book-title">
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
                  <p className="star-book-description">{item.translate}</p>
                }
              />
            </List.Item>
          )}
        />
      )}
      {!loading && ( // 根据 loading 状态来决定是否显示分页组件
        <Pagination
          onChange={onChange}
          defaultPageSize={8}
          defaultCurrent={1}
          total={total}
          hideOnSinglePage={true}
        />
      )}
    </div>
  )
}
