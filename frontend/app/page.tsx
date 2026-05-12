'use client'

import { useState, useEffect, useRef } from 'react'
import { LoadingAnimation } from '@/components/loading-animation'
import { StartPage } from '@/components/start-page'
import { useAdmin } from '@/lib/admin-context'
import { Edit2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [startImageUrl, setStartImageUrl] = useState<string | undefined>()
  const [loadingSoundUrl, setLoadingSoundUrl] = useState<string | undefined>()
  const { isAdmin, login, logout } = useAdmin()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const soundInputRef = useRef<HTMLInputElement>(null)
  
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [adminError, setAdminError] = useState('')

  const handleAdminLogin = () => {
    if (login(adminPassword)) {
      setIsAdminOpen(false)
      setAdminPassword('')
      setAdminError('')
    } else {
      setAdminError('비밀번호가 일치하지 않습니다.')
    }
  }

  const handleAdminLogout = () => {
    logout()
  }

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings')
        if (res.ok) {
          const data = await res.json()
          if (data.start_page_image) {
            setStartImageUrl(data.start_page_image)
          }
          if (data.loading_sound_url) {
            setLoadingSoundUrl(data.loading_sound_url)
          }
        }
      } catch (e) {
        console.error(e)
      }
    }

    fetchSettings()
  }, [])

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (res.ok) {
        const { url } = await res.json()
        
        await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ start_page_image: url })
        })

        setStartImageUrl(url)
      }
    } catch (error) {
      console.error('Failed to upload image:', error)
    }
  }

  const handleSoundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (res.ok) {
        const { url } = await res.json()
        
        await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ loading_sound_url: url })
        })

        setLoadingSoundUrl(url)
        alert('로딩 효과음이 저장되었습니다.')
      }
    } catch (error) {
      console.error('Failed to upload sound:', error)
    }
  }

  return (
    <main className="min-h-screen relative">
      {/* Admin button - always visible */}
      <div className="fixed top-4 left-4 z-[60]">
        {isAdmin ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
              Admin Mode
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAdminLogout}
              className="text-xs h-7"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Dialog open={isAdminOpen} onOpenChange={setIsAdminOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground/50 hover:text-muted-foreground h-6 px-2"
              >
                Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md z-[70]">
              <DialogHeader>
                <DialogTitle>관리자 로그인</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Input
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value)
                    setAdminError('')
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAdminLogin()
                  }}
                />
                {adminError && (
                  <p className="text-sm text-destructive">{adminError}</p>
                )}
                <Button onClick={handleAdminLogin} className="w-full">
                  로그인
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading && (
        <>
          <LoadingAnimation onComplete={handleLoadingComplete} soundUrl={loadingSoundUrl} />
          {isAdmin && (
            <div className="fixed bottom-4 right-4 z-[60]">
              <input
                type="file"
                ref={soundInputRef}
                onChange={handleSoundUpload}
                accept="audio/*"
                className="hidden"
              />
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  soundInputRef.current?.click()
                }}
                className="flex h-10 px-4 items-center justify-center rounded-full bg-primary/20 backdrop-blur-sm hover:bg-primary/40 transition-colors text-primary-foreground shadow-lg text-sm"
              >
                효과음 업로드
              </button>
            </div>
          )}
        </>
      )}

      {!isLoading && (
        <>
          <StartPage imageUrl={startImageUrl} />

          {/* Admin button was moved out */}

          {isAdmin && (
            <div className="fixed bottom-4 right-4 z-50">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  fileInputRef.current?.click()
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 backdrop-blur-sm hover:bg-primary/40 transition-colors text-primary-foreground shadow-lg"
              >
                <Edit2 className="h-5 w-5" />
              </button>
            </div>
          )}
        </>
      )}
    </main>
  )
}
