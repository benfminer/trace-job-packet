// Blank Word copies of every page, for students who work on paper. Staff can edit them too.
import { Download, FileText, FolderDown } from 'lucide-react'
import { HANDOUT_FILES, HANDOUT_ZIP } from '../data/handouts'
import { btnSecondary } from './styles'

const href = (file: string) => `${import.meta.env.BASE_URL}handouts/${encodeURIComponent(file)}`

// "03 Online Application Info Sheet.docx" -> page "03", title "Online Application Info Sheet"
const parts = (file: string) => {
  const [, num, title] = file.match(/^(\d\d) (.*)\.docx$/) ?? ['', '', file]
  return { num, title }
}

export function PaperCopies() {
  return (
    <section className="mt-9" aria-labelledby="paper-copies">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="paper-copies" className="text-xl font-semibold tracking-tight">Blank paper copies</h2>
          <p className="text-slate-600">Word files of every page, to print and fill in by hand or edit.</p>
        </div>
        <a href={href(HANDOUT_ZIP)} download className={btnSecondary}>
          <FolderDown aria-hidden className="size-5" />Download all ({HANDOUT_FILES.length})
        </a>
      </div>
      <ul className="grid gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm sm:grid-cols-2 lg:grid-cols-3">
        {HANDOUT_FILES.map((file) => {
          const { num, title } = parts(file)
          return (
            <li key={file}>
              <a href={href(file)} download
                className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-brand-tint">
                <FileText aria-hidden className="size-5 shrink-0 text-slate-400 group-hover:text-brand" />
                <span className="flex-1">
                  <span className="block text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    {num === '00' ? 'Cover' : `Page ${num}`}
                  </span>
                  <span className="block font-medium text-slate-900">{title}</span>
                </span>
                <Download aria-hidden className="size-4 text-slate-400 group-hover:text-brand" />
                <span className="sr-only">(Word file)</span>
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
