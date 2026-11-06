// The finished one-page resume.
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useStore } from '../../data/store'
import { resumeContent } from '../../data/resume'

interface BlockProps {
  title: string
  children: ReactNode
}

function Block({ title, children }: BlockProps) {
  return (
    <section className="r-block">
      <h2 className="h-section-title">{title}</h2>
      {children}
    </section>
  )
}

interface RowProps {
  left: ReactNode
  right: string
}

// Text size starts at 11pt and steps down to 9.5pt until the resume fits on one page.
const START_PT = 11
const MIN_PT = 9.5
// A printed page holds 10in of text at 7.3in wide. The preview is a bit narrower (7.2in), so
// it wraps a little more than the printout, which keeps this check on the safe side.
// Checking height against width works at any preview zoom.
const PAGE_RATIO = 1.37

function Row({ left, right }: RowProps) {
  return <p className="r-row"><span>{left}</span><span className="r-dates">{right}</span></p>
}

export function ResumeSheet() {
  const { packet } = useStore()
  const r = resumeContent(packet)
  const ref = useRef<HTMLDivElement>(null)
  const [tooLong, setTooLong] = useState(false)
  const contentKey = JSON.stringify(r)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const fits = () => el.offsetHeight <= el.offsetWidth * PAGE_RATIO
    let size = START_PT
    el.style.fontSize = `${size}pt`
    while (!fits() && size > MIN_PT) {
      size -= 0.25
      el.style.fontSize = `${size}pt`
    }
    setTooLong(!fits())
  }, [contentKey])

  return (
    <>
      {tooLong && (
        <p className="no-print mb-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 font-sans text-sm text-amber-900">
          This resume runs onto a second page. Try fewer bullets, shorter duties, or fewer skills.
        </p>
      )}
      <div ref={ref} className="r-sheet">
        <h1 className="h-title" style={{ fontSize: '26pt' }}>{r.name}</h1>
        <p className="r-contact">{r.contact || ' '}</p>
        {r.objective && <Block title="Objective"><p>{r.objective}</p></Block>}
        {r.skills.length > 0 && (
          <Block title="Skills">
            <ul className="r-skills two-col" style={{ gridTemplateRows: `repeat(${Math.ceil(r.skills.length / 2)}, auto)` }}>{r.skills.map((s) => <li key={s}>{s}</li>)}</ul>
          </Block>
        )}
        {r.jobs.length > 0 && (
          <Block title="Work and Volunteer Experience">
            {r.jobs.map((j, i) => (
              <div key={i} className="r-item">
                <Row left={<><b>{j.title || 'Volunteer'}</b>, {j.employer}</>} right={j.dates} />
                <ul className="r-bullets">{j.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>
              </div>
            ))}
          </Block>
        )}
        <Block title="Education">
          {r.schools.map((s) => (
            <div key={s.name} className="r-item">
              <Row left={<b>{s.name}</b>} right={s.dates} />
              {s.detail && <p>{s.detail}</p>}
            </div>
          ))}
        </Block>
        {r.certifications.length > 0 && <Block title="Certifications"><p>{r.certifications.join('  |  ')}</p></Block>}
        {r.languages && <Block title="Languages"><p>{r.languages}</p></Block>}
        {r.availability && <Block title="Availability"><p>{r.availability}</p></Block>}
        <p className="r-refs">References available on request.</p>
      </div>
    </>
  )
}
