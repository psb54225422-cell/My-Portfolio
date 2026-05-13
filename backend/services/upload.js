const fs = require('node:fs/promises')
const path = require('node:path')

const MAX_UPLOAD_SIZE = 20 * 1024 * 1024
const IMAGE_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
  'image/avif',
])
const AUDIO_MIME_TYPES = new Set([
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'audio/webm',
])

const publicDir = path.join(__dirname, '..', 'public')
const uploadsDir = path.join(publicDir, 'uploads')
const guestbookDir = path.join(uploadsDir, 'guestbook')

async function ensureDirs() {
  await fs.mkdir(uploadsDir, { recursive: true })
  await fs.mkdir(guestbookDir, { recursive: true })
}

function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, '_')
}

async function saveBufferToUpload(buffer, originalName, targetDir) {
  await ensureDirs()
  const safeName = sanitizeFileName(originalName || 'upload')
  const fileName = `${Date.now()}-${safeName}`
  const filePath = path.join(targetDir, fileName)
  await fs.writeFile(filePath, buffer)
  return fileName
}

async function savePublicUpload(file) {
  const fileName = await saveBufferToUpload(file.buffer, file.originalname, uploadsDir)
  return { url: `/uploads/${fileName}` }
}

async function saveGuestbookUpload(file) {
  const fileName = await saveBufferToUpload(file.buffer, file.originalname, guestbookDir)
  return { imageUrl: `/uploads/guestbook/${fileName}` }
}

module.exports = {
  AUDIO_MIME_TYPES,
  IMAGE_MIME_TYPES,
  MAX_UPLOAD_SIZE,
  savePublicUpload,
  saveGuestbookUpload,
}