// Page 10 printed like the handout.
import { useStore } from '../../data/store'
import { asOptions, BENEFITS, BENEFITS_INTRO, BENEFITS_NOT_SURE, FREE_HELP, GOOD_TO_KNOW, REPORT_WAYS } from '../../data/options'
import { fullName, shortDate, todayIso } from '../../data/derive'
import { blankPayReport } from '../../data/packet'
import { Box, Boxes, Callout, HandoutFooter, HandoutHeader, HSection } from '../../components/handout'

export function BenefitsSheet() {
  const { packet } = useStore()
  const b = packet.pages.benefits
  const others = b.getNow.filter((g) => !BENEFITS.includes(g) && g !== BENEFITS_NOT_SURE)
  const rows = b.log.filter((r) => Object.values(r).some(Boolean))
  while (rows.length < 4) rows.push(blankPayReport())
  return (
    <>
      <HandoutHeader title="Benefits and Work" subtitle="Working and keeping my benefits" name={fullName(packet.profile)} updated={shortDate(todayIso())} />
      <Callout>{BENEFITS_INTRO}</Callout>
      <HSection title="Benefits I get now">
        <div className="two-col" style={{ gridTemplateRows: `repeat(${Math.ceil((BENEFITS.length + 2) / 2)}, auto)` }}>
          {BENEFITS.map((o) => <div key={o}><Box on={b.getNow.includes(o)}>{o}</Box></div>)}
          <div><Box on={others.length > 0}>Other: {others.join(', ') || '________________'}</Box></div>
          <div><Box on={b.getNow.includes(BENEFITS_NOT_SURE)}>{BENEFITS_NOT_SURE}</Box></div>
        </div>
      </HSection>
      <HSection title="Good things to know" note="General information only. A benefits counselor can explain your own situation.">
        <table className="h-table"><tbody>
          {GOOD_TO_KNOW.map((g) => <tr key={g.title}><th style={{ width: '32%' }}>{g.title}</th><td>{g.text}</td></tr>)}
        </tbody></table>
      </HSection>
      <HSection title="Reporting my pay" note="SSI: report each month's pay by the 6th of the next month.">
        <table className="h-table h-fields"><tbody>
          <tr><th style={{ width: '22%' }}>How I report</th><td><Boxes options={asOptions(REPORT_WAYS)} selected={b.howReport} /></td></tr>
          <tr><th>Who helps me report</th><td>{b.whoHelps}</td></tr>
        </tbody></table>
        <table className="h-table mt-2">
          <thead><tr><th>Month</th><th>Paydays</th><th>Total pay (before taxes)</th><th>Date I reported</th><th>Confirmation #</th></tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td style={{ height: '20pt' }}>{r.month}</td><td>{r.paydays}</td><td>{r.total}</td>
                <td>{shortDate(r.reported)}</td><td>{r.confirmation}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="h-small mt-1">Keep your pay stubs. Also report job changes to Medi-Cal and CalFresh if you get them.</p>
      </HSection>
      <HSection title="Where to get free help">
        <p className="h-small" style={{ fontSize: '9pt' }}>
          {FREE_HELP.map((h, i) => <span key={h.name}>{i > 0 && '  |  '}<b>{h.name}</b>{h.detail && `: ${h.detail}`}</span>)}
        </p>
      </HSection>
      <HandoutFooter page="Benefits and Work" />
    </>
  )
}
