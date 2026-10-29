import { build } from 'esbuild'
import { zipSync } from 'fflate'
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const pack = join(dist, 'pack')
const mcpack = join(dist, 'ore-ui-react-test.mcpack')

rmSync(dist, { recursive: true, force: true })
mkdirSync(join(pack, 'hbui'), { recursive: true })

await build({
  entryPoints: [join(root, 'src/main.tsx')],
  outfile: join(pack, 'hbui/oui-react-test.js'),
  bundle: true,
  format: 'iife',
  target: 'es2017',
  minify: true,
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' },
  logLevel: 'warning',
})

cpSync(join(root, 'static'), pack, { recursive: true })

const files = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? files(path) : [path]
  })

const entries = {}
for (const path of files(pack)) {
  entries[relative(pack, path).split(sep).join('/')] = readFileSync(path)
}
writeFileSync(mcpack, zipSync(entries))

for (const path of [...files(pack), mcpack]) {
  console.log(`${relative(root, path).split(sep).join('/')}  ${statSync(path).size} bytes`)
}
