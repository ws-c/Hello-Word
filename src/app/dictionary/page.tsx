'use client'
import Link from 'next/link'
import './DictList.css'
import { useEffect, useState } from 'react'
import { Skeleton } from 'antd'

export default function DictList() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])

  useEffect(() => {
    async function getData() {
      const res = await fetch('/apis/dictionary')
      const { data } = await res.json()
      setData(data)
      setLoading(false)
    }
    getData()
  }, [])

  return (
    <ul className="DictList-container">
      {loading ? (
        <Skeleton
          active
          loading={loading}
          paragraph={{ rows: 30 }}
          title={{ width: '100%' }}
        />
      ) : (
        data.map((item: any) => (
          <Link href={`/search/${item.cet4_word}`} key={item.id}>
            <li className="DictList-item-container">
              <div>
                <span className="word-id">{item.id}.</span>
                <span className="word">{item.cet4_word}</span>
              </div>
              <div className="right">&gt;</div>
            </li>
          </Link>
        ))
      )}
    </ul>
  )
}
