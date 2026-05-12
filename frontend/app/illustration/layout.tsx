import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Illustrations | Artist Portfolio',
  description: 'Browse digital and traditional artworks',
}

export default function IllustrationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
