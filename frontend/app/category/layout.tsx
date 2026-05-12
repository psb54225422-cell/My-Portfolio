import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gallery | Artist Portfolio',
  description: 'Browse illustrations, comics, and storyboards',
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
