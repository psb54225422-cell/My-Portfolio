import { useEffect, useState } from 'react'
import { GuestbookContent } from '@/components/guestbook-content'
import type { GuestbookEntry } from '@/lib/types'

export default function GuestbookRoute() {
  const [entries, setEntries] = useState<GuestbookEntry[] | undefined>(undefined)

  useEffect(() => {
    let active = true

    fetch('/api/guestbook')
      .then((response) => response.json())
      .then((data) => {
        if (active) {
          setEntries(data.entries || [])
        }
      })
      .catch(() => {
        if (active) setEntries([])
      })

    return () => {
      active = false
    }
  }, [])

  if (entries === undefined) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading guestbook...</div>
  }

  return <GuestbookContent initialEntries={entries} />
}