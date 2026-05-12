'use client'

import { useState, useTransition, useEffect } from 'react'
import type { Comment } from '@/lib/types'

interface CommentSectionProps {
  contentType: 'illustration' | 'comic' | 'storyboard'
  contentId: string
  initialComments?: Comment[]
}

export function CommentSection({ contentType, contentId, initialComments = [] }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [authorName, setAuthorName] = useState('')
  const [commentText, setCommentText] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  // Add fetch for when initialComments aren't provided (e.g. from a modal)
  useEffect(() => {
    if (initialComments.length === 0) {
      fetch(`/api/comments?content_type=${contentType}&content_id=${contentId}`)
        .then(res => res.json())
        .then(data => {
          if (data.comments) setComments(data.comments)
        })
        .catch(console.error)
    }
  }, [contentType, contentId, initialComments.length])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!authorName.trim() || !commentText.trim()) {
      setError('Please fill in all fields')
      return
    }

    startTransition(async () => {
      try {
        const res = await fetch('/api/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content_type: contentType,
            content_id: contentId,
            author_name: authorName.trim(),
            comment_text: commentText.trim(),
          })
        })

        if (!res.ok) throw new Error('업로드 실패')
        const { data } = await res.json()

        setComments(prev => [data as Comment, ...prev])
        setAuthorName('')
        setCommentText('')
      } catch (err) {
        setError('Failed to post comment. Please try again.')
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
        <h2 className="text-lg font-medium text-foreground">
          Comments ({comments.length})
        </h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Your name"
            maxLength={50}
            className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
        </div>
        <div>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Leave a comment..."
            rows={3}
            maxLength={500}
            className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
          />
        </div>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 bg-card/50 border border-border rounded-lg space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">
                  {comment.author_name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(comment.created_at).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <p className="text-foreground/90 text-sm leading-relaxed whitespace-pre-wrap">
                {comment.comment_text}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No comments yet. Be the first to leave one!
          </div>
        )}
      </div>
    </div>
  )
}
