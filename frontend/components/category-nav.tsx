'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface CategoryItem {
  name: string
  href: string
}

const categories: CategoryItem[] = [
  { name: 'Profile', href: '/profile' },
  { name: 'Illustration', href: '/illustration' },
  { name: 'Comic', href: '/comic' },
  { name: 'Storyboard', href: '/storyboard' },
  { name: 'Guestbook', href: '/guestbook' },
]

export function CategoryNav() {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)

  // Get current category
  const currentCategory = categories.find(cat => pathname.startsWith(cat.href))

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className="relative"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Index tabs container */}
        <div className="flex flex-col items-end">
          {categories.map((category, index) => {
            const isActive = pathname.startsWith(category.href)
            const isVisible = isExpanded || isActive

            return (
              <Link
                key={category.name}
                href={category.href}
                className={`
                  relative flex items-center justify-end
                  transition-all duration-300 ease-out
                  ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}
                `}
                style={{
                  transitionDelay: isExpanded ? `${index * 50}ms` : '0ms',
                  zIndex: isActive ? 10 : categories.length - index,
                }}
              >
                <div
                  className={`
                    px-4 py-2 text-sm font-medium
                    border border-border rounded-l-lg
                    transition-all duration-200
                    ${isActive
                      ? 'bg-primary text-primary-foreground border-primary shadow-lg -translate-x-1'
                      : 'bg-card text-foreground hover:bg-secondary hover:-translate-x-1'
                    }
                    ${!isExpanded && !isActive ? 'hidden' : ''}
                  `}
                >
                  {category.name}
                </div>
              </Link>
            )
          })}
        </div>

        {/* Hover trigger area */}
        {!isExpanded && currentCategory && (
          <div className="absolute top-0 right-0 w-32 h-10" />
        )}
      </div>

      {/* Category menu button when collapsed */}
      {!isExpanded && (
        <Link
          href="/category"
          className="absolute top-12 right-0 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <span>Menu</span>
        </Link>
      )}
    </div>
  )
}
