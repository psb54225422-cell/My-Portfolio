import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comics | Artist Portfolio',
  description: 'Browse sequential art and stories',
}

export default function ComicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
