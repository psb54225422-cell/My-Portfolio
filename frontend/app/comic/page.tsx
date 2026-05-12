import { WorkGrid } from '@/components/work-grid'
import type { Comic } from '@/lib/types'
import { readDb } from '@/lib/local-db'

export default async function ComicPage() {
  const db = await readDb()
  const comics = (db.comics || []) // Remove .reverse()

  return (
    <WorkGrid
      items={(comics as Comic[]) || []}
      title="Comics"
      subtitle="Sequential Art & Stories"
      basePath="/comic"
      emptyMessage="No comics yet"
    />
  )
}
