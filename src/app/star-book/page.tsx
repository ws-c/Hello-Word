'use client'
import useGetStarList from '@/hooks/useGetStarList'
import './index.css'
import { word } from '@/types/word'
import { List, Pagination } from 'antd'
import { useEffect, useState } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import Link from 'next/link'

export default function StarBook() {
  const [wordList, setWordList] = useState<word[]>()
  const { fetchStarList } = useGetStarList()
  const [currentPage, setCurrentPage] = useState(1)
  useEffect(() => {
    const getWordList = async () => {
      const res = await fetchStarList(currentPage)
      setWordList(res)
    }
    getWordList()
  }, [currentPage, fetchStarList])
  return (
    <div className="star-book">
      <List
        header={
          <div className="star-book-header">
            <span>收藏单词本</span>
            <Link href="/">
              <CloseOutlined className="star-book-close" />
            </Link>
          </div>
        }
        itemLayout="horizontal"
        dataSource={wordList}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              title={
                <div className="star-book-title">
                  <span>{index + 1}.</span> <span>{item.cet4_word}</span>
                </div>
              }
              description={
                <p className="star-book-description">{item.cet4_translate}</p>
              }
            />
          </List.Item>
        )}
      />
      <Pagination
        defaultPageSize={8}
        defaultCurrent={1}
        total={50}
        hideOnSinglePage={true}
      />
    </div>
  )
}
