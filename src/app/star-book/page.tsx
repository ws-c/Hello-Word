'use client'
import './index.css'
import { List } from 'antd'
import { useState } from 'react'

const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
]
export default function StarBook() {
  return (
    <div className='star-book'>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item className='error-book-item'>
            <List.Item.Meta
              title={<a href="https://ant.design">{index+1}. {item.title}</a>}
              description="Ant Design, a design language for background applications, is refined by Ant UED Team"
            />
          </List.Item>
        )}
      />
    </div>
  )
}
