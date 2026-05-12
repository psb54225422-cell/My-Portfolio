'use client'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import type { Illustration } from '@/lib/types'

export function IllustrationModal({ illustration, open, onOpenChange }: { illustration: Illustration; open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-[95vw] max-h-[95vh] w-fit p-0 border-none bg-transparent shadow-none flex items-center justify-center focus:outline-none [&>button]:hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle className="sr-only">{illustration.title}</DialogTitle>
        
        <div className="relative inline-flex items-center justify-center">
          <img 
            src={illustration.image_url || illustration.thumbnail_url} 
            alt={illustration.title}
            className="max-w-[95vw] max-h-[95vh] w-auto h-auto object-contain rounded-md"
          />

          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/70 text-white rounded-full transition-colors z-50 backdrop-blur-sm"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
