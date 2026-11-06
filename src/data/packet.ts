// The whole student packet. This is exactly what goes into the save file.
// Rule from the paper packet: no Social Security numbers, ID numbers, or passwords. Ever.

export const APP_ID = 'trace-job-packet'
export const SCHEMA_VERSION = 1

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
  address: string
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

export type PageStatus = { done: boolean; date: string }

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
  employer: '', title: '', address: '', phone: '', supervisor: '', start: '', end: '',
  startPay: '', endPay: '', duties: '', reasonLeft: '', okToContact: '',
})

const blankDay = (): DayAvailability => ({ morning: false, afternoon: false, evening: false, earliest: '', latest: '' })
const blankContact = (): Contact => ({ name: '', relationship: '', phone: '' })
const blankCert = (): Certification => ({ name: '', earned: '', expires: '' })
const blankCommitment = (): Commitment => ({ days: '', time: '', what: '' })
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

    // "Enter once" info shared by every page.
    profile: {
      firstName: '', middleName: '', lastName: '', preferredName: '',
      street: '', apt: '', city: '', state: 'CA', zip: '',
      cellPhone: '', otherPhone: '', email: '',
      dob: '', is18: '' as YesNo,
      emergency: [blankContact(), blankContact()],

      traceStart: '', traceWorkingOn: '',
      hsName: '', hsAddress: '', hsDates: '',
      hsCredential: '' as '' | 'diploma' | 'certificate',
      hsYear: '', highestGrade: '',
      certifications: [blankCert(), blankCert(), blankCert()],
      driversLicense: '' as '' | 'yes' | 'no' | 'permit',
      licenseState: '',

      jobs: [blankJob(), blankJob(), blankJob()],
      strengths: [] as string[],
      doWell: '',

      availability: Object.fromEntries(DAYS.map((d) => [d, blankDay()])) as Record<Day, DayAvailability>,
      commitments: [blankCommitment(), blankCommitment(), blankCommitment()],
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
        liftStand: '', heardAbout: '', weekendsHolidays: '',
      },
      references: {
        people: [blankReference(), blankReference(), blankReference()],
        uses: [blankReferenceUse(), blankReferenceUse(), blankReferenceUse()],
      },
      resume: {
        objective: '',
        skills: [] as string[],
        languages: '',
        // Bullet points for each job in About Me, one per line.
        bullets: ['', '', ''],
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
        log: [blankPayReport(), blankPayReport(), blankPayReport(), blankPayReport()],
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
        // The thank-you note and "How did it go?" are for one interview at a time.
        interviewer: '', thanksJob: '', thanksCompany: '', talkedAbout: '',
        howCompanyDate: '', wentWell: '', practiceNext: '',
      },
      tracker: {
        rows: [blankApplication()],
      },
      coverLetter: {
        jobTitle: '', company: '', companyStreet: '', companyCityStateZip: '',
        whereFound: '', hiringManager: '',
        experienceWith: '',
        place1: '', did1: '', place2: '', did2: '',
        strengths: [] as string[],
        doWell: '',
        why: '',
        whenCanWork: '',
        letterDate: '',
        checklist: [] as string[],
        // Set after the first visit copies About Me answers in, so cleared fields stay cleared.
        prefilled: false,
      },
    },

    status: Object.fromEntries(PAGE_IDS.map((id) => [id, { done: false, date: '' }])) as Record<PageId, PageStatus>,
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

// Turns anything read from a save file into a safe, complete Packet.
export function loadPacket(raw: unknown): Packet {
  if (!raw || typeof raw !== 'object' || (raw as { app?: unknown }).app !== APP_ID) {
    throw new PacketFileError("This doesn't look like a TRACE Job Packet save file.")
  }
  const version = (raw as { schemaVersion?: unknown }).schemaVersion
  if (typeof version === 'number' && version > SCHEMA_VERSION) {
    throw new PacketFileError('This file was saved by a newer version of the app. Reload the page and try again.')
  }
  // Future schema changes get migrated here, before fitting.
  const packet = fit(blankPacket(), raw) as Packet
  packet.schemaVersion = SCHEMA_VERSION
  return packet
}
