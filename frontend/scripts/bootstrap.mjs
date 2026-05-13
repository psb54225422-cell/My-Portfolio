import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'

const rootDir = process.cwd()
const distDir = join(rootDir, 'dist')
const require = createRequire(import.meta.url)
const nextStartBin = require.resolve('next/dist/bin/next')

if (!existsSync(join(distDir, '.next'))) {
  execFileSync('node', ['scripts/build.mjs'], {
    stdio: 'inherit',
    cwd: rootDir,
  })
}

execFileSync('node', [nextStartBin, 'start', '-H', '0.0.0.0', '-p', String(process.env.PORT || 3000)], {
  stdio: 'inherit',
  cwd: distDir,
})