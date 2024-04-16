import type { Metadata } from 'next'
import './globals.css'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import ThemeSwitcher from '@/components/ThemeSwitcher/ThemeSwitcher'
import { SearchOutlined, SettingOutlined } from '@ant-design/icons'
export const metadata: Metadata = {
  title: 'Hello Word',
  description: 'Created by WGenji',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-theme="">
      <body>
        <AntdRegistry>
          <header
            className='header'
          >
            <div className="logo">
              <span>Hello Word</span>
            </div>
            <div className="tool-bar">
              <ThemeSwitcher></ThemeSwitcher>
              <SearchOutlined className="Header-Font"></SearchOutlined>
              <SettingOutlined className="Header-Font"></SettingOutlined>
            </div>
          </header>
          <main
            style={{
              paddingTop: '96px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div className="main-container">{children}</div>
          </main>

          <footer
            style={{
              paddingTop: '40px',
              textAlign: 'center',
              height: '32px',
              lineHeight: '32px',
            }}
          >
            Local-word ©{new Date().getFullYear()} Created by WGenji
          </footer>
        </AntdRegistry>
      </body>
    </html>
  )
}
