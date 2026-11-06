// Links and groups for the blank Word handouts (the file list itself is in handouts.ts).
import { HANDOUT_FILES } from './handouts'

export const handoutHref = (file: string) => `${import.meta.env.BASE_URL}handouts/${encodeURIComponent(file)}`

// "03 Online Application Info Sheet.docx" -> page "03", title "Online Application Info Sheet"
export const handoutParts = (file: string) => {
  const [, num, title] = file.match(/^(\d\d) (.*)\.docx$/) ?? ['', '', file]
  return { num, title }
}

// The resume and cover letter get typed up. Everything else is filled in by hand.
const TYPED = ['01', '02']
export const typedFiles = HANDOUT_FILES.filter((f) => TYPED.includes(handoutParts(f).num))
export const handFiles = HANDOUT_FILES.filter((f) => !TYPED.includes(handoutParts(f).num))
