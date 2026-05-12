import { IllustrationGrid } from '@/components/illustration-grid'
import type { Illustration } from '@/lib/types'
import { readDb } from '@/lib/local-db'

export default async function IllustrationPage() {
  const db = await readDb()
  const illustrations = (db.illustrations || []) // Remove .reverse() to show newest at the bottom/right

  return <IllustrationGrid illustrations={(illustrations as Illustration[]) || []} />
}
