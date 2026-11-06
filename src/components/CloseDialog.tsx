// Asked before closing a packet that has unsaved changes.
interface CloseDialogProps {
  onSaveAndClose: () => void
  onDiscard: () => void
  onCancel: () => void
}

export function CloseDialog({ onSaveAndClose, onDiscard, onCancel }: CloseDialogProps) {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="close-title"
      className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 id="close-title" className="font-serif text-2xl font-bold">Save before closing?</h2>
        <p className="mt-2 text-lg text-slate-700">
          Some answers haven't been saved. If you close without saving, they'll be gone.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <button type="button" onClick={onSaveAndClose} className="rounded-lg bg-brand px-4 py-3 text-lg font-semibold text-white hover:bg-brand-dark">
            Save and close
          </button>
          <button type="button" onClick={onDiscard} className="rounded-lg border-2 border-red-300 px-4 py-3 text-lg font-semibold text-red-700 hover:bg-red-50">
            Close without saving
          </button>
          <button type="button" onClick={onCancel} className="rounded-lg px-4 py-3 text-lg font-semibold text-slate-600 hover:bg-slate-100">
            Keep working
          </button>
        </div>
      </div>
    </div>
  )
}
