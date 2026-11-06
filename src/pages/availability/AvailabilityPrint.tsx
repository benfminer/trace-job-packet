// Page 05 printed like the handout.
import { useStore } from '../../data/store'
import { DAYS } from '../../data/packet'
import { availabilitySentence, fullName, shortDate, todayIso } from '../../data/derive'
import { Box, Boxes, Callout, FieldTable, HandoutFooter, HandoutHeader, HSection } from '../../components/handout'
import { ALSO_WORK, asOptions, HOURS_OPTIONS, SLOTS, TRAVEL_MODES } from '../../data/options'

export function AvailabilitySheet() {
  const { packet } = useStore()
  const p = packet.profile
  const commitments = p.commitments.filter((c) => c.days || c.time || c.what)
  while (commitments.length < 3) commitments.push({ days: '', time: '', what: '' })
  return (
    <>
      <HandoutHeader title="Weekly Availability" subtitle="When I can work" name={fullName(p)}
        updated={shortDate(todayIso())} />
      <Callout>
        <b>Be honest.</b> If you say you can work a time, the employer may schedule you then. Check the times you can
        really work, including travel time.
      </Callout>
      <HSection title="Times I can work" note="Check every box that works for you.">
        <table className="h-table">
          <thead>
            <tr>
              <th>Day</th>
              {SLOTS.map((s) => <th key={s.key} className="center">{s.label}<br /><span className="font-normal">{s.hours}</span></th>)}
              <th>Earliest I can start</th>
              <th>Latest I can stay</th>
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day) => {
              const a = p.availability[day]
              return (
                <tr key={day}>
                  <th>{day}</th>
                  {SLOTS.map((s) => <td key={s.key} className="center"><Box on={a[s.key]} /></td>)}
                  <td>{a.earliest}</td>
                  <td>{a.latest}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </HSection>
      <HSection title="Things that already take my time" note="TRACE classes, appointments, another job, family.">
        <table className="h-table">
          <thead><tr><th>Day(s)</th><th>Time</th><th>What</th></tr></thead>
          <tbody>
            {commitments.map((c, i) => <tr key={i}><td>{c.days}&nbsp;</td><td>{c.time}</td><td>{c.what}</td></tr>)}
          </tbody>
        </table>
      </HSection>
      <HSection title="Hours, shifts, and getting there">
        <FieldTable rows={[
          [['Hours per week I want', <Boxes key="h" options={asOptions(HOURS_OPTIONS)} selected={p.hoursWanted} />]],
          [['I can also work', <Boxes key="a" options={asOptions(ALSO_WORK)} selected={p.canAlsoWork} />]],
          [['How I get there', <Boxes key="t" options={asOptions(TRAVEL_MODES)} selected={p.travelModes} />]],
          [['Travel time (one way)', p.travelTime], ['Last bus/trolley home', p.lastBusHome]],
        ]} />
      </HSection>
      <HSection title="What I'll write on applications">
        <table className="h-table"><tbody><tr><td style={{ height: '34pt' }}>{availabilitySentence(p)}</td></tr></tbody></table>
        <p className="h-small mt-1">Example: "Monday through Friday after 2:00 PM, and all day Saturday and Sunday."</p>
      </HSection>
      <HandoutFooter page="Weekly Availability" />
    </>
  )
}
