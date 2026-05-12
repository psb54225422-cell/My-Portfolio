import { NextResponse } from 'next/server'
import {
  IMAGE_MIME_TYPES,
  MAX_UPLOAD_SIZE,
  saveGuestbookUpload,
} from '@/backend/services/upload'
import { readDb, writeDb } from '@/backend/lib/local-db'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const pageNumber = parseInt(formData.get('pageNumber') as string) || 1

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json(
        { error: 'File too large' },
        { status: 413 }
      )
    }

    if (file.type && !IMAGE_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 415 }
      )
    }

    const { imageUrl } = await saveGuestbookUpload(file)
    const db = await readDb()
    
    const finalEntry = {
      id: Date.now().toString(),
      image_url: imageUrl,
      page_number: pageNumber,
      created_at: new Date().toISOString()
    }

    db.guestbook_entries.push(finalEntry)
    await writeDb(db)

    return NextResponse.json({ entry: finalEntry })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to upload' },
      { status: 500 }
    )
  }
}
