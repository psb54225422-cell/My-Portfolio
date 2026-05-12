'use client'

import { useEffect, useState, useRef } from 'react'

interface LoadingAnimationProps {
  onComplete: () => void
  soundUrl?: string
}

export function LoadingAnimation({ onComplete, soundUrl }: LoadingAnimationProps) {
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const skipLoading = () => {
    setFadeOut(true)
    setTimeout(onComplete, 800)
  }

  useEffect(() => {
    // Try to play sound on mount if url provided
    if (soundUrl && audioRef.current) {
      audioRef.current.volume = 0.5
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log('Audio auto-play blocked by browser. Will play on interaction.', err)
        })
      }
    }

    const duration = 2500
    const interval = 30
    const increment = 100 / (duration / interval)

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment
        if (next >= 100) {
          clearInterval(timer)
          return 100
        }
        return next
      })
    }, interval)

    return () => clearInterval(timer)
  }, [soundUrl])

  const handleContainerClick = () => {
    if (soundUrl && audioRef.current) {
      // Play sound on first click if blocked initially
      audioRef.current.play().catch(()=> {})
    }
    
    if (progress >= 100) {
      setFadeOut(true)
      setTimeout(onComplete, 800)
    }
  }

  return (
    <div
      onClick={handleContainerClick}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white ${
        progress >= 100 ? 'cursor-pointer' : ''
      }`}
    >
      {soundUrl && <audio ref={audioRef} src={soundUrl} />}
      
      {/* Wrapper that fades OUT */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        fadeOut ? 'opacity-0 scale-110 blur-xl' : 'opacity-100 scale-100 blur-0'
      }`}>
        {/* Floating leaves decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-leaf-fall"
              style={{
                left: `${15 + i * 15}%`,
                animationDelay: `${i * 1.2}s`,
                animationDuration: `${6 + i}s`,
              }}
            >
              <svg
                className="w-4 h-4 text-primary/30"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
              </svg>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex flex-col items-center gap-8">
          {/* Animated leaf icon */}
          <div className="relative">
            <svg
              className="w-16 h-16 text-primary animate-sway"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-primary/20 rounded-full blur-sm" />
          </div>

          {/* Loading text */}
          <div className="text-center space-y-2">
            <h2 className="text-lg font-serif tracking-wide text-foreground/80">
              Loading...
          </h2>
          <p className="text-sm text-muted-foreground font-light">
            Preparing your experience
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress percentage & Click to enter */}
        <div className="h-4 flex items-center justify-center">
          {progress >= 100 ? (
            <span className="text-[11px] uppercase tracking-[0.2em] text-foreground/60 animate-pulse font-medium">
              Click to Enter
            </span>
          ) : (
            <span className="text-xs text-muted-foreground font-mono tabular-nums">
              {Math.round(progress)}%
            </span>
          )}
        </div>
      </div>

      {/* Spring pattern overlay */}
      <div className="absolute inset-0 spring-pattern pointer-events-none" />
      
      </div>
    </div>
  )
}
