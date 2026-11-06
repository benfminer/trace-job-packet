// Form pieces used by every wizard. Big text, big tap targets.
import { useId, type ReactNode } from 'react'

const inputClass =
  'w-full rounded-lg border-2 border-slate-300 bg-white px-3 py-2.5 text-lg text-slate-900 ' +
  'focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30'

interface TextProps {
  label: string
  value: string
  onChange: (v: string) => void
  hint?: ReactNode
  placeholder?: string
  type?: 'text' | 'tel' | 'email' | 'date'
  width?: 'full' | 'short'
}

export function TextField({ label, value, onChange, hint, placeholder, type = 'text', width = 'full' }: TextProps) {
  const id = useId()
  return (
    <div className={width === 'short' ? 'max-w-xs' : ''}>
      <label htmlFor={id} className="mb-1 block text-base font-semibold text-slate-700">{label}</label>
      <input
        id={id}
        type={type}
        className={inputClass}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
    </div>
  )
}

interface TextAreaProps extends Omit<TextProps, 'type' | 'width'> {
  rows?: number
}

export function TextArea({ label, value, onChange, hint, placeholder, rows = 3 }: TextAreaProps) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-base font-semibold text-slate-700">{label}</label>
      <textarea
        id={id}
        rows={rows}
        className={inputClass}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
    </div>
  )
}

interface SelectProps {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
}

export function Select({ label, value, onChange, options }: SelectProps) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-slate-600">{label}</label>
      <select id={id} className={inputClass + ' py-2 text-base'} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">—</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

const pillBase = 'rounded-full border-2 px-4 py-2 text-base font-medium transition-colors '
const pillOn = 'border-brand bg-brand text-white'
const pillOff = 'border-slate-300 bg-white text-slate-700 hover:border-brand'

// Pick one. Clicking the chosen one again clears it.
interface ChoiceProps<T extends string> {
  label: string
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
  hint?: ReactNode
}

export function Choice<T extends string>({ label, value, onChange, options, hint }: ChoiceProps<T>) {
  return (
    <fieldset>
      <legend className="mb-2 text-base font-semibold text-slate-700">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            className={pillBase + (value === o.value ? pillOn : pillOff)}
            onClick={() => onChange(value === o.value ? ('' as T) : o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
      {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
    </fieldset>
  )
}

// Pick several. Optional "Other" box adds the student's own words.
interface MultiChoiceProps {
  label: string
  value: string[]
  onChange: (v: string[]) => void
  options: string[]
  hint?: ReactNode
  allowOther?: boolean
  max?: number
}

export function MultiChoice({ label, value, onChange, options, hint, allowOther, max }: MultiChoiceProps) {
  const others = value.filter((v) => !options.includes(v))
  const toggle = (o: string) => {
    if (value.includes(o)) onChange(value.filter((v) => v !== o))
    else if (!max || value.length < max) onChange([...value, o])
  }
  return (
    <fieldset>
      <legend className="mb-2 text-base font-semibold text-slate-700">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {[...options, ...others].map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={value.includes(o)}
            className={pillBase + (value.includes(o) ? pillOn : pillOff)}
            onClick={() => toggle(o)}
          >
            {o}
          </button>
        ))}
      </div>
      {allowOther && (
        <form
          className="mt-2 flex max-w-md gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            const input = e.currentTarget.elements.namedItem('other') as HTMLInputElement
            const v = input.value.trim()
            if (v && !value.includes(v) && (!max || value.length < max)) onChange([...value, v])
            input.value = ''
          }}
        >
          <input name="other" aria-label={`Other ${label}`} placeholder="Other: type your own" className={inputClass + ' py-2 text-base'} />
          <button type="submit" className="rounded-lg border-2 border-slate-300 px-4 font-semibold text-slate-700 hover:border-brand">Add</button>
        </form>
      )}
      {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
    </fieldset>
  )
}

// Tap an idea to drop it into a text box.
interface IdeasProps {
  ideas: string[]
  onPick: (idea: string) => void
  label?: string
}

export function Ideas({ ideas, onPick, label = 'Ideas (tap one to use it):' }: IdeasProps) {
  return (
    <div className="mt-2">
      <p className="mb-1 text-sm text-slate-500">{label}</p>
      <div className="flex flex-wrap gap-2">
        {ideas.map((i) => (
          <button key={i} type="button" onClick={() => onPick(i)}
            className="rounded-full border border-dashed border-slate-400 bg-slate-50 px-3 py-1 text-sm text-slate-700 hover:border-brand hover:text-brand">
            {i}
          </button>
        ))}
      </div>
    </div>
  )
}

interface CheckProps {
  label: ReactNode
  checked: boolean
  onChange: (v: boolean) => void
}

export function Check({ label, checked, onChange }: CheckProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg py-1 text-lg text-slate-800">
      <input type="checkbox" className="size-6 accent-brand" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  )
}

interface ChildrenProps {
  children: ReactNode
}

export function Tip({ children }: ChildrenProps) {
  return <div className="rounded-r-lg border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-base text-slate-800">{children}</div>
}

interface GridProps extends ChildrenProps {
  cols?: 2 | 3
}

export function Grid({ children, cols = 2 }: GridProps) {
  return <div className={`grid gap-4 ${cols === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>{children}</div>
}

interface CardProps extends ChildrenProps {
  title?: string
}

export function Card({ title, children }: CardProps) {
  return (
    <div className="space-y-4 rounded-xl border-2 border-slate-200 bg-slate-50/60 p-4">
      {title && <h3 className="text-lg font-bold text-brand">{title}</h3>}
      {children}
    </div>
  )
}
