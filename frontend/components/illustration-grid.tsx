'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Illustration } from '@/lib/types'
import { CategoryNav } from '@/components/category-nav'
import { useAdmin } from '@/lib/admin-context'
import { AddWorkDialog } from '@/components/add-work-dialog'
import { EditWorkDialog } from '@/components/edit-work-dialog'
import { IllustrationModal } from '@/components/illustration-modal'

interface IllustrationGridProps {
  illustrations: Illustration[]
}

export function IllustrationGrid({ illustrations }: IllustrationGridProps) {
  const [mounted, setMounted] = useState(false)
  const [selectedIllustration, setSelectedIllustration] = useState<Illustration | null>(null)
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
                  Illustrations
                </h1>
                <p className="text-muted-foreground">
                  Digital & Traditional Artworks
                </p>
              </div>
              {isAdmin && (
                <AddWorkDialog type="illustration" />
              )}
            </div>

            {/* Grid */}
            {illustrations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
                {illustrations.map((illustration) => (
                  <div key={illustration.id} className="group cursor-pointer" onClick={() => setSelectedIllustration(illustration)}>
                    <div className="relative aspect-[4/5] bg-card border border-border rounded-lg overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                      {illustration.thumbnail_url ? (
                        <Image
                          src={illustration.thumbnail_url}
                          alt={illustration.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                          <svg className="w-12 h-12 text-muted-foreground/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        </div>
                      )}
                      {/* Edit Button */}
                      {isAdmin && (
                        <div onClick={(e) => { e.stopPropagation(); }} className="absolute top-2 right-2 z-20">
                          <EditWorkDialog item={illustration} type="illustration" />
                        </div>
                      )}
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {/* Title on hover */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <h3 className="text-primary-foreground font-medium truncate">
                          {illustration.title}
                        </h3>
                      </div>
                    </div>
                    {/* Title below */}
                    <div className="mt-3 px-1">
                      <h3 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {illustration.title}
                      </h3>
                      {illustration.description && (
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {illustration.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <svg className="w-16 h-16 text-muted-foreground/30 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <h3 className="text-lg font-medium text-foreground mb-2">No illustrations yet</h3>
                <p className="text-muted-foreground text-sm">
                  Check back soon for new artworks
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 md:p-8 text-center">
          <p className="text-xs text-muted-foreground">
            Artist Portfolio
          </p>
        </footer>
      </div>

      {/* Illustration Modal */}
      {selectedIllustration && (
        <IllustrationModal 
          illustration={selectedIllustration} 
          open={!!selectedIllustration} 
          onOpenChange={(open) => {
            if (!open) setSelectedIllustration(null)
          }} 
        />
      )}
    </div>
  )
}
