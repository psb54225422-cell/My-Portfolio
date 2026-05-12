import { readDb } from '@/lib/local-db'
import { PageViewer } from '@/components/page-viewer'
import { notFound } from 'next/navigation'
import type { Storyboard, Comment } from '@/lib/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const db = await readDb()
  const storyboard = db.storyboards?.find(i => i.id === id || i.id?.toString() === id)

  return {
    title: storyboard ? `${storyboard.title} | Storyboards` : 'Storyboard',
    description: storyboard?.description || 'View this storyboard',
  }
}

export default async function StoryboardDetailPage({ params }: PageProps) {
  const { id } = await params
  const db = await readDb()
  const storyboard = db.storyboards?.find(i => i.id === id || i.id?.toString() === id)

  if (!storyboard) {
    notFound()
  }

  const comments = (db as any).comments?.filter((c: any) => c.content_type === 'storyboard' && c.content_id === id).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) || []

  return (
    <PageViewer
      work={storyboard as Storyboard}
      comments={comments as Comment[]}
      contentType="storyboard"
      backPath="/storyboard"
      backLabel="Back to Storyboards"
    />
  )
}
