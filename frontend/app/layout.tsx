import type { Metadata, Viewport } from 'next'
import { Noto_Serif_KR, Noto_Sans_KR } from 'next/font/google'
import { AdminProvider } from '@/lib/admin-context'
import { GlobalBackButton } from '@/components/global-back-button'
import { BgmPlayer } from '@/components/bgm-player'
import { CursorSparkles } from '@/components/cursor-sparkles'
import './globals.css'

const notoSerifKR = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
})

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Artist Portfolio',
  description: 'Illustration, Comic & Storyboard Artist Portfolio',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#f0f7f0',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`${notoSerifKR.variable} ${notoSansKR.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen">
        <AdminProvider>
          {children}
          <CursorSparkles />
          <GlobalBackButton />
          <BgmPlayer />
        </AdminProvider>
      </body>
    </html>
  )
}
