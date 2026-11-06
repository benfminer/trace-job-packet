// First screen: start a new packet or open a saved one.
import { useEffect, useRef, useState } from 'react'
import { blankPacket, type Packet } from '../data/packet'
import { readPacketFile } from '../data/saveLoad'

interface StartScreenProps {
  onOpen: (packet: Packet, isNew: boolean) => void
  onHelp: () => void
}

export function StartScreen({ onOpen, onHelp }: StartScreenProps) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')

  // Development only: ?demo opens the made-up sample student. Not included in the published site.
  useEffect(() => {
    if (!import.meta.env.DEV || !new URLSearchParams(location.search).has('demo')) return
    import('../data/sample').then(({ samplePacket }) => onOpen(samplePacket(), false))
  }, [onOpen])

  const openFile = async (file: File | undefined) => {
    if (!file) return
    try {
      onOpen(await readPacketFile(file), false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'That file could not be opened.')
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <p className="font-bold tracking-wide text-brand uppercase">TRACE | San Diego Unified</p>
      <h1 className="mt-1 font-serif text-5xl font-bold text-slate-900">Job Readiness Packet</h1>
      <p className="mt-2 font-serif text-xl text-slate-600">Everything I need to apply, interview, and start a job.</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <button type="button" onClick={() => onOpen(blankPacket(), true)}
          className="rounded-2xl bg-brand p-6 text-left text-white shadow hover:bg-brand-dark">
          <span className="block text-2xl font-bold">Start a new packet</span>
          <span className="mt-1 block text-white/90">For a student who is just starting.</span>
        </button>
        <button type="button" onClick={() => fileInput.current?.click()}
          className="rounded-2xl border-2 border-brand bg-white p-6 text-left shadow hover:bg-brand/5">
          <span className="block text-2xl font-bold text-brand">Open a saved packet</span>
          <span className="mt-1 block text-slate-600">Pick the student's file (it ends in <code>_packet.json</code>).</span>
        </button>
      </div>
      <input ref={fileInput} type="file" accept=".json,application/json" className="hidden"
        onChange={(e) => { openFile(e.target.files?.[0]); e.target.value = '' }} />
      {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-red-800">{error}</p>}

      <div className="mt-10 rounded-r-lg border-l-4 border-amber-400 bg-amber-50 p-4 text-slate-800">
        <b>Student info stays on this computer.</b> This website doesn't store anything. When you're done, click
        <b> Save</b> to download the student's file, and keep it in a staff-only folder (like your school Google Drive).
        Never put a Social Security number or passwords in the packet.
      </div>
      <button type="button" onClick={onHelp} className="mt-6 text-lg font-semibold text-brand underline hover:text-brand-dark">
        Help for staff: how this works
      </button>
    </div>
  )
}
