import { NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/local-db'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const db = await readDb()
    
    // update or create profile
    db.profile = {
      ...db.profile,
      ...body,
      updated_at: new Date().toISOString()
    }
    
    if (!db.profile.id) {
      db.profile.id = 'profile-' + Date.now()
    }

    await writeDb(db)
    
    return NextResponse.json(db.profile)
  } catch (error) {
    console.error('Profile save error:', error)
    return NextResponse.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    )
  }
}
