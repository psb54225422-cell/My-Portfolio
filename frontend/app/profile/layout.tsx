import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile | Artist Portfolio',
  description: 'About the artist',
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
