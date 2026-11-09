// Page 08 printed like the handout.
import { useStore } from '../../data/store'
import { asOptions, TRAVEL_MODES } from '../../data/options'
import { fullName, shortDate, todayIso } from '../../data/derive'
import { Box, Boxes, Callout, FieldTable, HandoutFooter, HandoutHeader, HSection, QuestionTable } from '../../components/handout'

const YNX = (extra: { value: string; label: string }) => [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, extra]

export function TransportationSheet() {
  const { packet } = useStore()
  const t = packet.pages.transportation
  return (
    <>
      <HandoutHeader title="Transportation Plan" subtitle="How I get to work and back" name={fullName(packet.profile)} updated={shortDate(todayIso())} />
      <HSection title="How I travel">
        <FieldTable rows={[
          [['I usually get around by', <Boxes key="m" options={asOptions(TRAVEL_MODES)} selected={packet.profile.travelModes} />]],
          [['PRONTO pass', <Boxes key="p" options={[{ value: 'card', label: 'Card' }, { value: 'app', label: 'App' }]} selected={t.pronto} />],
            ['Reduced Fare?', <Boxes key="r" options={YNX({ value: 'apply', label: 'Apply' })} selected={t.reducedFare} />]],
          [['Trip-planning app', <Boxes key="t" options={[{ value: 'google', label: 'Google Maps' }, { value: 'transit', label: 'Transit' }]} selected={t.tripApp} />],
            ['MTS Access eligible?', <Boxes key="a" options={YNX({ value: 'notsure', label: 'Not sure' })} selected={t.accessEligible} />]],
          [['My closest stop to home', t.closestStop]],
        ]} />
        <p className="h-small mt-1">Reduced Fare for riders with disabilities and MTS Access sign-up: ask at the MTS Transit Store or sdmts.com. MTS Access rides must be booked ahead of time.</p>
      </HSection>
      <HSection title="My route to work">
        {t.routes.map((r, i) => (
          <div key={i} className="keep-together mb-2">
            <p className="h-small font-bold" style={{ color: '#1e88d2' }}>Workplace #{i + 1}</p>
            <FieldTable rows={[
              [['Workplace and address', r.workplace]],
              [['Route(s) I take', r.routes], ['Where I transfer', r.transfer]],
              [['Stop where I get off', r.getOff], ['Travel time', r.travelTime]],
              [['Leave home by', r.leaveBy], ['Last bus/trolley home', r.lastHome]],
              [['I practiced this trip', <span key="pr"><Box on={r.practiced}>Yes</Box> Date: {shortDate(r.practicedDate) || '______'}</span>]],
            ]} />
          </div>
        ))}
      </HSection>
      <HSection title="If something goes wrong">
        <QuestionTable rows={[
          ["If I'm going to be late, I call", t.lateCall],
          ['If I miss my bus, my backup plan is', t.missBackup],
          ['If I get lost, I call', t.lostCall],
        ]} />
      </HSection>
      <Callout>
        <b>Running late?</b> Call your supervisor before your shift starts. Say: "Hi, this is ____. My bus is late. I'll be there at ____."
      </Callout>
      <HandoutFooter page="Transportation Plan" />
    </>
  )
}
