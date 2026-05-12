'use client'

import { useState, useRef, useEffect } from 'react'
import { useAdmin } from '@/lib/admin-context'

export function BgmPlayer() {
  const [isPlaying, setIsPlaying] = useState(true) // Default to true as user requested
  const [bgmUrl, setBgmUrl] = useState<string>('') // Default empty, wait for DB
  const [isUploading, setIsUploading] = useState(false)
  const [volume, setVolume] = useState(0.35) // Default lower volume (35%)
  const audioRef = useRef<HTMLAudioElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { isAdmin } = useAdmin()

  // Apply volume whenever volume state or bgmUrl changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume, bgmUrl])

  // Fetch BGM URL from site settings on mount
  useEffect(() => {
    async function fetchBgmUrl() {
      try {
        const response = await fetch('/api/settings')
        if (response.ok) {
          const settings = await response.json()
          if (settings.bgm_url) {
            setBgmUrl(settings.bgm_url)
          }
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err)
      }
    }
    fetchBgmUrl()
  }, [])

  // Attempt to autoplay if bgmUrl loads and isPlaying is true
  useEffect(() => {
    if (bgmUrl && isPlaying && audioRef.current) {
      const playPromise = audioRef.current.play()
      
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('Autoplay blocked by browser. User interaction needed:', err)
          // Don't set isPlaying to false immediately, wait for user interaction
          const playOnInteraction = () => {
            if (audioRef.current && isPlaying) {
              audioRef.current.play().catch(e => console.error(e))
            }
            document.removeEventListener('click', playOnInteraction)
            document.removeEventListener('keydown', playOnInteraction)
          }
          
          document.addEventListener('click', playOnInteraction)
          document.addEventListener('keydown', playOnInteraction)
        })
      }
    }
  }, [bgmUrl, isPlaying])

  const togglePlay = () => {
    if (!bgmUrl) {
      alert('등록된 BGM 음원이 없습니다. 관리자 계정으로 BGM을 먼저 업로드해주세요.')
      return
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        // Attempt to play and catch errors (like no supported sources)
        audioRef.current.play().then(() => {
          setIsPlaying(true)
        }).catch(err => {
          console.error('Audio play error:', err)
          alert('음원을 재생할 수 없습니다. 파일 형식이 지원되지 않거나 경로가 잘못되었습니다.')
          setIsPlaying(false)
        })
      }
    }
  }

  // Handle automatic pause when unmounting (optional but good practice)
  useEffect(() => {
    const audio = audioRef.current
    return () => {
      if (audio) {
        audio.pause()
      }
    }
  }, [])

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const { url } = await response.json()
        
        // Save the BGM URL in local DB via API
        await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bgm_url: url })
        })

        setBgmUrl(url)
        setIsPlaying(true) // Autoplay it right after upload
        if (audioRef.current) {
          audioRef.current.load();
          audioRef.current.play().catch(e => console.error("Play failed", e));
        }
      }
    } catch (error) {
      console.error('BGM Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {isAdmin && (
        <div className="rounded-full bg-background/80 backdrop-blur shadow-sm p-1 border border-border">
          <input
            type="file"
            accept="audio/mp3,audio/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button
            onClick={handleUploadClick}
            disabled={isUploading}
            className="flex items-center justify-center w-8 h-8 rounded-full text-foreground hover:bg-secondary transition-all"
            title="BGM 업로드 (관리자 전용)"
          >
            {isUploading ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="0.75" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* audio tag with dynamic URL, won't try to fetch invalid sources if bgmUrl is empty */}
      {bgmUrl && <audio ref={audioRef} src={bgmUrl} loop />}
      
      <div className="flex items-center gap-2 bg-background/80 backdrop-blur border border-border rounded-full p-1.5 shadow-sm group transition-all duration-300">
        <button
          onClick={togglePlay}
          className="flex items-center justify-center w-8 h-8 rounded-full text-foreground hover:bg-secondary transition-all"
          title={isPlaying ? "BGM 끄기" : "BGM 켜기"}
        >
          {isPlaying ? (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          ) : (
            <div className="relative">
              <svg className="w-4 h-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
              <svg className="absolute -top-1 -left-1 w-6 h-6 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="2" y1="2" x2="22" y2="22" />
              </svg>
            </div>
          )}
        </button>

        {/* Volume Slider (expands on hover) */}
        <div className="w-0 overflow-hidden group-hover:w-20 transition-all duration-300 ease-out flex items-center pr-1.5">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            title="볼륨 조절"
          />
        </div>
      </div>
    </div>
  )
}
