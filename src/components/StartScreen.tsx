// First screen: start a new packet or open a saved one.
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, CircleHelp, FolderOpen, Plus, Printer } from 'lucide-react'
import { blankPacket, type Packet } from '../data/packet'
import { readPacketFile } from '../data/saveLoad'

const link = 'inline-flex items-center gap-2 text-lg font-semibold text-brand underline-offset-4 hover:text-brand-dark hover:underline'

interface StartScreenProps {
  onOpen: (packet: Packet, isNew: boolean) => void
  onHelp: () => void
  onPaper: () => void
}

export function StartScreen({ onOpen, onHelp, onPaper }: StartScreenProps) {
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
    <>
    <div className="page-band text-white">
      <div className="mx-auto max-w-3xl px-4 pt-10 pb-24">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-white text-xl font-bold text-brand-dark shadow">T</span>
          <span className="leading-tight">
            <span className="block font-bold tracking-wide">TRACE</span>
            <span className="block text-sm text-brand-soft">San Diego Unified</span>
          </span>
        </div>
        <h1 className="screen-title mt-10 text-5xl font-semibold">Job Readiness Packet</h1>
        <p className="mt-3 text-xl text-[#e2e4ff]">Everything I need to apply, interview, and start a job.</p>
      </div>
    </div>
    <div className="mx-auto max-w-3xl px-4 pb-14">
      <div className="-mt-16 grid gap-4 sm:grid-cols-2">
        <button type="button" onClick={() => onOpen(blankPacket(), true)}
          className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-xl transition hover:-translate-y-0.5 hover:border-brand">
          <span className="grid size-11 place-items-center rounded-lg bg-brand text-white"><Plus aria-hidden className="size-6" /></span>
          <span className="mt-4 flex items-center gap-2 text-2xl font-semibold tracking-tight text-slate-900">
            Start a new packet<ArrowRight aria-hidden className="size-5 text-brand transition-transform group-hover:translate-x-1" />
          </span>
          <span className="mt-1 block text-slate-600">For a student who is just starting.</span>
        </button>
        <button type="button" onClick={() => fileInput.current?.click()}
          className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-xl transition hover:-translate-y-0.5 hover:border-brand">
          <span className="grid size-11 place-items-center rounded-lg bg-brand-tint text-brand"><FolderOpen aria-hidden className="size-6" /></span>
          <span className="mt-4 flex items-center gap-2 text-2xl font-semibold tracking-tight text-slate-900">
            Open a saved packet<ArrowRight aria-hidden className="size-5 text-brand transition-transform group-hover:translate-x-1" />
          </span>
          <span className="mt-1 block text-slate-600">Pick the student's file (it ends in <code>_packet.json</code>).</span>
        </button>
      </div>
      <input ref={fileInput} type="file" accept=".json,application/json" className="hidden"
        onChange={(e) => { openFile(e.target.files?.[0]); e.target.value = '' }} />
      {error && <p role="alert" className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-800">{error}</p>}

      <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50/70 p-4 text-slate-800">
        <b>Student info stays on this computer.</b> This website doesn't store anything. When you're done, click
        <b> Save</b> to download the student's file, and keep it in a staff-only folder (like your school Google Drive).
        Never put a Social Security number or passwords in the packet.
      </div>
      <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
        <button type="button" onClick={onPaper} className={link}>
          <Printer aria-hidden className="size-5" />Working on paper? Get blank pages to print
        </button>
        <button type="button" onClick={onHelp} className={link}>
          <CircleHelp aria-hidden className="size-5" />Help for staff: how this works
        </button>
      </div>
    </div>
    </>
  )
}
