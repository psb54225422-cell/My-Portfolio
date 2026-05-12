import { NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/local-db'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, insertData } = body
    const db = await readDb()
    
    // type: 'comic', 'storyboard', 'illustration'
    if (!db.comics) db.comics = []
    if (!db.storyboards) db.storyboards = []
    if (!db.illustrations) db.illustrations = []

    let targetList = []
    if (type === 'comic') {
      targetList = db.comics
    } else if (type === 'storyboard') {
      targetList = db.storyboards
    } else {
      targetList = db.illustrations
    }

    const newItem = {
      ...insertData,
      id: `${type}-${Date.now()}`
    }

    targetList.push(newItem)
    
    await writeDb(db)
    
    return NextResponse.json({ success: true, data: newItem })
  } catch (error) {
    console.error('Save error:', error)
    return NextResponse.json(
      { error: 'Failed to save work' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { type, id, updateData } = body
    const db = await readDb()
    
    let targetList = []
    if (type === 'comic') targetList = db.comics
    else if (type === 'storyboard') targetList = db.storyboards
    else targetList = db.illustrations
    
    const index = targetList.findIndex((item: any) => item.id === id)
    if (index !== -1) {
      targetList[index] = { ...targetList[index], ...updateData }
      await writeDb(db)
      return NextResponse.json({ success: true, data: targetList[index] })
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const id = searchParams.get('id')
    const db = await readDb()
    
    let targetList = []
    if (type === 'comic') targetList = db.comics
    else if (type === 'storyboard') targetList = db.storyboards
    else targetList = db.illustrations
    
    const index = targetList.findIndex((item: any) => item.id === id)
    if (index !== -1) {
      targetList.splice(index, 1)
      await writeDb(db)
      return NextResponse.json({ success: true })
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
