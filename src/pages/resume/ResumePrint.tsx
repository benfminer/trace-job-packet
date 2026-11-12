// The finished one-page resume, in the look the student picked.
import { useLayoutEffect, useRef, useState } from 'react'
import { useStore } from '../../data/store'
import { resumeContent, resumeLayout } from '../../data/resume'
import { ClassicResume } from './layouts/Classic'
import { SkillsFirstResume } from './layouts/SkillsFirst'
import { SideLabelsResume } from './layouts/SideLabels'

const LAYOUTS = { classic: ClassicResume, skills: SkillsFirstResume, side: SideLabelsResume }

// Text size starts at 11pt and steps down to 9.5pt until the resume fits on one page.
const START_PT = 11
const MIN_PT = 9.5
// A printed page holds 10in of text at 7.3in wide. The preview is a bit narrower (7.2in), so
// it wraps a little more than the printout, which keeps this check on the safe side.
// Checking height against width works at any preview zoom.
const PAGE_RATIO = 1.37

export function ResumeSheet() {
  const { packet } = useStore()
  const r = resumeContent(packet)
  const layout = resumeLayout(packet)
  const Body = LAYOUTS[layout]
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
  }, [contentKey, layout])

  return (
    <>
      {tooLong && (
        <p className="no-print mb-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 font-sans text-sm text-amber-900">
          This resume runs onto a second page. Try fewer bullets, shorter duties, or fewer skills.
        </p>
      )}
      <div ref={ref} className="r-sheet"><Body r={r} /></div>
    </>
  )
}
