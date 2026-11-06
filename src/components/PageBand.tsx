// The indigo band behind a screen's title. Content below pulls up over it with a negative top margin.
import type { ReactNode } from 'react'

interface PageBandProps {
  eyebrow: string
  title: string
  children?: ReactNode
  width?: string
}

export function PageBand({ eyebrow, title, children, width = 'max-w-5xl' }: PageBandProps) {
  return (
    <div className="page-band no-print text-white">
      <div className={`mx-auto ${width} px-4 pt-8 pb-20`}>
        <p className="text-sm font-semibold tracking-widest text-brand-soft uppercase">{eyebrow}</p>
        <h1 className="screen-title mt-2 text-4xl font-semibold">{title}</h1>
        {children && <div className="mt-2 text-lg text-[#e2e4ff]">{children}</div>}
      </div>
    </div>
  )
}

interface ProgressBarProps {
  value: number
  label: string
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  return (
    <div role="progressbar" aria-label={label} aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100}
      className="h-2.5 overflow-hidden rounded-full bg-slate-100">
      <div className="progress-fill h-full rounded-full" style={{ width: `${value * 100}%` }} />
    </div>
  )
}
