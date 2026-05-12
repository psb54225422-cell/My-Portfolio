'use client'

import { useEffect, useRef, useState } from 'react'

type Sparkle = {
  id: number
  x: number
  y: number
  size: number
  driftX: number
  driftY: number
  rotation: number
  opacity: number
}

let sparkleId = 0

export function CursorSparkles() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])
  const activeRef = useRef(true)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(pointer: fine)').matches

    if (reducedMotion || !finePointer) {
      activeRef.current = false
      return
    }

    const addSparkles = (clientX: number, clientY: number) => {
      const burst = Array.from({ length: 1 }).map((_, index) => ({
        id: sparkleId + index + 1,
        x: clientX + (Math.random() - 0.5) * 6,
        y: clientY + (Math.random() - 0.5) * 6,
        size: 3 + Math.random() * 4,
        driftX: (Math.random() - 0.5) * 28,
        driftY: -8 - Math.random() * 20,
        rotation: Math.random() * 180,
        opacity: 0.32 + Math.random() * 0.22,
      }))

      sparkleId += burst.length
      setSparkles((current) => [...current, ...burst].slice(-48))
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!activeRef.current) return
      addSparkles(event.clientX, event.clientY)
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!activeRef.current) return
      addSparkles(event.clientX, event.clientY)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerdown', handlePointerDown, { passive: true })

    const tick = window.setInterval(() => {
      setSparkles((current) =>
        current
          .map((sparkle) => ({
            ...sparkle,
            x: sparkle.x + sparkle.driftX * 0.02,
            y: sparkle.y + sparkle.driftY * 0.02,
            opacity: Math.max(0, sparkle.opacity - 0.02),
          }))
          .filter((sparkle) => sparkle.opacity > 0.02)
      )
    }, 16)

    return () => {
      activeRef.current = false
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.clearInterval(tick)
    }
  }, [])

  if (sparkles.length === 0) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="absolute mix-blend-screen"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            width: sparkle.size,
            height: sparkle.size,
            opacity: sparkle.opacity,
            transform: `translate(-50%, -50%) rotate(${sparkle.rotation}deg)`,
            background:
              'radial-gradient(circle at 35% 35%, rgba(220,255,220,1) 0%, rgba(110,255,132,0.95) 20%, rgba(22,163,74,0.72) 44%, rgba(5,150,105,0.28) 68%, rgba(5,150,105,0) 100%)',
            clipPath: 'polygon(50% 0%, 61% 34%, 98% 35%, 69% 57%, 79% 91%, 50% 70%, 21% 91%, 31% 57%, 2% 35%, 39% 34%)',
            boxShadow: '0 0 6px rgba(22, 163, 74, 0.5), 0 0 14px rgba(5, 150, 105, 0.28)',
            filter: 'blur(0.35px)',
            transition: 'opacity 120ms linear',
          }}
        />
      ))}
    </div>
  )
}