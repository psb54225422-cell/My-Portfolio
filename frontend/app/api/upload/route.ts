import { NextResponse } from 'next/server'
import {
  AUDIO_MIME_TYPES,
  IMAGE_MIME_TYPES,
  MAX_UPLOAD_SIZE,
  savePublicUpload,
} from '@/backend/services/upload'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json(
        { error: 'File too large' },
        { status: 413 }
      )
    }

    const allowedTypes = new Set([...IMAGE_MIME_TYPES, ...AUDIO_MIME_TYPES])
    if (file.type && !allowedTypes.has(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 415 }
      )
    }

    const result = await savePublicUpload(file)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
