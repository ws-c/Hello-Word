import type { Metadata } from 'next'
import './globals.css'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import ThemeSwitcher from '@/components/ThemeSwitcher/ThemeSwitcher'
import { SearchOutlined, SettingOutlined } from '@ant-design/icons'
import Image from 'next/image'
import starBook from '@/assets/starBook.png'
import Link from 'next/link'
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
          <header className="header">
            <Link href="/">
              <div className="logo">
                <span>Hello Word</span>
              </div>
            </Link>
            <div className="tool-bar">
              <ThemeSwitcher></ThemeSwitcher>
              <div>
                <SearchOutlined className="Header-Font search-icon"></SearchOutlined>
              </div>
              <div>
                <Link href="/star-book">
                  <Image
                    className="Header-Font starBook-icon"
                    src={starBook}
                    alt="starBook"
                    width={30}
                    height={32}
                  ></Image>
                </Link>
              </div>
              <div>
                <SettingOutlined className="Header-Font"></SettingOutlined>
              </div>
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

          <footer className="Footer">
            Hello-Word ©{new Date().getFullYear()} Created by WGenji
          </footer>
        </AntdRegistry>
      </body>
    </html>
  )
}
