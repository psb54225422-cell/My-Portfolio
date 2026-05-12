import { NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/local-db'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const db = await readDb()
    return NextResponse.json(db.site_settings || {})
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const db = await readDb()
    
    db.site_settings = { ...db.site_settings, ...data }
    await writeDb(db)
    
    return NextResponse.json({ success: true, settings: db.site_settings })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}