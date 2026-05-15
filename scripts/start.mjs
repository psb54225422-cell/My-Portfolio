import { execFileSync } from 'node:child_process'
import { join } from 'node:path'

const rootDir = process.cwd()
const backendServer = join(rootDir, 'backend', 'server.js')

execFileSync('npm', ['run', 'build'], {
  stdio: 'inherit',
  cwd: rootDir,
})

execFileSync('node', [backendServer], {
  stdio: 'inherit',
  cwd: rootDir,
})