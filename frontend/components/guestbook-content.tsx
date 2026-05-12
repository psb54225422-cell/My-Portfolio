'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { DrawingCanvas } from '@/components/drawing-canvas'
import { CategoryNav } from '@/components/category-nav'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import type { GuestbookEntry } from '@/lib/types'

interface GuestbookContentProps {
  initialEntries: GuestbookEntry[]
}

type ViewMode = 'grid' | 'draw'

export function GuestbookContent({ initialEntries }: GuestbookContentProps) {
  const [entries, setEntries] = useState<GuestbookEntry[]>(initialEntries)
  const [mounted, setMounted] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [selectedEntry, setSelectedEntry] = useState<GuestbookEntry | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleNewEntry = (newEntry: GuestbookEntry) => {
    setEntries(prev => [...prev, newEntry])
    setViewMode('grid')
  }

  // Helper to generate consistent pseudorandom rotation and offset per entry
  const getRandomStyle = (id: string | number) => {
    const stringId = String(id)
    const hash = stringId.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0)
        return a & a
    }, 0)
    
    // rotation between -20 and +20 degrees (more irregular)
    const rotate = (hash % 41) - 20 
    // slight margin top and left to make positioning chaotic
    const mt = (hash % 30)
    const ml = (hash % 16) - 8
    
    // cute pin colors: pink, yellow, blue, red
    const pinColors = ['bg-pink-400', 'bg-yellow-400', 'bg-blue-400', 'bg-red-400', 'bg-purple-400', 'bg-green-400']
    const pinColor = pinColors[Math.abs(hash) % pinColors.length]
    
    return { rotate, mt, ml, pinColor }
  }

  return (
    <div className="min-h-screen relative bg-background">
      {/* Category Navigation */}
      <CategoryNav />

      {/* Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-background via-secondary/20 to-background spring-pattern" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Main content */}
        <main className="flex-1 flex flex-col items-center px-4 py-24">
          <div
            className={`w-full max-w-5xl transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Title */}
            <div className="text-center mb-12 bg-white/80 w-max mx-auto px-8 py-4 rounded-xl shadow-sm border border-border backdrop-blur-md">
              <h1 className="text-3xl md:text-4xl font-serif font-medium text-foreground mb-2">
                방명록
              </h1>
              <p className="text-muted-foreground">
                {entries.length > 0 ? `${entries.length}개의 귀여운 메모가 걸려있어요` : '첫 번째 메모를 걸어주세요!'}
              </p>
            </div>

            {/* Grid mode - Board (칠판) view */}
            {viewMode === 'grid' && (
              <div className="w-full relative">
                {/* Floating Add Button */}
                <div className="fixed bottom-8 right-1/2 translate-x-1/2 z-50">
                   <Button
                     onClick={() => setViewMode('draw')}
                     className="rounded-full px-8 py-6 shadow-xl text-lg gap-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:scale-105"
                   >
                     <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 19l7-7 3 3-7 7-3-3z" />
                        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                     </svg>
                     새 메모 꽂기
                   </Button>
                </div>

                {/* The Board UI (칠판) */}
                <div className="bg-[#2e4736] border-[16px] border-[#6b4423] shadow-2xl rounded-sm mx-auto w-full relative overflow-hidden mb-12" style={{ minHeight: '65vh' }}>
                  {/* Chalkboard retro texture (noise + gradient) */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/40 pointer-events-none" />
                  <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')" }} />
                  {/* Chalk smudges (optional retro feel) */}
                  <div className="absolute top-10 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-10 right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

                  {/* Grid Content wrapper inside the board */}
                  <div className="relative z-10 p-8 md:p-12 pb-32">
                    {entries.length === 0 ? (
                      <div className="text-center py-32 text-white/70 mx-auto">
                        <svg className="w-16 h-16 mx-auto mb-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 19l7-7 3 3-7 7-3-3z" />
                          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                        </svg>
                        <p>아무도 흔적을 남기지 않았어요.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 pb-32">
                        {entries.map((entry) => {
                           if (!entry) return null; // Safe guard
                           const { rotate, mt, ml, pinColor } = getRandomStyle(entry.id)

                       return (
                         <div 
                           key={entry.id} 
                           className="relative flex justify-center group"
                           style={{ marginTop: `${mt}px`, marginLeft: `${ml}px` }}
                         >
                           {/* Polaroid Wrapper */}
                           <div 
                             className="relative bg-white p-2 pb-10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3)] hover:shadow-2xl hover:scale-110 transition-all duration-300 hover:z-50 border border-gray-100 cursor-pointer w-full max-w-[140px]"
                             style={{ transform: `rotate(${rotate}deg)` }}
                             onClick={() => setSelectedEntry(entry)}
                           >
                             {/* Cute Pin at Top Center */}
                             <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full shadow-md border-[1.5px] border-white z-10 flex items-center justify-center bg-gradient-to-br from-white/40 to-transparent">
                               <div className={`w-full h-full rounded-full ${pinColor} inset-0 absolute -z-10`} />
                               {/* Pin reflection */}
                               <div className="w-1.5 h-1.5 bg-white/60 rounded-full absolute top-1 left-1" />
                             </div>

                             {/* Image area */}
                             <div className="relative w-full aspect-square bg-[#fef9c3] border border-gray-100 overflow-hidden shadow-inner">
                               <Image
                                  src={entry.image_url}
                                  alt={`Guestbook entry #${entry.page_number}`}
                                  fill
                                  unoptimized
                                  className="object-contain"
                               />
                             </div>
                             
                             {/* Optional: Add a little page number or date at bottom if desired, else keep it blank like polaroid */}
                             <div className="absolute bottom-2 right-2 font-serif text-gray-400 text-xs">
                               No.{entry.page_number}
                             </div>
                           </div>
                         </div>
                       )
                    })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Draw mode */}
            {viewMode === 'draw' && (
              <div className="bg-white/80 p-4 md:p-8 rounded-2xl shadow-xl backdrop-blur-md max-w-2xl mx-auto">
                <DrawingCanvas
                  onSubmit={handleNewEntry}
                  onCancel={() => setViewMode('grid')}
                  pageNumber={entries.length + 1}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Enlarged View Dialog */}
      <Dialog open={!!selectedEntry} onOpenChange={(open) => !open && setSelectedEntry(null)}>
        <DialogContent className="max-w-max bg-transparent border-0 shadow-none">
          <DialogTitle className="sr-only">Memo Enlarged View</DialogTitle>
          <DialogDescription className="sr-only">Detailed view of the drawn memo</DialogDescription>
          {selectedEntry && (
            <div className="relative bg-white p-4 pb-16 shadow-2xl rounded-sm">
                <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] bg-[#fef9c3] border border-gray-200 shadow-inner">
                  <Image
                     src={selectedEntry.image_url}
                     alt={`Guestbook entry #${selectedEntry.page_number}`}
                     fill
                     unoptimized
                     className="object-contain"
                  />
                </div>
                <div className="absolute bottom-4 right-6 font-serif text-gray-400 text-xl">
                    No.{selectedEntry.page_number}
                </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

