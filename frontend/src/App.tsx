import { useEffect, useState } from 'react'
import { usePathname } from './shims/next-navigation'

import HomePage from '../app/page'
import CategoryPage from '../app/category/page'
import ProfileRoute from './routes/ProfileRoute'
import GuestbookRoute from './routes/GuestbookRoute'
import ComicRoute from './routes/ComicRoute'
import StoryboardRoute from './routes/StoryboardRoute'
import IllustrationRoute from './routes/IllustrationRoute'
import ComicDetailRoute from './routes/ComicDetailRoute'
import StoryboardDetailRoute from './routes/StoryboardDetailRoute'
import IllustrationDetailRoute from './routes/IllustrationDetailRoute'

function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-serif">Page not found</h1>
        <p className="text-sm text-muted-foreground">The requested page does not exist.</p>
      </div>
    </main>
  )
}

export default function App() {
  const pathname = usePathname()
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const handleRefresh = () => setRefreshKey((value) => value + 1)
    window.addEventListener('app:refresh', handleRefresh)
    return () => window.removeEventListener('app:refresh', handleRefresh)
  }, [])

  if (pathname === '/' || pathname === '') return <HomePage key={refreshKey} />
  if (pathname === '/category') return <CategoryPage key={refreshKey} />
  if (pathname === '/profile') return <ProfileRoute key={refreshKey} />
  if (pathname === '/guestbook') return <GuestbookRoute key={refreshKey} />
  if (pathname === '/comic') return <ComicRoute key={refreshKey} />
  if (pathname.startsWith('/comic/')) return <ComicDetailRoute key={refreshKey} id={pathname.split('/')[2] || ''} />
  if (pathname === '/storyboard') return <StoryboardRoute key={refreshKey} />
  if (pathname.startsWith('/storyboard/')) return <StoryboardDetailRoute key={refreshKey} id={pathname.split('/')[2] || ''} />
  if (pathname === '/illustration') return <IllustrationRoute key={refreshKey} />
  if (pathname.startsWith('/illustration/')) return <IllustrationDetailRoute key={refreshKey} id={pathname.split('/')[2] || ''} />
  return <NotFoundPage />
}