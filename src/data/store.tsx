import { createContext, useContext } from 'react'
import type { Packet } from './packet'

export type Route = { view: 'home' | 'printAll' | 'help' | 'paper' | 'apply' } | { view: 'edit' | 'print'; page: string }

export type Store = {
  packet: Packet
  // Change the packet: update((d) => { d.profile.firstName = 'Jordan' })
  update: (fn: (draft: Packet) => void) => void
  go: (route: Route) => void
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
