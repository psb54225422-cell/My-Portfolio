'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CommentSection } from '@/components/comment-section'
import { CategoryNav } from '@/components/category-nav'
import type { Illustration, Comment } from '@/lib/types'

interface IllustrationDetailProps {
  illustration: Illustration
  comments: Comment[]
}

export function IllustrationDetail({ illustration, comments }: IllustrationDetailProps) {
  const [mounted, setMounted] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const images = illustration.images || []
  const hasMultipleImages = images.length > 1

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return
      if (e.key === 'Escape') setIsLightboxOpen(false)
      if (e.key === 'ArrowLeft') setCurrentImageIndex(prev => Math.max(0, prev - 1))
      if (e.key === 'ArrowRight') setCurrentImageIndex(prev => Math.min(images.length - 1, prev + 1))
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, images.length])

  return (
    <div className="min-h-screen relative bg-background">
      {/* Category Navigation */}
      <CategoryNav />

      {/* Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-background via-secondary/20 to-background" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col pt-16">
        {/* Main content */}
        <main className="flex-1 px-6 md:px-8 pb-12">
          <div
            className={`max-w-6xl mx-auto transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-12">
              {/* Image section */}
              <div className="space-y-4">
                {/* Main image */}
                <div
                  className="relative aspect-[4/3] bg-card border border-border rounded-lg overflow-hidden cursor-zoom-in"
                  onClick={() => images.length > 0 && setIsLightboxOpen(true)}
                >
                  {images[currentImageIndex] ? (
                    <Image
                      src={images[currentImageIndex]}
                      alt={illustration.title}
                      fill
                      className="object-contain"
                      priority
                    />
                  ) : illustration.thumbnail_url ? (
                    <Image
                      src={illustration.thumbnail_url}
                      alt={illustration.title}
                      fill
                      className="object-contain"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                      <svg className="w-20 h-20 text-muted-foreground/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {hasMultipleImages && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                          currentImageIndex === index
                            ? 'border-primary shadow-md'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${illustration.title} - ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info section */}
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <h1 className="text-2xl md:text-3xl font-serif font-medium text-foreground mb-2">
                    {illustration.title}
                  </h1>
                  <div className="w-12 h-0.5 bg-primary/50 rounded-full" />
                </div>

                {/* Description */}
                {illustration.description && (
                  <div className="bg-card/50 border border-border rounded-lg p-4">
                    <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                      {illustration.description}
                    </p>
                  </div>
                )}

                {/* Date */}
                <p className="text-sm text-muted-foreground">
                  {new Date(illustration.created_at).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>

                <CommentSection
                  contentType="illustration"
                  contentId={illustration.id}
                  initialComments={comments}
                />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 md:p-8 text-center">
          <p className="text-xs text-muted-foreground">
            Artist Portfolio
          </p>
        </footer>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 p-2 text-background/80 hover:text-background transition-colors"
            onClick={() => setIsLightboxOpen(false)}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Image */}
          <div
            className="relative w-full h-full max-w-5xl max-h-[90vh] p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[currentImageIndex]}
              alt={illustration.title}
              fill
              className="object-contain"
            />
          </div>

          {/* Navigation */}
          {hasMultipleImages && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-background/80 hover:text-background transition-colors disabled:opacity-30"
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentImageIndex(prev => Math.max(0, prev - 1))
                }}
                disabled={currentImageIndex === 0}
              >
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-background/80 hover:text-background transition-colors disabled:opacity-30"
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentImageIndex(prev => Math.min(images.length - 1, prev + 1))
                }}
                disabled={currentImageIndex === images.length - 1}
              >
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}

          {/* Counter */}
          {hasMultipleImages && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-background/10 rounded-full">
              <span className="text-sm text-background/80">
                {currentImageIndex + 1} / {images.length}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
