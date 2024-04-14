'use client'
import '@/app/globals.css'
import { Layout } from 'antd'
import Word from '../components/word/page'
const { Header, Content, Footer } = Layout

export default function Home() {
  return (
    <Layout>
      <Header
        style={{
          position: 'fixed',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100vw',
          height: '80px',
        }}
      >
        <div className="logo">本地单词</div>
        <div className="tool-bar">
          <div>单词本</div>
          <div>设置</div>
        </div>
      </Header>
      <Content
        style={{
          paddingTop: '120px',
          paddingBottom: '40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Word></Word>
      </Content>
      <Footer
        style={{
          position: 'fixed',
          bottom: 0,
          width: '100vw',
          textAlign: 'center',
          height: '40px',
          padding: '40px',
        }}
      >
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  )
}
