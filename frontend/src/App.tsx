import { useEffect, useState } from 'react'
import { usePathname } from './shims/next-navigation'
import { AdminProvider } from '@/lib/admin-context'
import { BgmPlayer } from '@/components/bgm-player'
import { CursorSparkles } from '@/components/cursor-sparkles'
import { GlobalBackButton } from '@/components/global-back-button'

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

  return (
    <AdminProvider>
      {pathname === '/' || pathname === '' ? <HomePage key={refreshKey} /> : null}
      {pathname === '/category' ? <CategoryPage key={refreshKey} /> : null}
      {pathname === '/profile' ? <ProfileRoute key={refreshKey} /> : null}
      {pathname === '/guestbook' ? <GuestbookRoute key={refreshKey} /> : null}
      {pathname === '/comic' ? <ComicRoute key={refreshKey} /> : null}
      {pathname.startsWith('/comic/') ? <ComicDetailRoute key={refreshKey} id={pathname.split('/')[2] || ''} /> : null}
      {pathname === '/storyboard' ? <StoryboardRoute key={refreshKey} /> : null}
      {pathname.startsWith('/storyboard/') ? <StoryboardDetailRoute key={refreshKey} id={pathname.split('/')[2] || ''} /> : null}
      {pathname === '/illustration' ? <IllustrationRoute key={refreshKey} /> : null}
      {pathname.startsWith('/illustration/') ? <IllustrationDetailRoute key={refreshKey} id={pathname.split('/')[2] || ''} /> : null}
      {pathname !== '/' && pathname !== '' && pathname !== '/category' && pathname !== '/profile' && pathname !== '/guestbook' && pathname !== '/comic' && !pathname.startsWith('/comic/') && pathname !== '/storyboard' && !pathname.startsWith('/storyboard/') && pathname !== '/illustration' && !pathname.startsWith('/illustration/') ? <NotFoundPage /> : null}
      <CursorSparkles />
      <GlobalBackButton />
      <BgmPlayer />
    </AdminProvider>
  )
}

