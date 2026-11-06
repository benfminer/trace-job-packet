// The packet dashboard: overall progress, About Me first, then a card for every page.
import { ArrowRight, Check, CircleHelp, Printer } from 'lucide-react'
import { useStore } from '../data/store'
import { PAGES, type PageInfo } from '../data/pages'
import { fullName, shortDate } from '../data/derive'
import { PAGE_ICONS } from './icons'
import { PageBand, ProgressBar } from './PageBand'
import { PaperCopies } from './PaperCopies'
import { btnPrimary as primary, btnSecondary as secondary } from './styles'

interface StatusChipProps {
  done: boolean
  date: string
}

function StatusChip({ done, date }: StatusChipProps) {
  if (!done) return <span className="rounded-full bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-600">Not started</span>
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-sm font-semibold text-green-800 ring-1 ring-green-200">
      <Check aria-hidden className="size-3.5" />Done {shortDate(date)}
    </span>
  )
}

interface PageCardProps {
  page: PageInfo
  featured?: boolean
}

function PageCard({ page, featured }: PageCardProps) {
  const { packet, go } = useStore()
  const status = packet.status[page.id]
  const Icon = status.done ? Check : PAGE_ICONS[page.id]
  return (
    <article className={'flex gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow ' +
      (featured ? 'flex-wrap items-center' : 'flex-col')}>
      <div className="flex flex-1 items-start gap-3">
        <span className={'grid size-11 shrink-0 place-items-center rounded-lg ' +
          (status.done ? 'bg-green-50 text-green-700' : 'bg-brand-tint text-brand')}>
          <Icon aria-hidden className="size-5" />
        </span>
        <div>
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            {featured ? 'Fill this in first' : `Page ${page.num}`}
          </p>
          <h3 className="text-lg font-semibold tracking-tight text-slate-900">{page.title}</h3>
          <p className="mt-1 text-base text-slate-600">{page.purpose}</p>
        </div>
      </div>
      <div className={'flex items-center gap-2 ' + (featured ? 'ml-auto' : 'mt-auto border-t border-slate-100 pt-3')}>
        <StatusChip done={status.done} date={status.date} />
        <span className="flex-1" />
        {!featured && (
          <button type="button" onClick={() => go({ view: 'print', page: page.id })} aria-label={`Print ${page.title}`}
            className="rounded-md border border-slate-300 bg-white p-2 text-slate-600 shadow-sm transition-colors hover:border-brand hover:text-brand">
            <Printer aria-hidden className="size-5" />
          </button>
        )}
        <button type="button" onClick={() => go({ view: 'edit', page: page.id })} className={primary + ' py-1.5'}>
          {status.done ? 'Edit' : 'Start'}
          {featured && <ArrowRight aria-hidden className="size-4" />}
        </button>
      </div>
    </article>
  )
}

export function HomeScreen() {
  const { packet, go } = useStore()
  const name = fullName(packet.profile)
  const ready = PAGES.filter((p) => p.ready)
  const doneCount = ready.filter((p) => packet.status[p.id].done).length
  const [about, ...pages] = PAGES
  return (
    <>
      <PageBand eyebrow="Student packet" title={name ? `${name}'s packet` : 'New packet'} width="max-w-6xl">
        Pick a page to work on. Everything you type in About Me fills in the rest.
      </PageBand>
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <div className="-mt-14 flex flex-wrap items-center gap-5 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-xl">
          <p className="text-3xl font-semibold tracking-tight tabular-nums">
            {doneCount} <span className="text-base font-medium text-slate-500">of {ready.length} pages done</span>
          </p>
          <div className="min-w-48 flex-1">
            <div className="mb-2 flex justify-between text-sm text-slate-600">
              <span>Overall progress</span><span>{Math.round((doneCount / ready.length) * 100)}%</span>
            </div>
            <ProgressBar value={doneCount / ready.length} label="Pages done" />
          </div>
          <button type="button" onClick={() => go({ view: 'help' })} className={secondary}>
            <CircleHelp aria-hidden className="size-5" />Help for staff
          </button>
          <button type="button" onClick={() => go({ view: 'printAll' })} className={primary}>
            <Printer aria-hidden className="size-5" />Print all
          </button>
        </div>

        <h2 className="mt-9 mb-3 text-xl font-semibold tracking-tight">Start here</h2>
        <PageCard page={about} featured />

        <div className="mt-9 mb-3 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Packet pages</h2>
          <span className="text-slate-500">{pages.length} pages</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => <PageCard key={page.id} page={page} />)}
        </div>

        <PaperCopies />
      </div>
    </>
  )
}
