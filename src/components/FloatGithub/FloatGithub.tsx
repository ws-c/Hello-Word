'use client'
import React from 'react'
import { FloatButton } from 'antd'
import { GithubOutlined } from '@ant-design/icons'
import './index.css'
import Link from 'next/link'

const FloatGithub: React.FC = () => (
  <Link href={'https://github.com/ws-c/Hello-Word'}>
    <FloatButton
      className="githubButton"
      icon={<GithubOutlined className="githubIcon" />}
    />
  </Link>
)

export default FloatGithub
