'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface CategoryItem {
  name: string
  nameKo: string
  href: string
}

const categories: CategoryItem[] = [
  { name: 'Profile', nameKo: '프로필', href: '/profile' },
  { name: 'Illustration', nameKo: '일러스트', href: '/illustration' },
  { name: 'Comic', nameKo: '만화', href: '/comic' },
  { name: 'Storyboard', nameKo: '스토리보드', href: '/storyboard' },
  { name: 'Guestbook', nameKo: '방명록', href: '/guestbook' },
]

const ADMIN_PASSWORD = '0412'

export default function CategoryPage() {
  const [mounted, setMounted] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [backgroundUrl, setBackgroundUrl] = useState<string | undefined>()
  const [gifUrl, setGifUrl] = useState<string | undefined>()
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminError, setAdminError] = useState('')

  useEffect(() => {
    setMounted(true)
    
    // Check admin session
    const adminSession = sessionStorage.getItem('isAdmin')
    if (adminSession === 'true') {
      setIsAdmin(true)
    }

    async function fetchSettings() {
      try {
        const response = await fetch('/api/settings')
        if (!response.ok) return

        const settings = await response.json()
        setBackgroundUrl(settings.category_background || settings.start_page_image || undefined)
        setGifUrl(settings.category_gif || undefined)
      } catch (error) {
        console.error('Failed to fetch category settings:', error)
      }
    }

    fetchSettings()
  }, [])

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true)
      sessionStorage.setItem('isAdmin', 'true')
      setIsAdminOpen(false)
      setAdminPassword('')
      setAdminError('')
    } else {
      setAdminError('비밀번호가 올바르지 않습니다.')
    }
  }

  const handleAdminLogout = () => {
    setIsAdmin(false)
    sessionStorage.removeItem('isAdmin')
  }

  // Generate random properties for leaves (only on client to prevent hydration error)
  const [leaves, setLeaves] = useState<Array<{ id: number, left: string, animationDuration: string, animationDelay: string, size: string, rotation: string }>>([])

  useEffect(() => {
    setLeaves(Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 5 + 5}s`,
      animationDelay: `${Math.random() * 5}s`,
      size: `${Math.random() * 10 + 10}px`,
      rotation: `${Math.random() * 360}deg`,
    })))
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes leaf-fall {
          0% { opacity: 1; transform: translateY(-10vh) rotate(0deg); }
          100% { opacity: 0; transform: translateY(110vh) rotate(720deg) translateX(30px); }
        }
        .leaf {
          position: absolute;
          top: -50px;
          pointer-events: none;
          background: rgba(167, 243, 208, 0.6);
          border-radius: 0 50% 0 50%; /* simple leaf shape */
          box-shadow: inset 1px -1px 2px rgba(0,0,0,0.1);
        }
        `
      }} />

      {/* Falling Leaves */}
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="leaf z-10"
          style={{
            left: leaf.left,
            animation: `leaf-fall ${leaf.animationDuration} linear infinite`,
            animationDelay: leaf.animationDelay,
            width: leaf.size,
            height: leaf.size,
          }}
        />
      ))}

      {/* Background with category image */}
      {backgroundUrl ? (
        <div className="fixed inset-0 z-0">
          <Image
            src={backgroundUrl}
            alt=""
            fill
            className="object-cover opacity-15"
            priority
          />
        </div>
      ) : (
        <div className="fixed inset-0 z-0 bg-gradient-to-br from-background via-secondary/20 to-background spring-pattern" />
      )}

      {/* Admin button - left corner */}
      <div className="fixed top-4 left-4 z-50">
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
            <DialogContent className="sm:max-w-md">
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

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left side - Category list */}
        <div className="w-1/2 min-h-screen flex flex-col justify-center pl-8 md:pl-16 lg:pl-24">
          <div
            className={`space-y-1 transition-all duration-700 ${
              mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            {/* Title */}
            <h1 className="text-sm text-muted-foreground mb-8 font-light tracking-widest uppercase">
              Menu
            </h1>

            {/* Category tabs */}
            <nav className="space-y-0">
              {categories.map((category, index) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="group block"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`
                      relative flex items-center gap-4 py-4 px-6 
                      border-l-4 transition-all duration-300
                      ${hoveredIndex === index 
                        ? 'border-l-primary bg-primary/5 pl-8' 
                        : 'border-l-transparent hover:border-l-primary/50'
                      }
                    `}
                  >
                    {/* Index number */}
                    <span className="text-xs text-muted-foreground/60 font-mono w-6">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    {/* Category name */}
                    <div className="flex-1">
                      <h2 className={`text-xl md:text-2xl font-serif transition-colors duration-300 ${
                        hoveredIndex === index ? 'text-primary' : 'text-foreground'
                      }`}>
                        {category.name}
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {category.nameKo}
                      </p>
                    </div>

                    {/* Arrow */}
                    <svg
                      className={`w-5 h-5 text-primary transition-all duration-300 ${
                        hoveredIndex === index ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Right side - GIF display */}
        <div className="w-1/2 min-h-screen flex items-center justify-center p-8">
          <div
            className={`relative w-full max-w-2xl xl:max-w-3xl aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 ${
              mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            {/* Border decoration */}
            <div className="absolute inset-0 border-4 border-card rounded-2xl z-10 pointer-events-none" />
            <div className="absolute inset-3 border border-primary/20 rounded-xl z-10 pointer-events-none" />

            {gifUrl ? (
              <Image
                src={gifUrl}
                alt="Gallery preview"
                fill
                className="object-cover"
                unoptimized // For GIF animation
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-secondary via-muted to-secondary flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  {/* Animated leaf illustration */}
                  <div className="relative">
                    <svg
                      className="w-24 h-24 mx-auto text-primary/40 animate-sway"
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
                    {/* Additional floating leaves */}
                    <svg
                      className="absolute -top-2 -right-2 w-8 h-8 text-primary/30 animate-float"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      style={{ animationDelay: '0.5s' }}
                    >
                      <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
                    </svg>
                    <svg
                      className="absolute -bottom-4 -left-4 w-6 h-6 text-primary/25 animate-float"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      style={{ animationDelay: '1s' }}
                    >
                      <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground font-light">
                    Gallery Preview
                  </p>
                  {isAdmin && (
                    <p className="text-xs text-primary">
                      관리자 페이지에서 GIF를 업로드하세요
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
