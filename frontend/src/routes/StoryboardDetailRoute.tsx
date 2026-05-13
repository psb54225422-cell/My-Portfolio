import { useEffect, useState } from 'react'
import { PageViewer } from '@/components/page-viewer'
import type { Storyboard, Comment } from '@/lib/types'

interface DetailRouteProps {
  id: string
}

export default function StoryboardDetailRoute({ id }: DetailRouteProps) {
  const [work, setWork] = useState<Storyboard | null>(null)
  const [comments, setComments] = useState<Comment[]>([])

  useEffect(() => {
    let active = true
    fetch(`/api/works/storyboard/${id}`)
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
    return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Storyboard not found</div>
  }

  return <PageViewer work={work} comments={comments} contentType="storyboard" backPath="/storyboard" backLabel="Back to Storyboards" />
}