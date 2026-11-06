// Page 06 printed like the handout.
import { useStore } from '../../data/store'
import { asOptions, DOCS, FIRST_DAY } from '../../data/options'
import type { DocKey } from '../../data/packet'
import { fullName, shortDate, todayIso } from '../../data/derive'
import { Box, Boxes, Callout, HandoutFooter, HandoutHeader, HSection } from '../../components/handout'

const ID_KEYS: DocKey[] = ['stateId', 'ssCard', 'birthCert', 'passport', 'workPermit', 'diploma', 'foodHandler', 'otherCerts']
const PAY_KEYS: DocKey[] = ['bank', 'busPass']

function DocTable() {
  const { packet } = useStore()
  const { docs, bankName } = packet.pages.documents
  return (
    <table className="h-table" style={{ tableLayout: 'fixed' }}>
      <colgroup>
        <col style={{ width: '24%' }} />
        <col style={{ width: '7%' }} />
        <col style={{ width: '20%' }} />
        <col style={{ width: '11%' }} />
        <col style={{ width: '38%' }} />
      </colgroup>
      <thead><tr><th>Document</th><th className="center">Have it</th><th>Where the original is kept</th><th>Expires</th><th>Don't have it? How to get it</th></tr></thead>
      <tbody>
        {[...ID_KEYS, ...PAY_KEYS].map((k) => {
          const doc = DOCS.find((d) => d.key === k)!
          const row = docs[k]
          const line = (
            <tr key={k}>
              <th>{doc.label}</th>
              <td className="center"><Box on={row.have} /></td>
              <td>{k === 'bank' ? <>Bank name: {bankName}<br />{row.where}</> : row.where}</td>
              <td>{doc.noExpire ? <span className="h-small">Never</span> : row.expires}</td>
              <td className="h-small">{doc.howToGet}</td>
            </tr>
          )
          if (k !== PAY_KEYS[0]) return line
          return [
            <tr key="pay-heading"><td colSpan={5} className="h-table-divider">Getting paid and getting there</td></tr>,
            line,
          ]
        })}
      </tbody>
    </table>
  )
}

export function DocumentsSheet() {
  const { packet } = useStore()
  const d = packet.pages.documents
  return (
    <>
      <HandoutHeader title="Important Documents Checklist" subtitle="What I need when I get hired" name={fullName(packet.profile)} updated={shortDate(todayIso())} />
      <Callout>
        <b>Keep your numbers private.</b> Never write your Social Security number or ID numbers in this folder. Keep the
        original documents in a safe place at home.
      </Callout>
      <HSection title="The I-9 form: proving you can work">
        <p>On your first day or before it, every new employee fills out a form called the I-9. You must show original documents. Copies and phone photos are not accepted. Bring one of these:</p>
        <table className="h-table mt-1"><tbody><tr>
          <td style={{ width: '42%' }}><Box on={d.i9Option === 'A'}><b>Option A</b></Box><br />A U.S. Passport or Passport Card. This one document is enough by itself.</td>
          <td className="center" style={{ width: '6%', verticalAlign: 'middle' }}><b>OR</b></td>
          <td><Box on={d.i9Option === 'B'}><b>Option B</b></Box><br />1. A photo ID (California ID card or driver's license)<br />2. PLUS your Social Security card or birth certificate</td>
        </tr></tbody></table>
      </HSection>
      <HSection title="My documents"><DocTable /></HSection>
      <HSection title="For interviews and my first day">
        <Boxes options={asOptions(FIRST_DAY)} selected={d.firstDay} />
      </HSection>
      <HandoutFooter page="Important Documents Checklist" />
    </>
  )
}
