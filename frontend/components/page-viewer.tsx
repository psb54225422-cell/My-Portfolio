'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CommentSection } from '@/components/comment-section'
import { CategoryNav } from '@/components/category-nav'
import type { Comic, Storyboard, Comment } from '@/lib/types'

type WorkItem = Comic | Storyboard

interface PageViewerProps {
  work: WorkItem
  comments: Comment[]
  contentType: 'comic' | 'storyboard'
  backPath: string
  backLabel: string
}

export function PageViewer({ work, comments, contentType, backPath, backLabel }: PageViewerProps) {
  const [mounted, setMounted] = useState(false)

  const pages = work.pages || []

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen relative bg-background">
      {/* Category Navigation */}
      <CategoryNav />

      {/* Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-background via-secondary/20 to-background" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col pt-16">
        {/* Navigation Head */}
        <div className="px-6 md:px-8 py-4 flex justify-between items-center">
          <Link
            href={backPath}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-card border border-border rounded-full text-foreground hover:bg-secondary transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            {backLabel}
          </Link>
        </div>

        {/* Main content */}
        <main className="flex-1 px-6 md:px-8 pb-12">
          <div
            className={`max-w-7xl mx-auto transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex flex-col lg:flex-row gap-8">

              {/* Left Panel: Cover & Info (25%) */}
              <div className="w-full lg:w-1/4 shrink-0 space-y-6">
                {work.cover_url && (
                  <div className="relative aspect-[3/4] bg-card border border-border rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src={work.cover_url}
                      alt={work.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                )}

                <div>
                  <h1 className="text-2xl md:text-3xl font-serif font-medium text-foreground mb-3">
                    {work.title}
                  </h1>
                  {work.description && (
                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed text-sm">
                      {work.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-4">
                    {new Date(work.created_at).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Right Panel: Scrollable Pages (75%) */}
              <div className="w-full lg:w-3/4 flex flex-col items-center">
                {pages.length > 0 ? (
                  <div className="w-full max-w-2xl space-y-6 overflow-hidden rounded-lg pb-10">
                    {pages.map((page, index) => (
                      <div
                        key={index}
                        className="relative w-full flex justify-center bg-card border border-border shadow-sm rounded-lg"
                      >
                        <img
                          src={page}
                          alt={`Page ${index + 1}`}
                          className="max-w-full h-auto object-contain rounded-lg"
                          loading={index === 0 ? 'eager' : 'lazy'}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full flex justify-center py-20">
                    <div className="text-center">
                      <svg className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                      <h3 className="text-foreground font-medium mb-1">등록된 원고(페이지)가 없습니다</h3>
                      <p className="text-sm text-muted-foreground">업로드 시 여러 장을 선택해주세요.</p>
                    </div>
                  </div>
                )}
              </div>

            </div>

            <div className="mt-10 pt-6 border-t border-border">
              <CommentSection
                contentType={contentType}
                contentId={work.id}
                initialComments={comments}
              />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 md:p-8 text-center">
          <p className="text-xs text-muted-foreground">Artist Portfolio</p>
        </footer>
      </div>
    </div>
  )
}
