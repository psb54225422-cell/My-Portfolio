'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import type { GuestbookEntry } from '@/lib/types'

interface DrawingCanvasProps {
  onSubmit: (entry: GuestbookEntry) => void
  onCancel: () => void
  pageNumber: number
}

type Tool = 'pen' | 'eraser' | 'text'

const PEN_SIZES = [2, 6, 12]
const ERASER_SIZES = [10, 20, 40]
const COLORS = [
  '#1a1a1a', // Black
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#a855f7', // Purple
  '#ffffff', // White
]

export function DrawingCanvas({ onSubmit, onCancel, pageNumber }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState<Tool>('pen')
  const [color, setColor] = useState(COLORS[0])
  const [penSize, setPenSize] = useState(1) // index
  const [eraserSize, setEraserSize] = useState(1) // index
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [textInput, setTextInput] = useState('')
  const [textPosition, setTextPosition] = useState<{ x: number; y: number } | null>(null)
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  const historyRef = useRef<ImageData[]>([])
  const [canUndo, setCanUndo] = useState(false)

  const saveHistory = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    historyRef.current.push(imageData)
    if (historyRef.current.length > 20) {
      historyRef.current.shift()
    }
    setCanUndo(historyRef.current.length > 1)
  }, [])

  const undo = useCallback(() => {
    if (historyRef.current.length <= 1) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    // Remove current state
    historyRef.current.pop()
    
    // Get previous state
    const previousState = historyRef.current[historyRef.current.length - 1]
    ctx.putImageData(previousState, 0, 0)
    
    setCanUndo(historyRef.current.length > 1)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    // Set canvas size
    const rect = container.getBoundingClientRect()
    const size = Math.min(rect.width, 500)
    canvas.width = size
    canvas.height = size

    // Fill with yellow memo background
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#fef9c3' // Yellow memo color
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Add subtle lines like a memo pad
      ctx.strokeStyle = '#fde047'
      ctx.lineWidth = 1
      for (let y = 30; y < canvas.height; y += 30) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Clear history when initializing
      historyRef.current = []
      saveHistory()
    }
  }, [saveHistory])

  const getCoordinates = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    if ('touches' in e) {
      const touch = e.touches[0]
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      }
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      }
    }
  }, [])

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const coords = getCoordinates(e)
    if (!coords) return

    if (tool === 'text') {
      setTextPosition(coords)
      return
    }

    setIsDrawing(true)
    lastPos.current = coords

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    const size = tool === 'pen' ? PEN_SIZES[penSize] : ERASER_SIZES[eraserSize]

    ctx.beginPath()
    ctx.arc(coords.x, coords.y, size / 2, 0, Math.PI * 2)
    ctx.fillStyle = tool === 'pen' ? color : '#fef9c3'
    ctx.fill()
  }, [tool, penSize, eraserSize, getCoordinates, color])

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || tool === 'text') return
    e.preventDefault()

    const coords = getCoordinates(e)
    if (!coords || !lastPos.current) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    const size = tool === 'pen' ? PEN_SIZES[penSize] : ERASER_SIZES[eraserSize]

    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(coords.x, coords.y)
    ctx.strokeStyle = tool === 'pen' ? color : '#fef9c3'
    ctx.lineWidth = size
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()

    lastPos.current = coords
  }, [isDrawing, tool, penSize, eraserSize, getCoordinates, color])

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false)
      lastPos.current = null
      saveHistory()
    }
  }, [isDrawing, saveHistory])

  const addText = useCallback(() => {
    if (!textPosition || !textInput.trim()) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    ctx.font = '14px "Noto Sans KR", sans-serif'
    ctx.fillStyle = color
    ctx.fillText(textInput, textPosition.x, textPosition.y)

    setTextInput('')
    setTextPosition(null)
    saveHistory()
  }, [textInput, textPosition, color, saveHistory])

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    ctx.fillStyle = '#fef9c3'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Redraw lines
    ctx.strokeStyle = '#fde047'
    ctx.lineWidth = 1
    for (let y = 30; y < canvas.height; y += 30) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }
    saveHistory()
  }, [saveHistory])

  const handleSubmit = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob)
            else reject(new Error('Failed to create image'))
          },
          'image/png',
          0.9
        )
      })

      // Upload to Vercel Blob
      const formData = new FormData()
      formData.append('file', blob, `guestbook-${Date.now()}.png`)
      formData.append('pageNumber', pageNumber.toString())

      const response = await fetch('/api/guestbook/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload')
      }

      const data = await response.json()
      onSubmit(data.entry as GuestbookEntry)
    } catch (err) {
      setError('저장에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Tools */}
      <div className="max-w-[500px] mx-auto flex items-center justify-center gap-4">
        {/* Pen tool */}
        <button
          onClick={() => setTool('pen')}
          className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all ${
            tool === 'pen' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-secondary'
          }`}
          title="펜"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19l7-7 3 3-7 7-3-3z" />
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="M2 2l7.586 7.586" />
          </svg>
          <span className="text-xs">펜</span>
        </button>

        {/* Eraser tool */}
        <button
          onClick={() => setTool('eraser')}
          className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all ${
            tool === 'eraser' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-secondary'
          }`}
          title="지우개"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
            <path d="M22 21H7" />
            <path d="m5 11 9 9" />
          </svg>
          <span className="text-xs">지우개</span>
        </button>

        {/* Text tool */}
        <button
          onClick={() => setTool('text')}
          className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all ${
            tool === 'text' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-secondary'
          }`}
          title="텍스트"
        >
          <span className="text-xl font-bold">A</span>
          <span className="text-xs">텍스트</span>
        </button>
      </div>

      {/* Colors (only for pen & text) */}
      {tool !== 'eraser' && (
        <div className="max-w-[500px] mx-auto flex flex-wrap items-center justify-center gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                color === c ? 'border-primary scale-110 shadow-md' : 'border-border/50 hover:scale-105'
              }`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>
      )}

      {/* Size selector for pen/eraser */}
      {tool !== 'text' && (
        <div className="max-w-[500px] mx-auto flex items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground mr-2">크기:</span>
          {(tool === 'pen' ? PEN_SIZES : ERASER_SIZES).map((size, index) => (
            <button
              key={size}
              onClick={() => tool === 'pen' ? setPenSize(index) : setEraserSize(index)}
              className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all ${
                (tool === 'pen' ? penSize : eraserSize) === index
                  ? 'border-primary bg-secondary'
                  : 'border-border bg-card hover:bg-secondary'
              }`}
            >
              <div
                className="rounded-full bg-foreground"
                style={{ width: Math.min(size, 20), height: Math.min(size, 20) }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Text input when text tool is selected and position is set */}
      {tool === 'text' && textPosition && (
        <div className="max-w-[500px] mx-auto flex items-center gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="텍스트를 입력하세요 (14px)"
            className="flex-1 px-3 py-2 bg-card border border-border rounded-lg text-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') addText()
            }}
          />
          <button
            onClick={addText}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm"
          >
            추가
          </button>
          <button
            onClick={() => setTextPosition(null)}
            className="px-3 py-2 bg-card border border-border rounded-lg text-sm"
          >
            취소
          </button>
        </div>
      )}

      {tool === 'text' && !textPosition && (
        <p className="text-center text-sm text-muted-foreground">
          캔버스를 클릭하여 텍스트 위치를 지정하세요
        </p>
      )}

      {/* Canvas container - Yellow memo paper style */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[500px] mx-auto"
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full aspect-square rounded-lg shadow-lg cursor-crosshair touch-none memo-paper"
          style={{ maxWidth: '500px' }}
        />
        {/* Memo paper tape decoration */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-primary/30 rotate-2 rounded-sm" />
      </div>

      {/* Actions */}
      <div className="max-w-[500px] mx-auto flex items-center gap-2">
        <button
          onClick={onCancel}
          className="px-3 py-2 bg-card border border-border rounded-lg text-foreground hover:bg-secondary transition-all text-sm"
        >
          취소
        </button>
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-1 ${
            canUndo
              ? 'bg-card border border-border text-foreground hover:bg-secondary'
              : 'bg-card/50 border border-border/50 text-muted-foreground cursor-not-allowed'
          }`}
          title="뒤로가기"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7v6h6" />
            <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
          </svg>
        </button>
        <button
          onClick={clearCanvas}
          className="px-3 py-2 bg-card border border-border rounded-lg text-foreground hover:bg-secondary transition-all text-sm"
        >
          전체 지우기
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isSubmitting ? '저장 중...' : '저장하기'}
        </button>
      </div>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}
    </div>
  )
}
