// The whole student packet. This is exactly what goes into the save file.
// Rule from the paper packet: no Social Security numbers, ID numbers, or passwords. Ever.

import { splitCityStateZip } from './format'

export const APP_ID = 'trace-job-packet'
export const SCHEMA_VERSION = 3

export type YesNo = '' | 'yes' | 'no'

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const
export type Day = (typeof DAYS)[number]

export type DayAvailability = {
  morning: boolean
  afternoon: boolean
  evening: boolean
  earliest: string
  latest: string
}

export type Contact = { name: string; relationship: string; phone: string }

export type Job = {
  employer: string
  title: string
  // Street address. Files saved before city/state/ZIP were split keep the whole address here.
  address: string
  city: string
  state: string
  zip: string
  phone: string
  supervisor: string
  start: string
  end: string
  startPay: string
  endPay: string
  duties: string
  reasonLeft: string
  okToContact: YesNo
}

export type Certification = { name: string; earned: string; expires: string }

export type Commitment = { days: string; time: string; what: string }

export type Reference = {
  name: string
  jobTitle: string
  workplace: string
  howTheyKnowMe: string
  phone: string
  email: string
  knownFor: string
  saidYes: boolean
  askedDate: string
}

export type ReferenceUse = { date: string; job: string; listed: string; toldThem: boolean }

// started: the wizard has been used. done: checked off on the Review & print screen.
// skipped: staff decided this page doesn't apply to this student. Its answers are kept.
export type PageStatus = { started: boolean; done: boolean; date: string; skipped: boolean }

export type DocRow = { have: boolean; where: string; expires: string }

export type Route = {
  workplace: string
  routes: string
  transfer: string
  getOff: string
  travelTime: string
  leaveBy: string
  lastHome: string
  practiced: boolean
  practicedDate: string
}

export type TeamMember = { name: string; phone: string; email: string }

export type HelpRow = { hard: string; helps: string }

export type PayReport = { month: string; paydays: string; total: string; reported: string; confirmation: string }

export type Practice = { who: string; date: string }

export type QuizAnswer = '' | 'sa' | 'a' | 'd' | 'sd'

export type JobResult = '' | 'interview' | 'offer' | 'no' | 'waiting'

export type Application = {
  date: string
  company: string
  title: string
  how: string
  contact: string
  followUp: string
  result: JobResult
}

export const blankJob = (): Job => ({
  employer: '', title: '', address: '', city: '', state: 'CA', zip: '', phone: '', supervisor: '', start: '', end: '',
  startPay: '', endPay: '', duties: '', reasonLeft: '', okToContact: '',
})

// The one job the packet is aimed at right now. A practice job until the student applies for a real one.
export const blankTarget = () => ({
  practice: true,
  title: '', company: '', street: '', city: '', state: 'CA', zip: '',
  whereFound: '', hiringManager: '',
})
export type Target = ReturnType<typeof blankTarget>

const blankDay = (): DayAvailability => ({ morning: false, afternoon: false, evening: false, earliest: '', latest: '' })
const blankContact = (): Contact => ({ name: '', relationship: '', phone: '' })
export const blankCert = (): Certification => ({ name: '', earned: '', expires: '' })
export const blankCommitment = (): Commitment => ({ days: '', time: '', what: '' })
const blankReference = (): Reference => ({
  name: '', jobTitle: '', workplace: '', howTheyKnowMe: '', phone: '', email: '', knownFor: '',
  saidYes: false, askedDate: '',
})
const blankDoc = (): DocRow => ({ have: false, where: '', expires: '' })
const blankRoute = (): Route => ({
  workplace: '', routes: '', transfer: '', getOff: '', travelTime: '', leaveBy: '', lastHome: '',
  practiced: false, practicedDate: '',
})
const blankMember = (): TeamMember => ({ name: '', phone: '', email: '' })

// Keys match the rows on the handouts (06 documents, 09 support team).
export const DOC_KEYS = ['stateId', 'ssCard', 'birthCert', 'passport', 'workPermit', 'diploma', 'foodHandler', 'otherCerts', 'bank', 'busPass'] as const
export type DocKey = (typeof DOC_KEYS)[number]
export const TEAM_KEYS = ['teacher', 'caseManager', 'jobCoach', 'dor', 'regionalCenter', 'benefits', 'conservator', 'family', 'supervisor', 'other'] as const
export type TeamKey = (typeof TEAM_KEYS)[number]

export const blankPayReport = (): PayReport => ({ month: '', paydays: '', total: '', reported: '', confirmation: '' })
export const blankApplication = (): Application => ({
  date: '', company: '', title: '', how: '', contact: '', followUp: '', result: '',
})

// Keys for page 11's practice questions, in handout order.
export const INTERVIEW_KEYS = ['whyHere', 'strengths', 'improving', 'teamwork', 'dontKnow', 'upsetCustomer', 'whyHire', 'whenWork'] as const
export type InterviewKey = (typeof INTERVIEW_KEYS)[number]

export const blankReferenceUse = (): ReferenceUse => ({ date: '', job: '', listed: '', toldThem: false })

export const PAGE_IDS = [
  'about', 'resume', 'coverLetter', 'appInfo', 'references', 'availability', 'documents',
  'disclosure', 'transportation', 'supportTeam', 'benefits', 'interview', 'tracker',
] as const
export type PageId = (typeof PAGE_IDS)[number]

export function blankPacket() {
  const today = new Date().toISOString().slice(0, 10)
  return {
    app: APP_ID,
    schemaVersion: SCHEMA_VERSION,
    savedAt: '',
    packetStarted: today,
    teacher: '',
    caseManager: '',

    target: blankTarget(),

    // "Enter once" info shared by every page.
    profile: {
      firstName: '', middleName: '', lastName: '', preferredName: '',
      street: '', apt: '', city: '', state: 'CA', zip: '',
      cellPhone: '', otherPhone: '', email: '',
      dob: '', is18: '' as YesNo,
      emergency: [blankContact(), blankContact()],

      traceStart: '', traceWorkingOn: '',
      // hsAddress is the street, like a job's address.
      hsName: '', hsAddress: '', hsCity: '', hsState: 'CA', hsZip: '', hsDates: '',
      hsCredential: '' as '' | 'diploma' | 'certificate',
      hsYear: '', highestGrade: '',
      certifications: [blankCert()],
      driversLicense: '' as '' | 'yes' | 'no' | 'permit',
      licenseState: '',

      jobs: [blankJob()],
      strengths: [] as string[],
      doWell: '',

      availability: Object.fromEntries(DAYS.map((d) => [d, blankDay()])) as Record<Day, DayAvailability>,
      commitments: [blankCommitment()],
      hoursWanted: '',
      canAlsoWork: [] as string[],
      travelModes: [] as string[],
      travelTime: '',
      lastBusHome: '',
      availabilityText: '',
    },

    pages: {
      appInfo: {
        jobsWanted: '', payWanted: '', payOpen: false, startDate: '',
        jobType: '' as '' | 'part' | 'full' | 'either',
        legalToWork: '' as YesNo, sponsorship: '' as YesNo,
        workedHereBefore: '' as YesNo, workedHereWhen: '',
        knowAnyone: '', reliableTransport: '' as YesNo, transportHow: '',
        liftStand: '', weekendsHolidays: '',
      },
      references: {
        people: [blankReference(), blankReference(), blankReference()],
        uses: [blankReferenceUse()],
      },
      resume: {
        objective: '',
        skills: [] as string[],
        languages: '',
        // Bullet points for each job in About Me, one per line.
        bullets: [''],
        showAvailability: true,
        prefilled: false,
      },
      documents: {
        i9Option: '' as '' | 'A' | 'B',
        docs: Object.fromEntries(DOC_KEYS.map((k) => [k, blankDoc()])) as Record<DocKey, DocRow>,
        bankName: '',
        firstDay: [] as string[],
      },
      disclosure: {
        reasonsTell: [] as string[],
        reasonsWait: [] as string[],
        whenTell: [] as string[],
        helps: [{ hard: '', helps: '' }, { hard: '', helps: '' }, { hard: '', helps: '' }] as HelpRow[],
        sayHardWorker: '',
        sayWorkBest: '',
        sayHelps: '',
      },
      transportation: {
        pronto: '' as '' | 'card' | 'app',
        reducedFare: '' as '' | 'yes' | 'no' | 'apply',
        tripApp: '' as '' | 'google' | 'transit',
        accessEligible: '' as '' | 'yes' | 'no' | 'notsure',
        closestStop: '',
        routes: [blankRoute(), blankRoute()],
        lateCall: '',
        missBackup: '',
        lostCall: '',
      },
      supportTeam: {
        members: Object.fromEntries(TEAM_KEYS.map((k) => [k, blankMember()])) as Record<TeamKey, TeamMember>,
        otherRole: '',
        callApplication: '',
        callProblem: '',
        callBenefits: '',
        callTransport: '',
        callOffer: '',
        prefilled: false,
      },
      benefits: {
        getNow: [] as string[],
        howReport: [] as string[],
        whoHelps: '',
        log: [blankPayReport()],
      },
      interview: {
        introName: '', introNow: '', introExperience: '', introGoodAt: '', introWhy: '',
        practice: [{ who: '', date: '' }, { who: '', date: '' }] as Practice[],
        recorded: false,
        doBetter: '',
        myQuestions: [] as string[],
        answers: Object.fromEntries(INTERVIEW_KEYS.map((k) => [k, ''])) as Record<InterviewKey, string>,
        otherQuestion: '',
        otherAnswer: '',
        quiz: ['', '', '', '', '', '', '', ''] as QuizAnswer[],
        checklist: [] as string[],
        // The thank-you note and "How did it go?" are for one interview at a time (the target job).
        interviewer: '', talkedAbout: '',
        howCompanyDate: '', wentWell: '', practiceNext: '',
      },
      tracker: {
        rows: [blankApplication()],
      },
      coverLetter: {
        experienceWith: '',
        place1: '', did1: '', place2: '', did2: '',
        strengths: [] as string[],
        doWell: '',
        why: '',
        whenCanWork: '',
        letterDate: '',
        checklist: [] as string[],
        // The student's own final wording for the body of the letter. When filled in, it replaces the built letter.
        finalText: '',
        // Set after the first visit copies About Me answers in, so cleared fields stay cleared.
        prefilled: false,
      },
    },

    status: Object.fromEntries(PAGE_IDS.map((id) => [id, { started: false, done: false, date: '', skipped: false }])) as Record<PageId, PageStatus>,
  }
}

export type Packet = ReturnType<typeof blankPacket>

// Fits any value onto the shape of `template`: keeps matching fields, fills missing ones
// with blanks, drops unknown ones. Lists keep extra rows the student added.
function fit(template: unknown, raw: unknown): unknown {
  if (Array.isArray(template)) {
    if (!Array.isArray(raw)) return template
    if (template.length === 0) return raw.filter((x) => typeof x === 'string')
    const len = Math.max(template.length, raw.length)
    return Array.from({ length: len }, (_, i) => fit(template[i] ?? template[0], raw[i]))
  }
  if (template && typeof template === 'object') {
    const src = raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {}
    return Object.fromEntries(
      Object.entries(template).map(([k, v]) => [k, fit(v, src[k])]),
    )
  }
  return typeof raw === typeof template ? raw : template
}

export class PacketFileError extends Error {}

// Version 1 had one "City, State ZIP" box on the cover letter. Version 2 has three.
function splitCoverLetterCity(raw: object) {
  const letter = (raw as { pages?: { coverLetter?: Record<string, unknown> } }).pages?.coverLetter
  if (!letter || typeof letter.companyCityStateZip !== 'string' || !letter.companyCityStateZip.trim()) return
  const { city, state, zip } = splitCityStateZip(letter.companyCityStateZip)
  Object.assign(letter, { companyCity: city, companyZip: zip }, state ? { companyState: state } : {})
}

// Version 3 keeps the job being applied for in one place (target) instead of on the cover letter,
// the thank-you note, and the application questions. A file with a company typed in counts as a real job.
function moveJobToTarget(raw: object) {
  const r = raw as { target?: unknown; pages?: Record<string, Record<string, unknown> | undefined> }
  if (r.target) return
  const text = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
  const c = r.pages?.coverLetter ?? {}
  const company = text(c.company) || text(r.pages?.interview?.thanksCompany)
  r.target = {
    practice: !company,
    title: text(c.jobTitle) || text(r.pages?.interview?.thanksJob),
    company,
    street: c.companyStreet, city: c.companyCity, state: c.companyState, zip: c.companyZip,
    whereFound: text(c.whereFound) || text(r.pages?.appInfo?.heardAbout),
    hiringManager: c.hiringManager,
  }
}

// True if `value` has an answer that a blank `template` doesn't.
function differs(template: unknown, value: unknown): boolean {
  if (Array.isArray(template)) {
    if (!Array.isArray(value)) return false
    return template.length === 0 ? value.length > 0 : value.some((v, i) => differs(template[i] ?? template[0], v))
  }
  if (template && typeof template === 'object') {
    return Object.entries(template).some(([k, t]) => differs(t, (value as Record<string, unknown>)[k]))
  }
  return value !== template
}

// Drops empty cards from the end of an "Add another" list, always leaving one.
function trimBlank<T>(list: T[], blank: T) {
  while (list.length > 1 && !differs(blank, list[list.length - 1])) list.pop()
}

// Files from before version 3 have no "started" marks, so pages with answers get one.
function markStarted(packet: Packet) {
  const blank = blankPacket()
  const p = packet.profile
  const touched = (id: PageId) =>
    id === 'about' ? !!(p.firstName || p.lastName)
    : id === 'availability' ? !!p.availabilityText || differs(blank.profile.availability, p.availability)
    : differs(blank.pages[id], packet.pages[id])
  for (const id of PAGE_IDS) packet.status[id].started ||= packet.status[id].done || touched(id)
}

// Turns anything read from a save file into a safe, complete Packet.
export function loadPacket(raw: unknown): Packet {
  if (!raw || typeof raw !== 'object' || (raw as { app?: unknown }).app !== APP_ID) {
    throw new PacketFileError("This doesn't look like a TRACE Job Packet save file.")
  }
  const version = (raw as { schemaVersion?: unknown }).schemaVersion
  if (typeof version === 'number' && version > SCHEMA_VERSION) {
    throw new PacketFileError('This file was saved by a newer version of the app. Reload the page and try again.')
  }
  // Older files get migrated here, before fitting.
  const old = typeof version !== 'number' ? 0 : version
  if (old < 2) splitCoverLetterCity(raw)
  if (old < 3) moveJobToTarget(raw)
  const packet = fit(blankPacket(), raw) as Packet
  // Older files started with 3 empty job cards (and so on). Empty ones at the end go away.
  trimBlank(packet.profile.jobs, blankJob())
  trimBlank(packet.profile.certifications, blankCert())
  trimBlank(packet.profile.commitments, blankCommitment())
  trimBlank(packet.pages.references.uses, blankReferenceUse())
  trimBlank(packet.pages.benefits.log, blankPayReport())
  if (old < 3) markStarted(packet)
  packet.schemaVersion = SCHEMA_VERSION
  return packet
}
