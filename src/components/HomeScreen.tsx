// The list of pages with checkmarks, like the cover page contents table.
import { useStore } from '../data/store'
import { PAGES } from '../data/pages'
import { fullName, shortDate } from '../data/derive'

export function HomeScreen() {
  const { packet, go } = useStore()
  const name = fullName(packet.profile)
  const doneCount = PAGES.filter((p) => p.ready && packet.status[p.id].done).length
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="font-serif text-4xl font-bold text-slate-900">{name ? `${name}'s packet` : 'New packet'}</h1>
      <p className="mt-1 text-lg text-slate-600">
        {doneCount} page{doneCount === 1 ? '' : 's'} done. Pick a page to work on. Start with <b>About Me</b>.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={() => go({ view: 'printAll' })}
          className="rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark">
          Print all
        </button>
        <button type="button" onClick={() => go({ view: 'help' })}
          className="rounded-lg border-2 border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:border-brand">
          Help for staff
        </button>
      </div>
      <ul className="mt-6 space-y-3">
        {PAGES.map((page) => {
          const status = packet.status[page.id]
          return (
            <li key={page.id}>
              <div className={'flex flex-wrap items-center gap-4 rounded-xl border-2 bg-white p-4 ' +
                (page.ready ? 'border-slate-200' : 'border-dashed border-slate-200 opacity-60')}>
                <span className="w-8 text-center text-xl font-bold text-brand">{page.num || '★'}</span>
                <div className="min-w-48 flex-1">
                  <p className="text-xl font-bold text-slate-900">{page.title}</p>
                  <p className="text-slate-600">{page.purpose}</p>
                </div>
                {status.done && (
                  <span className="rounded-full bg-green-100 px-3 py-1 font-semibold text-green-800">
                    ✓ Done {shortDate(status.date)}
                  </span>
                )}
                {page.ready ? (
                  <div className="flex gap-2">
                    <button type="button" onClick={() => go({ view: 'edit', page: page.id })}
                      className="rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark">
                      {status.done ? 'Edit' : 'Start'}
                    </button>
                    {page.id !== 'about' && (
                      <button type="button" onClick={() => go({ view: 'print', page: page.id })}
                        className="rounded-lg border-2 border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:border-brand">
                        Print
                      </button>
                    )}
                  </div>
                ) : (
                  <span className="text-slate-500">Coming soon</span>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
