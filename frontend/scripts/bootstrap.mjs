import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

const rootDir = process.cwd()
const distDir = join(rootDir, 'dist')
const nextStartBin = join(rootDir, 'node_modules', 'next', 'dist', 'bin', 'next')

if (!existsSync(join(distDir, '.next'))) {
  execSync('npm run build', { stdio: 'inherit' })
}

execSync(`node "${nextStartBin}" start -H 0.0.0.0 -p ${process.env.PORT || 3000}`, {
  stdio: 'inherit',
  cwd: distDir,
})