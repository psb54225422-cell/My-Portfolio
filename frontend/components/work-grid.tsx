'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Comic, Storyboard } from '@/lib/types'
import { CategoryNav } from '@/components/category-nav'
import { useAdmin } from '@/lib/admin-context'
import { AddWorkDialog } from '@/components/add-work-dialog'
import { EditWorkDialog } from '@/components/edit-work-dialog'

type WorkItem = Comic | Storyboard

interface WorkGridProps {
  items: WorkItem[]
  title: string
  subtitle: string
  basePath: string
  emptyMessage: string
}

export function WorkGrid({ items, title, subtitle, basePath, emptyMessage }: WorkGridProps) {
  const [mounted, setMounted] = useState(false)
  const { isAdmin } = useAdmin()

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
        {/* Main content */}
        <main className="flex-1 px-6 md:px-8 pb-12">
          <div
            className={`max-w-7xl mx-auto transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Title & Admin Actions */}
            <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-medium text-foreground mb-3">
                  {title}
                </h1>
                <p className="text-muted-foreground">{subtitle}</p>
              </div>
              {isAdmin && (
                <AddWorkDialog type={basePath.includes('comic') ? 'comic' : 'storyboard'} />
              )}
            </div>

            {/* Grid */}
            {items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 stagger-children">
                {items.map((item) => (
                  <Link key={item.id} href={`${basePath}/${item.id}`} className="group">
                    <div className="relative aspect-[3/4] bg-card border border-border rounded-lg overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-xl">
                      {item.cover_url ? (
                        <Image
                          src={item.cover_url}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                          <svg className="w-16 h-16 text-muted-foreground/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                            <line x1="8" y1="21" x2="16" y2="21" />
                            <line x1="12" y1="17" x2="12" y2="21" />
                          </svg>
                        </div>
                      )}
                      {/* Book spine effect */}
                      <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-foreground/10 to-transparent" />
                      {/* Edit Button */}
                      {isAdmin && (
                        <div onClick={(e) => e.preventDefault()} className="absolute top-2 right-2 z-20">
                          <EditWorkDialog item={item} type={basePath.includes('comic') ? 'comic' : 'storyboard'} />
                        </div>
                      )}
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {/* Title on hover */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <h3 className="text-primary-foreground font-medium">
                          {item.title}
                        </h3>
                        {item.pages && item.pages.length > 0 && (
                          <p className="text-primary-foreground/70 text-sm mt-1">
                            {item.pages.length} pages
                          </p>
                        )}
                      </div>
                    </div>
                    {/* Title below */}
                    <div className="mt-4 px-1">
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <svg className="w-16 h-16 text-muted-foreground/30 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <h3 className="text-lg font-medium text-foreground mb-2">{emptyMessage}</h3>
                <p className="text-muted-foreground text-sm">Check back soon for new content</p>
              </div>
            )}
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
