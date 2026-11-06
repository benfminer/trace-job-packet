// Page 07 printed like the handout.
import { useStore } from '../../data/store'
import { ACCOMMODATION_IDEAS, REASONS_TELL, REASONS_WAIT, SAY_EXAMPLE, WHEN_TELL } from '../../data/options'
import { fullName, shortDate, todayIso } from '../../data/derive'
import { Box, Callout, HandoutFooter, HandoutHeader, HSection } from '../../components/handout'
import { RightsText } from './DisclosureSteps'

interface ReasonListProps {
  options: string[]
  selected: string[]
}

function ReasonList({ options, selected }: ReasonListProps) {
  const others = selected.filter((s) => !options.includes(s))
  return (
    <>
      {options.map((o) => <div key={o}><Box on={selected.includes(o)}>{o}</Box></div>)}
      <div><Box on={others.length > 0}>Other: {others.join(', ') || '________________'}</Box></div>
    </>
  )
}

export function DisclosureSheet() {
  const { packet } = useStore()
  const d = packet.pages.disclosure
  const rows = d.helps.filter((h) => h.hard || h.helps)
  while (rows.length < 2) rows.push({ hard: '', helps: '' })
  return (
    <>
      <HandoutHeader title="Disclosure and Accommodations" subtitle="What helps me do my best work" name={fullName(packet.profile)} updated={shortDate(todayIso())} />
      <Callout><RightsText /></Callout>
      <HSection title="Should I tell?" note="Talk it through with your teacher or job coach.">
        <table className="h-table">
          <thead><tr><th>Reasons I might tell</th><th>Reasons I might wait or not tell</th></tr></thead>
          <tbody><tr>
            <td style={{ width: '50%' }}><ReasonList options={REASONS_TELL} selected={d.reasonsTell} /></td>
            <td><ReasonList options={REASONS_WAIT} selected={d.reasonsWait} /></td>
          </tr></tbody>
        </table>
      </HSection>
      <HSection title="When could I tell?">
        <table className="h-table"><tbody>
          {WHEN_TELL.map((w) => (
            <tr key={w.value}>
              <td className="center" style={{ width: '6%' }}><Box on={d.whenTell.includes(w.value)} /></td>
              <th style={{ width: '24%' }}>{w.label}</th>
              <td>{w.note}</td>
            </tr>
          ))}
        </tbody></table>
      </HSection>
      <HSection title="What helps me at work" note="Describe what helps, not your diagnosis.">
        <table className="h-table">
          <thead><tr><th>Something that can be hard for me</th><th>What helps me (my accommodation)</th></tr></thead>
          <tbody>{rows.map((h, i) => <tr key={i}><td style={{ width: '50%', height: '22pt' }}>{h.hard}</td><td>{h.helps}</td></tr>)}</tbody>
        </table>
        <p className="h-small mt-1">Ideas: {ACCOMMODATION_IDEAS.map((a) => a.toLowerCase()).join('  |  ')}</p>
      </HSection>
      <HSection title="What I can say" note="Practice out loud.">
        <table className="h-table h-fields"><tbody>
          <tr><th>I'm a hard worker who...</th><td>{d.sayHardWorker}</td></tr>
          <tr><th>I work best when...</th><td>{d.sayWorkBest}</td></tr>
          <tr><th>It helps me if...</th><td>{d.sayHelps}</td></tr>
        </tbody></table>
        <p className="h-small mt-1">Example: {SAY_EXAMPLE}</p>
      </HSection>
      <Callout>
        <b>Who can help me ask:</b> My TRACE teacher or case manager  |  My job coach  |  My Department of Rehabilitation
        counselor  |  Job Accommodation Network (askjan.org): free ideas for accommodations
      </Callout>
      <HandoutFooter page="Disclosure and Accommodations" />
    </>
  )
}
