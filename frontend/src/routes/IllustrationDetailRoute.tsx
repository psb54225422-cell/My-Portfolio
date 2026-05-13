import { useEffect, useState } from 'react'
import { IllustrationDetail } from '@/components/illustration-detail'
import type { Illustration, Comment } from '@/lib/types'

interface DetailRouteProps {
  id: string
}

export default function IllustrationDetailRoute({ id }: DetailRouteProps) {
  const [illustration, setIllustration] = useState<Illustration | null>(null)
  const [comments, setComments] = useState<Comment[]>([])

  useEffect(() => {
    let active = true
    fetch(`/api/works/illustration/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (!active) return
        setIllustration(data.work || null)
        setComments(data.comments || [])
      })
      .catch(() => {
        if (active) {
          setIllustration(null)
          setComments([])
        }
      })
    return () => {
      active = false
    }
  }, [id])

  if (!illustration) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Illustration not found</div>
  }

  return <IllustrationDetail illustration={illustration} comments={comments} />
}