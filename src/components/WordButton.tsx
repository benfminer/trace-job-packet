// "Download Word file" button for print views that have an editable Word version.
interface WordButtonProps {
  onClick: () => void
}

export function WordButton({ onClick }: WordButtonProps) {
  return (
    <button type="button" onClick={onClick}
      className="rounded-md border border-brand bg-white px-4 py-2 font-semibold text-brand hover:bg-brand/10">
      Download Word file
    </button>
  )
}
