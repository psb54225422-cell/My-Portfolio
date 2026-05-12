import { GuestbookContent } from '@/components/guestbook-content'
import type { GuestbookEntry } from '@/lib/types'
import { readDb } from '@/lib/local-db'

export default async function GuestbookPage() {
  const db = await readDb()
  const entries = db.guestbook_entries || []

  // Ensure entries are sorted by created_at ascending or descending as needed
  // Let's sort ascending so oldest is first
  const sortedEntries = [...entries].sort((a: any, b: any) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  return <GuestbookContent initialEntries={(sortedEntries as GuestbookEntry[]) || []} />
}
