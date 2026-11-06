// "Download Word file" button for print views that have an editable Word version.
import { FileDown } from 'lucide-react'
import { btnSecondary } from './styles'

interface WordButtonProps {
  onClick: () => void
}

export function WordButton({ onClick }: WordButtonProps) {
  return (
    <button type="button" onClick={onClick} className={btnSecondary}>
      <FileDown aria-hidden className="size-5" />Download Word file
    </button>
  )
}
