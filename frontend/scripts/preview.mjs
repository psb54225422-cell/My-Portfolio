import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const viteBin = require.resolve('vite/bin/vite.js')
const port = String(process.env.PORT || 4173)

execFileSync('node', [viteBin, 'preview', '--host', '0.0.0.0', '--port', port], {
  stdio: 'inherit',
  cwd: process.cwd(),
})