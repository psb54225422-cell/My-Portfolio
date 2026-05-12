'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useAdmin } from '@/lib/admin-context'
import { CategoryNav } from '@/components/category-nav'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { Profile, SnsLink } from '@/lib/types'

interface ProfileContentProps {
  profile: Profile | null
}

const defaultSnsIcons: Record<string, React.ReactNode> = {
  instagram: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  x: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.95H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  twitter: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l16 16m0-16L4 20" />
    </svg>
  ),
  youtube: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  ),
  email: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  website: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
}

export function ProfileContent({ profile: initialProfile }: ProfileContentProps) {
  const { isAdmin } = useAdmin()
  const [mounted, setMounted] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(initialProfile)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [petals, setPetals] = useState<Array<{ id: number, left: string, animationDuration: string, animationDelay: string, size: string, rotation: string }>>([])
  const [editForm, setEditForm] = useState({
    artistName: initialProfile?.artist_name || 'Artist Name',
    shortDescription: initialProfile?.short_description || 'Illustrator & Storyboard Artist',
    description: initialProfile?.description || '',
    career: initialProfile?.career || '',
    snsLinks: initialProfile?.sns_links || [],
  })
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
    setPetals(Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 5 + 6}s`,
      animationDelay: `${Math.random() * 5}s`,
      size: `${Math.random() * 12 + 10}px`,
      rotation: `${Math.random() * 360}deg`,
    })))
  }, [])

  useEffect(() => {
    if (profile) {
      setEditForm({
        artistName: profile.artist_name || 'Artist Name',
        shortDescription: profile.short_description || 'Illustrator & Storyboard Artist',
        description: profile.description || '',
        career: profile.career || '',
        snsLinks: profile.sns_links || [],
      })
    }
  }, [profile])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        
        // Save to local profile API
        const profileRes = await fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile_image_url: url })
        })
        
        if (profileRes.ok) {
          const data = await profileRes.json()
          setProfile(data)
        } else {
          // Local fallback if API fails
          setProfile(prev => prev ? { ...prev, profile_image_url: url } : { id: 'new', profile_image_url: url } as Profile)
        }
        
        alert('프로필 이미지가 성공적으로 변경되었습니다.')
      } else {
        alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('업로드 중 오류가 발생했습니다.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSaveProfile = async () => {
    const profileData = {
      artist_name: editForm.artistName,
      short_description: editForm.shortDescription,
      description: editForm.description,
      career: editForm.career,
      sns_links: editForm.snsLinks,
    }

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      })

      if (res.ok) {
        const data = await res.json()
        setProfile(data)
      } else {
        alert('프로필 저장 중 오류가 발생했습니다.')
      }
    } catch (err) {
      console.error('Failed to save profile:', err)
      alert('네트워크 오류가 발생했습니다.')
    }

    setIsEditOpen(false)
    alert('프로필 변경사항이 저장되었습니다.')
  }

  const addSnsLink = () => {
    setEditForm(prev => ({
      ...prev,
      snsLinks: [...prev.snsLinks, { platform: '', url: '' }],
    }))
  }

  const removeSnsLink = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      snsLinks: prev.snsLinks.filter((_, i) => i !== index),
    }))
  }

  const updateSnsLink = (index: number, field: 'platform' | 'url', value: string) => {
    setEditForm(prev => ({
      ...prev,
      snsLinks: prev.snsLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      ),
    }))
  }

  // If user hasn't set any, showcase X and instagram conditionally
  const snsLinks = profile?.sns_links?.length 
    ? profile.sns_links 
    : [
        { platform: 'x', url: 'https://x.com/' },
        { platform: 'instagram', url: 'https://instagram.com/' }
      ]

  return (
    <div className="min-h-screen relative bg-background overflow-hidden">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes petal-fall {
          0% { opacity: 1; transform: translateY(-10vh) rotate(0deg) translateX(0); }
          50% { transform: translateY(50vh) rotate(360deg) translateX(50px); }
          100% { opacity: 0; transform: translateY(110vh) rotate(720deg) translateX(-20px); }
        }
        .petal {
          position: fixed;
          top: -50px;
          pointer-events: none;
          background: rgba(253, 224, 71, 0.7); /* Tailwind yellow-300 with opacity */
          border-radius: 50% 0 50% 50%;
          box-shadow: inset 1px -1px 2px rgba(0,0,0,0.1);
        }
        `
      }} />

      {/* Falling Petals */}
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="petal z-10"
          style={{
            left: petal.left,
            animation: `petal-fall ${petal.animationDuration} linear infinite`,
            animationDelay: petal.animationDelay,
            width: petal.size,
            height: petal.size,
          }}
        />
      ))}

      {/* Category Navigation */}
      <CategoryNav />

      {/* Background pattern */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-background via-secondary/20 to-background spring-pattern" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Decorative Flower (Bottom Left) */}
        <div className={`fixed bottom-0 left-0 pointer-events-none transition-all duration-1000 origin-bottom-left z-20 ${
          mounted ? 'opacity-90 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-20'
        }`}>
          <div className="relative w-[80vw] h-[60vh] md:w-[45vw] md:h-[75vh] max-w-[650px] max-h-[850px] select-none filter drop-shadow-2xl mix-blend-multiply">
            <Image 
               src="/tulips.png"
               alt="Yellow tulips"
               fill
               className="object-contain object-left-bottom"
               unoptimized
            />
          </div>
        </div>

        {/* Decorative Flower (Top Right) */}
        <div className={`fixed top-0 right-0 pointer-events-none transition-all duration-1000 origin-top-right z-20 ${
          mounted ? 'opacity-90 scale-100 translate-y-0' : 'opacity-0 scale-90 -translate-y-20'
        }`}>
          <div className="relative w-[90vw] h-[65vh] md:w-[45vw] md:h-[70vh] max-w-[750px] max-h-[950px] select-none filter drop-shadow-2xl mix-blend-multiply">
            <Image 
               src="/tulips2.png"
               alt="Tulips top right"
               fill
               className="object-contain object-right-top"
               unoptimized
            />
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 flex items-start justify-center px-6 pt-8 md:pt-12 pb-48 relative z-30">
          <div
            className={`w-full max-w-6xl transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Profile header with image */}
            <div className="flex flex-col items-center mb-6">
              {/* Profile Wrapper */}
              <div className="relative mb-8 group mt-4 z-30">
                {/* Profile Image (Polaroid Style) */}
                <div className="relative w-48 h-56 md:w-56 md:h-64 bg-card p-3 pb-12 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] -rotate-2 hover:rotate-0 transition-transform duration-500 ease-out border border-border/50 z-10">
                  <div className="relative w-full h-full overflow-hidden bg-muted">
                    {profile?.profile_image_url ? (
                      <Image
                        src={profile.profile_image_url}
                        alt="Profile"
                        fill
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                        <svg className="w-12 h-12 text-muted-foreground/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Admin upload button */}
                {isAdmin && (
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-50 w-max">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      className="shadow-sm border border-border"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? '업로드 중...' : '이미지 변경'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Artist Name */}
              <div className="mb-8 mt-2 text-center z-30">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground font-serif bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70" style={{ fontFamily: 'var(--font-name, "Georgia, serif")' }}>
                  {profile?.artist_name || 'Artist Name'}
                </h1>
                <p className="text-muted-foreground mt-2 text-sm md:text-base">
                  {profile?.short_description || 'Illustrator & Storyboard Artist'}
                </p>
              </div>

              {/* SNS Links */}
              {snsLinks.length > 0 && (
                <div className="flex flex-wrap gap-3 justify-center">
                  {snsLinks.map((link: SnsLink, index: number) => {
                    const platform = link.platform.toLowerCase()
                    const isX = platform === 'x' || platform === 'twitter'
                    const isInstagram = platform === 'instagram'

                    return (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`relative group flex items-center justify-center p-3 bg-card border rounded-full transition-all duration-300 shadow-sm hover:-translate-y-1 hover:shadow-lg overflow-hidden ${
                          isX
                            ? 'hover:border-foreground hover:bg-foreground hover:text-background border-border text-muted-foreground'
                            : isInstagram
                              ? 'hover:border-pink-300 hover:text-white border-border text-muted-foreground'
                              : 'border-border text-muted-foreground hover:text-primary hover:border-primary/30'
                        }`}
                        title={link.platform}
                      >
                        {isInstagram && (
                          <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                        )}
                        <div className="z-10">
                          {defaultSnsIcons[platform] || defaultSnsIcons.website}
                        </div>
                      </a>
                    )
                  })}
                </div>
              )}

              {/* Admin edit button */}
              {isAdmin && (
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="mt-4">
                      프로필 수정
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>프로필 수정</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>작가 이름</Label>
                          <Input
                            value={editForm.artistName}
                            onChange={(e) => setEditForm(prev => ({ ...prev, artistName: e.target.value }))}
                            placeholder="이름을 입력하세요"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>짧은 직업 소개</Label>
                          <Input
                            value={editForm.shortDescription}
                            onChange={(e) => setEditForm(prev => ({ ...prev, shortDescription: e.target.value }))}
                            placeholder="예: Illustrator & Storyboard Artist"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>자기소개</Label>
                        <Textarea
                          value={editForm.description}
                          onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="자기소개를 입력하세요"
                          rows={4}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>경력사항</Label>
                        <Textarea
                          value={editForm.career}
                          onChange={(e) => setEditForm(prev => ({ ...prev, career: e.target.value }))}
                          placeholder="경력사항을 입력하세요"
                          rows={6}
                        />
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>SNS 링크</Label>
                          <Button type="button" variant="outline" size="sm" onClick={addSnsLink}>
                            + 추가
                          </Button>
                        </div>
                        {editForm.snsLinks.map((link, index) => (
                          <div key={index} className="flex gap-2 items-center">
                            <Select
                              value={link.platform}
                              onValueChange={(value) => updateSnsLink(index, 'platform', value)}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder="플랫폼 선택" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="x">X (Twitter)</SelectItem>
                                <SelectItem value="instagram">Instagram</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              placeholder="URL을 입력하세요"
                              value={link.url}
                              onChange={(e) => updateSnsLink(index, 'url', e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSnsLink(index)}
                            >
                              삭제
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button onClick={handleSaveProfile} className="w-full">
                        변경사항 저장 완료
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Two column layout: Description left, Career right */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* Left - Description */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-medium text-foreground">About Me</h2>
                </div>
                <div className="bg-card/60 border border-border rounded-xl p-6">
                  <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                    {profile?.description || '안녕하세요. 일러스트레이터, 만화가, 스토리보드 아티스트입니다. 다양한 작업을 통해 이야기를 전달하고 상상력을 표현합니다.'}
                  </p>
                </div>
              </div>

              {/* Right - Career */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-medium text-foreground">Career</h2>
                </div>
                <div className="bg-card/60 border border-border rounded-xl p-6">
                  <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                    {profile?.career || '경력 사항이 여기에 표시됩니다.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
