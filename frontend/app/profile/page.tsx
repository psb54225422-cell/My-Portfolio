import { ProfileContent } from '@/components/profile-content'
import type { Profile } from '@/lib/types'
import { readDb } from '@/lib/local-db'

export default async function ProfilePage() {
  const db = await readDb()
  const profile = db.profile

  return <ProfileContent profile={profile as Profile | null} />
}
