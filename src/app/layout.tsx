import type { Metadata } from 'next'
import './globals.css'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import TopBar from '@/components/topbar/page'
import FloatGithub from '@/components/FloatGithub/FloatGithub'
import { SpeedInsights } from '@vercel/speed-insights/next'
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
              paddingTop: '80px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div className="main-container">{children}</div>
          </main>
          <FloatGithub></FloatGithub>
        </AntdRegistry>
        <SpeedInsights></SpeedInsights>
      </body>
    </html>
  )
}
