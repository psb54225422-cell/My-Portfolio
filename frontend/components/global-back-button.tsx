'use client'

import { useRouter, usePathname } from 'next/navigation'

export function GlobalBackButton() {
  const router = useRouter()
  const pathname = usePathname()

  // 메인 화면(/)이거나 카테고리(/category) 화면에서는 표시 방식을 다르게 할 지 결정
  // /category 는 이미 자체 back 버튼이 있으므로 중복을 피하기 위해 숨기거나 자체 동작을 대신함
  if (pathname === '/') return null

  return (
    <button
      onClick={() => {
        if (pathname === '/category') {
          router.push('/')
        } else {
          router.push('/category')
        }
      }}
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
      <span className="text-sm">Back</span>
    </button>
  )
}
