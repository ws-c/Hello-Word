'use client'
import Link from 'next/link'
import './DictList.css'
import { useEffect, useState } from 'react'
import { ConfigProvider, Skeleton, theme } from 'antd'
import { useThemeStore } from '@/store/useStore'
import { FixedSizeList as List, ListChildComponentProps } from 'react-window'

interface WordItem {
  id: number
  cet4_word: string
}
export default function DictList() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const { Theme } = useThemeStore()

  useEffect(() => {
    async function getData() {
      const res = await fetch('/apis/dictionary')
      const { data } = await res.json()
      setData(data)
      setLoading(false)
    }
    getData()
  }, [])

  // 计算列表项的高度
  const itemHeight = 50 // 你可以根据需要调整列表项的高度

  // 渲染列表项
  const Row = ({ index, style }: ListChildComponentProps) => {
    const item: WordItem = data[index]

    if (!item) {
      // Option: render nothing or some placeholder content
      return <div style={style}>Item is loading...</div>
    }

    return (
      <Link href={`/search/${item.cet4_word}`} key={item.id}>
        <li className="DictList-item-container" style={style}>
          <div>
            <span className="word-id">{item.id}.</span>
            <span className="word">{item.cet4_word}</span>
          </div>
          <div className="right">&gt;</div>
        </li>
      </Link>
    )
  }

  return (
    <div className="DictList-container">
      {loading ? (
        <ConfigProvider
          theme={{
            algorithm:
              Theme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
          }}
        >
          <Skeleton
            active
            loading={loading}
            paragraph={{ rows: 30 }}
            title={{ width: '100%' }}
          />
        </ConfigProvider>
      ) : (
        <List
          height={800} // 列表可见区域的高度
          itemCount={data.length} // 列表项的总数
          itemSize={itemHeight} // 每个列表项的高度
          width="100%" // 列表的宽度
        >
          {Row}
        </List>
      )}
    </div>
  )
}
