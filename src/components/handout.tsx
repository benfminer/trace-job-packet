// Building blocks for print layouts that look like the paper handouts.
import type { ReactNode } from 'react'

interface HeaderProps {
  title: string
  subtitle: string
  name?: string
  updated?: string
}

export function HandoutHeader({ title, subtitle, name, updated }: HeaderProps) {
  return (
    <header className="h-header">
      <h1 className="h-title">{title}</h1>
      <p className="h-subtitle">
        <span>{subtitle}</span>
        {name !== undefined && <span className="h-meta">Name: <u>{name || ' '.repeat(30)}</u></span>}
        {updated !== undefined && <span className="h-meta">Updated: <u>{updated || ' '.repeat(14)}</u></span>}
      </p>
    </header>
  )
}

interface SectionProps {
  title: string
  note?: string
  children?: ReactNode
}

export function HSection({ title, note, children }: SectionProps) {
  return (
    <section className="h-section">
      <h2 className="h-section-title">{title}{note && <span className="h-section-note">{note}</span>}</h2>
      {children}
    </section>
  )
}

export type Pair = [label: string, value: ReactNode]

interface FieldTableProps {
  // Each row holds one or two label/value pairs. One pair stretches across the row.
  rows: Pair[][]
}

export function FieldTable({ rows }: FieldTableProps) {
  return (
    <table className="h-table h-fields">
      <colgroup>
        <col style={{ width: '22%' }} />
        <col style={{ width: '28%' }} />
        <col style={{ width: '22%' }} />
        <col style={{ width: '28%' }} />
      </colgroup>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.length === 1 ? (
              <>
                <th>{row[0][0]}</th>
                <td colSpan={3}>{row[0][1]}</td>
              </>
            ) : (
              row.map(([label, value]) => [<th key={label + 'l'}>{label}</th>, <td key={label + 'v'}>{value}</td>])
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

interface QuestionTableProps {
  rows: Pair[]
}

// Long questions on the left, answers on the right.
export function QuestionTable({ rows }: QuestionTableProps) {
  return (
    <table className="h-table h-fields">
      <colgroup>
        <col style={{ width: '50%' }} />
        <col style={{ width: '50%' }} />
      </colgroup>
      <tbody>
        {rows.map(([label, value]) => <tr key={label}><th>{label}</th><td>{value}</td></tr>)}
      </tbody>
    </table>
  )
}

interface BoxProps {
  on: boolean
  children?: ReactNode
}

export function Box({ on, children }: BoxProps) {
  return (
    <span className="h-box">
      <span className={on ? 'h-box-on' : ''}>{on ? '☑' : '☐'}</span>
      {children && <> {children}</>}
    </span>
  )
}

interface BoxesProps {
  options: { value: string; label: string }[]
  selected: string | string[]
}

export function Boxes({ options, selected }: BoxesProps) {
  const isOn = (v: string) => (Array.isArray(selected) ? selected.includes(v) : selected === v)
  return <span className="h-boxes">{options.map((o) => <Box key={o.value} on={isOn(o.value)}>{o.label}</Box>)}</span>
}

interface ChildrenProps {
  children: ReactNode
}

export function Callout({ children }: ChildrenProps) {
  return <div className="h-callout">{children}</div>
}

interface FooterProps {
  page: string
}

export function HandoutFooter({ page }: FooterProps) {
  return <footer className="h-footer">TRACE Job Readiness Packet  |  {page}</footer>
}
