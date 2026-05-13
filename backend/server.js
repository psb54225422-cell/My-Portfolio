const path = require('node:path')
const express = require('express')
const cors = require('cors')
const multer = require('multer')
const { readDb, writeDb } = require('./lib/local-db')
const {
  AUDIO_MIME_TYPES,
  IMAGE_MIME_TYPES,
  MAX_UPLOAD_SIZE,
  savePublicUpload,
  saveGuestbookUpload,
} = require('./services/upload')

const app = express()
const port = process.env.PORT || 3000
const rootDir = path.join(__dirname)
const distDir = path.join(rootDir, 'dist')
const publicDir = path.join(rootDir, 'public')
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_UPLOAD_SIZE } })

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use('/uploads', express.static(path.join(publicDir, 'uploads')))
app.use(express.static(distDir))

function sortByCreatedAtDesc(items) {
  return [...items].sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime())
}

app.get('/api/settings', async (_req, res) => {
  try {
    const db = await readDb()
    res.json(db.site_settings || {})
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' })
  }
})

app.post('/api/settings', async (req, res) => {
  try {
    const db = await readDb()
    db.site_settings = { ...(db.site_settings || {}), ...req.body }
    await writeDb(db)
    res.json({ success: true, settings: db.site_settings })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' })
  }
})

app.get('/api/profile', async (_req, res) => {
  try {
    const db = await readDb()
    res.json(db.profile || null)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

app.post('/api/profile', async (req, res) => {
  try {
    const db = await readDb()
    db.profile = { ...(db.profile || {}), ...req.body }
    await writeDb(db)
    res.json({ success: true, profile: db.profile })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

app.get('/api/guestbook', async (_req, res) => {
  try {
    const db = await readDb()
    const entries = sortByCreatedAtDesc(db.guestbook_entries || [])
    res.json({ entries })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch guestbook' })
  }
})

app.get('/api/works', async (req, res) => {
  try {
    const type = req.query.type
    const db = await readDb()

    if (type === 'comic') {
      return res.json({ items: db.comics || [] })
    }

    if (type === 'storyboard') {
      return res.json({ items: db.storyboards || [] })
    }

    return res.json({ items: db.illustrations || [] })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch works' })
  }
})

app.get('/api/works/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params
    const db = await readDb()
    const collection = type === 'comic' ? db.comics : type === 'storyboard' ? db.storyboards : db.illustrations
    const work = (collection || []).find((item) => String(item.id) === String(id))

    if (!work) {
      return res.status(404).json({ error: 'Not found' })
    }

    const comments = sortByCreatedAtDesc((db.comments || []).filter((comment) => comment.content_type === type && String(comment.content_id) === String(id)))
    res.json({ work, comments })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch work' })
  }
})

app.post('/api/works', async (req, res) => {
  try {
    const { type, insertData } = req.body
    const db = await readDb()

    if (!db.comics) db.comics = []
    if (!db.storyboards) db.storyboards = []
    if (!db.illustrations) db.illustrations = []

    const targetList = type === 'comic' ? db.comics : type === 'storyboard' ? db.storyboards : db.illustrations
    const newItem = { ...insertData, id: `${type}-${Date.now()}` }
    targetList.push(newItem)

    await writeDb(db)
    res.json({ success: true, data: newItem })
  } catch (error) {
    res.status(500).json({ error: 'Failed to save work' })
  }
})

app.put('/api/works', async (req, res) => {
  try {
    const { type, id, updateData } = req.body
    const db = await readDb()
    const targetList = type === 'comic' ? db.comics : type === 'storyboard' ? db.storyboards : db.illustrations
    const index = targetList.findIndex((item) => String(item.id) === String(id))

    if (index === -1) {
      return res.status(404).json({ error: 'Not found' })
    }

    targetList[index] = { ...targetList[index], ...updateData }
    await writeDb(db)
    res.json({ success: true, data: targetList[index] })
  } catch (error) {
    res.status(500).json({ error: 'Update failed' })
  }
})

app.delete('/api/works', async (req, res) => {
  try {
    const type = req.query.type
    const id = req.query.id
    const db = await readDb()
    const targetList = type === 'comic' ? db.comics : type === 'storyboard' ? db.storyboards : db.illustrations
    const index = targetList.findIndex((item) => String(item.id) === String(id))

    if (index === -1) {
      return res.status(404).json({ error: 'Not found' })
    }

    targetList.splice(index, 1)
    await writeDb(db)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Delete failed' })
  }
})

app.get('/api/comments', async (req, res) => {
  try {
    const { content_type, content_id } = req.query
    const db = await readDb()
    const comments = sortByCreatedAtDesc((db.comments || []).filter((comment) => {
      if (content_type && comment.content_type !== content_type) return false
      if (content_id && String(comment.content_id) !== String(content_id)) return false
      return true
    }))

    res.json({ comments })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' })
  }
})

app.post('/api/comments', async (req, res) => {
  try {
    const { content_type, content_id, author_name, comment_text } = req.body
    const db = await readDb()
    if (!db.comments) db.comments = []

    const newComment = {
      id: Date.now().toString(),
      content_type,
      content_id,
      author_name,
      comment_text,
      created_at: new Date().toISOString(),
    }

    db.comments.push(newComment)
    await writeDb(db)
    res.json({ success: true, data: newComment })
  } catch (error) {
    res.status(500).json({ error: 'Failed to save comment' })
  }
})

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file
    if (!file) {
      return res.status(400).json({ error: 'No file provided' })
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      return res.status(413).json({ error: 'File too large' })
    }

    const allowedTypes = new Set([...IMAGE_MIME_TYPES, ...AUDIO_MIME_TYPES])
    if (file.mimetype && !allowedTypes.has(file.mimetype)) {
      return res.status(415).json({ error: 'Unsupported file type' })
    }

    const result = await savePublicUpload(file)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' })
  }
})

app.post('/api/guestbook/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file
    const pageNumber = parseInt(req.body.pageNumber, 10) || 1

    if (!file) {
      return res.status(400).json({ error: 'No file provided' })
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      return res.status(413).json({ error: 'File too large' })
    }

    if (file.mimetype && !IMAGE_MIME_TYPES.has(file.mimetype)) {
      return res.status(415).json({ error: 'Unsupported file type' })
    }

    const { imageUrl } = await saveGuestbookUpload(file)
    const db = await readDb()
    if (!db.guestbook_entries) db.guestbook_entries = []

    const finalEntry = {
      id: Date.now().toString(),
      image_url: imageUrl,
      page_number: pageNumber,
      created_at: new Date().toISOString(),
    }

    db.guestbook_entries.push(finalEntry)
    await writeDb(db)
    res.json({ entry: finalEntry })
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload' })
  }
})

app.get('*', (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'))
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${port}`)
})