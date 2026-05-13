import { cp, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { build } from 'vite'

const rootDir = process.cwd()
const distDir = join(rootDir, 'dist')
const backendDistDir = join(rootDir, '..', 'backend', 'dist')

async function main() {
  await rm(distDir, { recursive: true, force: true })
  await rm(backendDistDir, { recursive: true, force: true })

  await build()

  await cp(distDir, backendDistDir, { recursive: true, dereference: true })
  console.log('Vite dist copied to backend/dist')
}

main().catch((error) => {
  console.error('Failed to build frontend dist:', error)
  process.exit(1)
})