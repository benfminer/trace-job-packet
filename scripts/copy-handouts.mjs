// Copies the Word masters (kept in the folder above the app) into public/handouts for the
// "Blank paper copies" downloads (plus one zip of them all), replacing the author name in each file with "TRACE".
// Run it after changing a master: npm run handouts
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { unzipSync, zipSync, strFromU8, strToU8 } from 'fflate'

const from = join(import.meta.dirname, '..', '..')
const to = join(import.meta.dirname, '..', 'public', 'handouts')
mkdirSync(to, { recursive: true })

const all = {}
const masters = readdirSync(from).filter((f) => /^\d\d .*\.docx$/.test(f)).sort()
for (const name of masters) {
  const files = unzipSync(new Uint8Array(readFileSync(join(from, name))))
  const core = strFromU8(files['docProps/core.xml'])
    .replace(/<dc:creator>[^<]*<\/dc:creator>/, '<dc:creator>TRACE</dc:creator>')
    .replace(/<cp:lastModifiedBy>[^<]*<\/cp:lastModifiedBy>/, '<cp:lastModifiedBy>TRACE</cp:lastModifiedBy>')
  files['docProps/core.xml'] = strToU8(core)
  const clean = zipSync(files)
  writeFileSync(join(to, name), clean)
  all[name] = clean
  console.log(name)
}
// The list the Home page shows. Written here so it always matches the files.
const list = masters.map((f) => `  '${f.replace(/'/g, "\\'")}',`).join('\n')
writeFileSync(join(import.meta.dirname, '..', 'src', 'data', 'handouts.ts'),
  `// Made by scripts/copy-handouts.mjs (npm run handouts). Don't edit by hand.\nexport const HANDOUT_FILES = [\n${list}\n]\nexport const HANDOUT_ZIP = 'TRACE Job Packet - blank pages.zip'\n`)

// Everything in one download.
writeFileSync(join(to, 'TRACE Job Packet - blank pages.zip'), zipSync(all, { level: 0 }))
