import { useEffect, useState } from 'react'
import { ProfileContent } from '@/components/profile-content'
import type { Profile } from '@/lib/types'

export default function ProfileRoute() {
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined)

  useEffect(() => {
    let active = true

    fetch('/api/profile')
      .then((response) => response.json())
      .then((data) => {
        if (active) {
          setProfile(data || null)
        }
      })
      .catch(() => {
        if (active) setProfile(null)
      })

    return () => {
      active = false
    }
  }, [])

  if (profile === undefined) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading profile...</div>
  }

  return <ProfileContent profile={profile} />
}