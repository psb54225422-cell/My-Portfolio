import { readDb } from '@/lib/local-db'
import { PageViewer } from '@/components/page-viewer'
import { notFound } from 'next/navigation'
import type { Comic, Comment } from '@/lib/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const db = await readDb()
  const comic = db.comics?.find(i => i.id === id || i.id?.toString() === id)

  return {
    title: comic ? `${comic.title} | Comics` : 'Comic',
    description: comic?.description || 'Read this comic',
  }
}

export default async function ComicDetailPage({ params }: PageProps) {
  const { id } = await params
  const db = await readDb()
  const comic = db.comics?.find(i => i.id === id || i.id?.toString() === id)

  if (!comic) {
    notFound()
  }

  const comments = (db as any).comments?.filter((c: any) => c.content_type === 'comic' && c.content_id === id).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) || []

  return (
    <PageViewer
      work={comic as Comic}
      comments={comments as Comment[]}
      contentType="comic"
      backPath="/comic"
      backLabel="Back to Comics"
    />
  )
}
