import { NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/local-db'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const contentType = searchParams.get('content_type')
    const contentId = searchParams.get('content_id')

    const db = await readDb()
    const allComments = (db as any).comments || []

    const filtered = allComments
      .filter((c: any) => c.content_type === contentType && c.content_id === contentId)
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return NextResponse.json({ comments: filtered })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const db = await readDb()
    
    if (!(db as any).comments) {
      (db as any).comments = []
    }

    const newComment = {
      id: `comment-${Date.now()}`,
      content_type: body.content_type,
      content_id: body.content_id,
      author_name: body.author_name,
      comment_text: body.comment_text,
      created_at: new Date().toISOString()
    }

    ;(db as any).comments.push(newComment)
    
    await writeDb(db)
    
    return NextResponse.json({ success: true, data: newComment })
  } catch (error) {
    console.error('Comment error:', error)
    return NextResponse.json({ error: 'Failed to save comment' }, { status: 500 })
  }
}
