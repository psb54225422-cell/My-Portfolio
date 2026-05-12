'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface StartPageProps {
  imageUrl?: string
  onEnter?: () => void
}

export function StartPage({ imageUrl, onEnter }: StartPageProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Add a tiny delay to ensure proper fade-in logic
    const timer = setTimeout(() => {
      setMounted(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Link
      href="/category"
      onClick={onEnter}
      className="fixed inset-0 z-40 cursor-pointer"
    >
      <div 
        className="absolute inset-0 flex items-center justify-center bg-white"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`absolute inset-0 transition-all duration-[3500ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          mounted ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-105 blur-md'
        }`}>
          {/* Full screen image or placeholder */}
          {imageUrl ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={imageUrl}
                alt="Welcome"
                fill
                className={`object-contain transition-transform duration-700 ${
                  isHovered ? 'scale-[1.02]' : 'scale-100'
                }`}
                priority
              />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-muted flex items-center justify-center spring-pattern">
              <div
                className={`text-center space-y-6 p-8 transition-all duration-700 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
              {/* Decorative leaf */}
              <svg
                className="w-24 h-24 mx-auto text-primary/60 animate-sway"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-serif font-medium text-foreground">
                  Artist Portfolio
                </h1>
              </div>
            </div>
          </div>
        )}

        {/* Global Click to enter hint */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-60 animate-[pulse_3s_ease-in-out_infinite] pointer-events-none z-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-light">
            click to enter
          </p>
        </div>

        {/* Floating leaves (Fluttering green leaves) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes leaf-fall {
              0% { opacity: 0; transform: translateY(-10vh) rotate(0deg) translateX(0); }
              10% { opacity: 0.8; }
              50% { transform: translateY(50vh) rotate(180deg) translateX(30px); }
              90% { opacity: 0.8; }
              100% { opacity: 0; transform: translateY(110vh) rotate(360deg) translateX(-30px); }
            }
            .leaf {
              position: absolute;
              color: rgba(34, 197, 94, 0.6); /* Tailwind green-500 */
              animation: leaf-fall linear infinite;
            }
            `
          }} />
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="leaf"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 20 - 20}%`,
                animationDuration: `${Math.random() * 5 + 8}s`,
                animationDelay: `${Math.random() * 5}s`,
                width: `${Math.random() * 15 + 15}px`,
                height: `${Math.random() * 15 + 15}px`,
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
              </svg>
            </div>
          ))}
        </div>

        {/* Corner decorations - spring green */}
        <div className="absolute top-6 left-6 w-16 h-16 border-l-2 border-t-2 border-primary/30 rounded-tl-lg" />
        <div className="absolute top-6 right-6 w-16 h-16 border-r-2 border-t-2 border-primary/30 rounded-tr-lg" />
        <div className="absolute bottom-6 left-6 w-16 h-16 border-l-2 border-b-2 border-primary/30 rounded-bl-lg" />
        <div className="absolute bottom-6 right-6 w-16 h-16 border-r-2 border-b-2 border-primary/30 rounded-br-lg" />
      </div>
      </div>
    </Link>
  )
}
