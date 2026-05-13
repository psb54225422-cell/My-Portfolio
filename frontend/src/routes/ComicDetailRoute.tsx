import { useEffect, useState } from 'react'
import { PageViewer } from '@/components/page-viewer'
import type { Comic, Comment } from '@/lib/types'

interface DetailRouteProps {
  id: string
}

export default function ComicDetailRoute({ id }: DetailRouteProps) {
  const [work, setWork] = useState<Comic | null>(null)
  const [comments, setComments] = useState<Comment[]>([])

  useEffect(() => {
    let active = true
    fetch(`/api/works/comic/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (!active) return
        setWork(data.work || null)
        setComments(data.comments || [])
      })
      .catch(() => {
        if (active) {
          setWork(null)
          setComments([])
        }
      })
    return () => {
      active = false
    }
  }, [id])

  if (!work) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Comic not found</div>
  }

  return <PageViewer work={work} comments={comments} contentType="comic" backPath="/comic" backLabel="Back to Comics" />
}