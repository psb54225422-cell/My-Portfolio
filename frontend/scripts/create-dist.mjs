import { cp, mkdir, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const rootDir = process.cwd()
const staticDir = join(rootDir, '.next', 'static')
const publicDir = join(rootDir, 'public')
const distDir = join(rootDir, 'dist')

async function main() {
  try {
    await rm(distDir, { recursive: true, force: true })
  } catch (error) {
    if (error?.code !== 'EBUSY' && error?.code !== 'EPERM') {
      throw error
    }
  }
  await mkdir(join(distDir, '.next'), { recursive: true })

  await cp(join(rootDir, '.next'), join(distDir, '.next'), {
    recursive: true,
    dereference: true,
  })
  await cp(staticDir, join(distDir, '.next', 'static'), { recursive: true, dereference: true })

  if (existsSync(publicDir)) {
    await cp(publicDir, join(distDir, 'public'), { recursive: true, dereference: true })
  }

  console.log('dist folder created from Next standalone output')
}

main().catch((error) => {
  console.error('Failed to create dist folder:', error)
  process.exit(1)
})