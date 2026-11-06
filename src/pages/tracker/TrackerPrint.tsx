// Page 12 printed like the handout.
import { useStore } from '../../data/store'
import { JOB_RESULTS } from '../../data/options'
import { fullName, shortDate } from '../../data/derive'
import { blankApplication } from '../../data/packet'
import { Boxes, HandoutFooter, HandoutHeader } from '../../components/handout'

export function TrackerSheet() {
  const { packet } = useStore()
  const rows = packet.pages.tracker.rows.filter((r) => Object.values(r).some(Boolean))
  while (rows.length < 8) rows.push(blankApplication())
  return (
    <>
      <HandoutHeader title="Job Search Tracker" subtitle="Every job I apply for" name={fullName(packet.profile)} />
      <p className="h-small mt-1">Follow up about 1 week after you apply if you haven't heard back.</p>
      <table className="h-table mt-2">
        <thead>
          <tr>
            <th style={{ width: '10%' }}>Date applied</th><th style={{ width: '14%' }}>Company</th><th style={{ width: '13%' }}>Job title</th>
            <th style={{ width: '12%' }}>How I applied</th><th style={{ width: '16%' }}>Contact name / phone</th>
            <th style={{ width: '10%' }}>Follow-up date</th><th>What happened</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td style={{ height: '44pt' }}>{shortDate(r.date)}</td><td>{r.company}</td><td>{r.title}</td><td>{r.how}</td>
              <td>{r.contact}</td><td>{shortDate(r.followUp)}</td>
              <td className="h-small"><Boxes options={JOB_RESULTS} selected={r.result} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <HandoutFooter page="Job Search Tracker" />
    </>
  )
}
