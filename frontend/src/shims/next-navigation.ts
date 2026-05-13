import { useEffect, useState } from 'react'

function getPathname() {
  if (typeof window === 'undefined') return '/'
  return window.location.pathname || '/'
}

export function usePathname() {
  const [pathname, setPathname] = useState(getPathname)

  useEffect(() => {
    const update = () => setPathname(getPathname())
    window.addEventListener('popstate', update)
    window.addEventListener('app:navigation', update)
    return () => {
      window.removeEventListener('popstate', update)
      window.removeEventListener('app:navigation', update)
    }
  }, [])

  return pathname
}

export function useRouter() {
  return {
    push(href: string) {
      window.history.pushState({}, '', href)
      window.dispatchEvent(new Event('app:navigation'))
    },
    replace(href: string) {
      window.history.replaceState({}, '', href)
      window.dispatchEvent(new Event('app:navigation'))
    },
    back() {
      window.history.back()
    },
    refresh() {
      window.dispatchEvent(new Event('app:refresh'))
      window.location.reload()
    },
  }
}

export function notFound() {
  if (typeof window !== 'undefined') {
    window.history.replaceState({}, '', '/404')
    window.dispatchEvent(new Event('app:navigation'))
  }
  throw new Error('Not found')
}