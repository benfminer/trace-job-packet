import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Packet } from './data/packet'
import { StoreContext, useStore, type Route, type Store } from './data/store'
import { savePacket } from './data/saveLoad'
import { PAGE_VIEWS } from './pages/registry'
import { StartScreen } from './components/StartScreen'
import { HomeScreen } from './components/HomeScreen'
import { TopBar } from './components/TopBar'
import { CloseDialog } from './components/CloseDialog'
import { PrintAll } from './components/PrintAll'
import { HelpPage } from './components/HelpPage'
import { PaperPage } from './components/PaperPage'

// Routes live in the URL hash (#/edit/references) so the browser Back button works.
function readRoute(): Route {
  const [, view, page] = window.location.hash.split('/')
  if ((view === 'edit' || view === 'print') && page && PAGE_VIEWS[page]) return { view, page }
  if (view === 'print-all') return { view: 'printAll' }
  if (view === 'help') return { view: 'help' }
  if (view === 'paper') return { view: 'paper' }
  return { view: 'home' }
}

function routeHash(route: Route) {
  if (route.view === 'printAll') return '#/print-all'
  if (!('page' in route)) return `#/${route.view}`
  return `#/${route.view}/${route.page}`
}

export function App() {
  const [packet, setPacket] = useState<Packet | null>(null)
  const [dirty, setDirty] = useState(false)
  const [route, setRoute] = useState<Route>(readRoute)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const onHash = () => setRoute(readRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Warn before leaving the page with unsaved answers.
  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const update = useCallback((fn: (draft: Packet) => void) => {
    setPacket((p) => {
      if (!p) return p
      const draft = structuredClone(p)
      fn(draft)
      return draft
    })
    setDirty(true)
  }, [])

  const go = useCallback((r: Route) => {
    window.location.hash = routeHash(r)
    window.scrollTo({ top: 0 })
  }, [])

  const store: Store | null = useMemo(() => (packet ? { packet, update, go } : null), [packet, update, go])

  // Resolves false if the Save As window was cancelled, so nothing counts as saved.
  const save = async () => {
    if (!packet) return false
    const saved = await savePacket(packet)
    if (saved) setDirty(false)
    return saved
  }

  const open = useCallback((p: Packet, isNew: boolean) => {
    setPacket(p)
    setDirty(isNew)
    // A demo link can name a page to open (#/print/references); otherwise go Home.
    if (isNew) go({ view: 'edit', page: 'about' })
    else if (readRoute().view === 'home') go({ view: 'home' })
  }, [go])

  const close = () => {
    setPacket(null)
    setDirty(false)
    setClosing(false)
    go({ view: 'home' })
  }

  if (!store) {
    if (route.view === 'help') return <HelpPage onBack={() => go({ view: 'home' })} backLabel="Back" />
    if (route.view === 'paper') return <PaperPage onBack={() => go({ view: 'home' })} backLabel="Back" />
    return <StartScreen onOpen={open} onHelp={() => go({ view: 'help' })} onPaper={() => go({ view: 'paper' })} />
  }

  const views = 'page' in route ? PAGE_VIEWS[route.page] : null
  const View = route.view === 'printAll' ? PrintAll
    : route.view === 'help' ? StaffHelp
    : route.view === 'paper' ? PaperCopiesPage
    : !views ? HomeScreen
    : route.view === 'print' ? (views.Print ?? views.Edit) : views.Edit

  return (
    <StoreContext.Provider value={store}>
      <TopBar dirty={dirty} onSave={save} onClose={() => (dirty ? setClosing(true) : close())} />
      <main key={routeHash(route)} className="anim-rise">
        <View />
      </main>
      {closing && (
        <CloseDialog
          onSaveAndClose={async () => { if (await save()) close() }}
          onDiscard={close}
          onCancel={() => setClosing(false)}
        />
      )}
    </StoreContext.Provider>
  )
}

function PaperCopiesPage() {
  const { go } = useStore()
  return <PaperPage onBack={() => go({ view: 'home' })} backLabel="Home" />
}

function StaffHelp() {
  const { go } = useStore()
  return <HelpPage onBack={() => go({ view: 'home' })} backLabel="Home" />
}
