// Asks before doing something that clears answers.
import type { ReactNode } from 'react'

interface ConfirmDialogProps {
  title: string
  children: ReactNode
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ title, children, confirmLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="confirm-title"
      className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 id="confirm-title" className="screen-title text-2xl font-semibold">{title}</h2>
        <div className="mt-2 space-y-2 text-lg text-slate-700">{children}</div>
        <div className="mt-6 flex flex-col gap-2">
          <button type="button" onClick={onConfirm} className="rounded-md bg-brand px-4 py-3 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark">
            {confirmLabel}
          </button>
          <button type="button" onClick={onCancel} className="rounded-md px-4 py-3 text-lg font-semibold text-slate-600 hover:bg-slate-100">
            Go back
          </button>
        </div>
      </div>
    </div>
  )
}
