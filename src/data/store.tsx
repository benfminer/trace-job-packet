import { createContext, useContext } from 'react'
import type { Packet } from './packet'

// step: which wizard step is showing (left out for the first one).
export type Route =
  | { view: 'home' | 'printAll' | 'help' | 'paper' | 'apply' | 'job' | 'after' }
  | { view: 'edit' | 'print'; page: string; step?: number }
  | { view: 'trip'; page: string }

export type Store = {
  packet: Packet
  // Change the packet: update((d) => { d.profile.firstName = 'Jordan' })
  update: (fn: (draft: Packet) => void) => void
  // replace: swap the current screen in the browser history instead of adding to it.
  go: (route: Route, replace?: boolean) => void
  route: Route
}

export const StoreContext = createContext<Store | null>(null)

export function useStore() {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useStore must be used inside StoreContext')
  return store
}

type Profile = Packet['profile']
type Pages = Packet['pages']

// The shared "About Me" info plus a setter for one field.
export function useProfile() {
  const { packet, update } = useStore()
  const set = <K extends keyof Profile>(key: K, value: Profile[K]) =>
    update((d) => {
      d.profile[key] = value
    })
  return { p: packet.profile, set, update }
}

// One page's own answers plus a setter for one field.
export function usePageData<P extends keyof Pages>(page: P) {
  const { packet, update } = useStore()
  const set = <K extends keyof Pages[P]>(key: K, value: Pages[P][K]) =>
    update((d) => {
      d.pages[page][key] = value
    })
  return { data: packet.pages[page], set, update, packet }
}
