import { readDb } from '@/lib/local-db'
import { IllustrationDetail } from '@/components/illustration-detail'
import { notFound } from 'next/navigation'
import type { Illustration, Comment } from '@/lib/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const db = await readDb()
  const illustration = db.illustrations?.find(i => i.id === id || i.id?.toString() === id)

  return {
    title: illustration ? `${illustration.title} | Illustrations` : 'Illustration',
    description: illustration?.description || 'View this illustration',
  }
}

export default async function IllustrationDetailPage({ params }: PageProps) {
  const { id } = await params
  const db = await readDb()
  const illustration = db.illustrations?.find(i => i.id === id || i.id?.toString() === id)

  if (!illustration) {
    notFound()
  }

  const comments = (db as any).comments?.filter((c: any) => c.content_type === 'illustration' && c.content_id === id).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) || []

  return (
    <IllustrationDetail
      illustration={illustration as Illustration}
      comments={comments as Comment[]}
    />
  )
}
