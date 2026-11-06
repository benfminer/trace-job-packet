// Download links for the blank Word handouts.
import { Download, FileText } from 'lucide-react'
import { handoutHref, handoutParts } from '../data/paper'

interface HandoutListProps {
  files: string[]
}

export function HandoutList({ files }: HandoutListProps) {
  return (
    <ul className="grid gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm sm:grid-cols-2">
      {files.map((file) => {
        const { num, title } = handoutParts(file)
        return (
          <li key={file}>
            <a href={handoutHref(file)} download
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
  )
}
