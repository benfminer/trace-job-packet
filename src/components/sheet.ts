// One printed page in a print view or Print all.
import type { ReactNode } from 'react'

export interface Sheet {
  name: string
  content: ReactNode
  // Printed sideways, like the Job Search Tracker handout.
  landscape?: boolean
}

export const sheetClass = (s: Sheet) => 'sheet' + (s.landscape ? ' sheet-landscape' : '')
export const sheetLabelWidth = (s: Sheet) => (s.landscape ? 'max-w-[11in]' : 'max-w-[8.5in]')
