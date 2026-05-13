const fs = require('node:fs/promises')
const path = require('node:path')

const dbPath = path.join(__dirname, '..', '..', 'frontend', 'backend', 'data', 'local-db.json')

async function ensureDbFile() {
  await fs.mkdir(path.dirname(dbPath), { recursive: true })
  try {
    await fs.access(dbPath)
  } catch {
    await fs.writeFile(dbPath, JSON.stringify({
      profile: null,
      guestbook_entries: [],
      site_settings: {},
      illustrations: [],
      comics: [],
      storyboards: [],
      comments: [],
    }, null, 2), 'utf8')
  }
}

async function readDb() {
  await ensureDbFile()
  const raw = await fs.readFile(dbPath, 'utf8')
  return JSON.parse(raw)
}

async function writeDb(db) {
  await ensureDbFile()
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2), 'utf8')
}

module.exports = {
  readDb,
  writeDb,
}