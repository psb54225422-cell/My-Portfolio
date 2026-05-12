import { WorkGrid } from '@/components/work-grid'
import type { Storyboard } from '@/lib/types'
import { readDb } from '@/lib/local-db'

export default async function StoryboardPage() {
  const db = await readDb()
  const storyboards = (db.storyboards || []) // Remove .reverse()

  return (
    <WorkGrid
      items={(storyboards as Storyboard[]) || []}
      title="Storyboards"
      subtitle="Visual Narratives & Sequences"
      basePath="/storyboard"
      emptyMessage="No storyboards yet"
    />
  )
}
