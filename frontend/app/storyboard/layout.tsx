import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Storyboards | Artist Portfolio',
  description: 'Browse visual narratives and sequences',
}

export default function StoryboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
