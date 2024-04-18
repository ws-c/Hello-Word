import type { Metadata } from 'next'
import './globals.css'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { GithubOutlined } from '@ant-design/icons'
import Link from 'next/link'
import TopBar from '@/components/topbar/page'
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
          <TopBar></TopBar>

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
            <Link href={'https://github.com/WGenji/hello-word'}>
              <GithubOutlined className="github-icon" />
            </Link>
          </footer>
        </AntdRegistry>
      </body>
    </html>
  )
}
