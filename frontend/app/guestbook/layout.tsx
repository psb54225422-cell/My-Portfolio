import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guestbook | Artist Portfolio',
  description: 'Leave your mark in the guestbook',
}

export default function GuestbookLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
