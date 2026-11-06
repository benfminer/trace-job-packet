// A made-up student ("Jordan Lee" from the handout examples) for demos and tests. Not a real person.
import { blankPacket, type Packet } from './packet'

export function samplePacket(): Packet {
  const p = blankPacket()
  p.teacher = 'Mr. Miner'
  p.caseManager = 'Ms. Rivera'
  Object.assign(p.profile, {
    firstName: 'Jordan', lastName: 'Lee', street: '1234 Main Street', city: 'San Diego', zip: '92105',
    cellPhone: '(619) 555-0142', email: 'jordan.lee@email.com', dob: '2006-03-14', is18: 'yes',
    traceStart: 'August 2025', traceWorkingOn: 'Job skills and travel training',
    hsName: 'Hoover High School', hsCredential: 'certificate', hsYear: '2024', highestGrade: '12',
    driversLicense: 'no', strengths: ['Reliable', 'Punctual', 'Team player'],
    doWell: 'keep my work area clean and organized',
    hoursWanted: '20-30', canAlsoWork: ['Weekends'], travelModes: ['Bus', 'Trolley'],
    travelTime: '45 minutes', lastBusHome: '10:15 PM',
    availabilityText: 'Monday through Friday after 2:00 PM, and all day Saturday and Sunday',
  })
  p.profile.emergency[0] = { name: 'Pat Lee', relationship: 'Mom', phone: '(619) 555-0100' }
  p.profile.certifications[0] = { name: 'Food Handler Card', earned: '09/2025', expires: '09/2028' }
  Object.assign(p.profile.jobs[0], {
    employer: 'CVS', title: 'Store Associate (TRACE work site)', start: '01/2025', end: 'Present',
    supervisor: 'Sam Ortiz', duties: 'Stocked shelves, faced products, and helped customers find what they needed',
    okToContact: 'yes', startPay: 'Unpaid',
  })
  Object.assign(p.profile.jobs[1], {
    employer: 'San Diego Food Bank', title: 'Volunteer', start: '06/2024', end: '08/2024',
    duties: 'Sorted and packed food donations', reasonLeft: 'It was a seasonal job.', okToContact: 'yes',
  })
  for (const d of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const) {
    Object.assign(p.profile.availability[d], { afternoon: true, evening: true, earliest: '2:00 PM' })
  }
  for (const d of ['Saturday', 'Sunday'] as const) {
    Object.assign(p.profile.availability[d], { morning: true, afternoon: true, evening: true })
  }
  p.profile.commitments[0] = { days: 'Mon - Thu', time: '8 AM - 1 PM', what: 'TRACE classes' }

  Object.assign(p.pages.appInfo, {
    jobsWanted: 'Store associate, stocker', payWanted: '18.00', startDate: 'Right away', jobType: 'part',
    legalToWork: 'yes', sponsorship: 'no', workedHereBefore: 'no', reliableTransport: 'yes',
    transportHow: 'Bus and trolley', liftStand: 'Yes, up to 25 lbs. Yes, I can stand for a full shift.',
  })
  p.pages.references.people[0] = {
    name: 'Ana Rivera', jobTitle: 'Case Manager', workplace: 'TRACE, San Diego Unified',
    howTheyKnowMe: 'My case manager at TRACE', phone: '(619) 555-0111', email: 'arivera@example.org',
    knownFor: '1 year', saidYes: true, askedDate: '2026-10-20',
  }
  p.pages.references.people[1] = {
    name: 'Sam Ortiz', jobTitle: 'Store Manager', workplace: 'CVS', howTheyKnowMe: 'My supervisor at CVS',
    phone: '(619) 555-0122', email: '', knownFor: '10 months', saidYes: true, askedDate: '2026-10-22',
  }
  p.pages.references.uses[0] = { date: '2026-11-01', job: 'Smart & Final, Store Associate', listed: '#1, #2', toldThem: true }
  Object.assign(p.pages.coverLetter, {
    jobTitle: 'Store Associate', company: 'Smart & Final', companyStreet: '6235 El Cajon Blvd.',
    companyCityStateZip: 'San Diego, CA 92115', whereFound: 'the Smart & Final careers website',
    experienceWith: 'working with customers', place1: 'CVS',
    did1: 'stocked shelves, faced products, and helped customers find what they needed',
    strengths: ['Reliable', 'Punctual'], doWell: 'take pride in keeping my work area clean and organized',
    why: 'I shop there with my family and I like how the team keeps the store neat and helps customers',
    whenCanWork: 'Monday through Friday after 2:00 PM and all day on weekends', prefilled: true,
  })
  Object.assign(p.pages.resume, {
    objective: 'To get a part-time job as a store associate where I can use my customer service skills',
    skills: ['Customer service', 'Stocking shelves', 'Cash register', 'Following a schedule'],
    languages: 'English and Spanish',
  })
  // Resume bullets are left for the wizard to fill from About Me on first visit.

  const docs = p.pages.documents
  docs.i9Option = 'B'
  Object.assign(docs.docs.stateId, { have: true, where: 'My wallet', expires: '03/2031' })
  Object.assign(docs.docs.ssCard, { have: true, where: 'Folder at home' })
  Object.assign(docs.docs.diploma, { have: true, where: 'Folder at home' })
  Object.assign(docs.docs.foodHandler, { have: true, where: 'Folder at home', expires: '09/2028' })
  Object.assign(docs.docs.busPass, { have: true, where: 'PRONTO app on my phone' })
  docs.firstDay = ['3 printed copies of my resume', 'My References page', 'A pen']

  Object.assign(p.pages.disclosure, {
    reasonsTell: ['I want my supervisor to understand how I work best'],
    reasonsWait: ['I want to get to know the employer first'],
    whenTell: ['afterOffer'],
    helps: [
      { hard: 'Remembering a lot of steps at once', helps: 'A task checklist' },
      { hard: 'Learning a new task', helps: 'Showing me how first' },
      { hard: '', helps: '' },
    ],
    sayHardWorker: 'likes to get things right', sayWorkBest: 'I have a checklist for my tasks',
    sayHelps: 'someone shows me a new task first',
  })

  const t = p.pages.transportation
  Object.assign(t, { pronto: 'app', reducedFare: 'yes', tripApp: 'transit', accessEligible: 'no', closestStop: 'University Ave & 43rd St',
    lateCall: 'Sam Ortiz, (619) 555-0122', missBackup: 'Take the next bus and call my supervisor', lostCall: 'Mom, (619) 555-0100' })
  Object.assign(t.routes[0], { workplace: 'CVS, 4310 University Ave.', routes: 'Bus 7', getOff: 'University Ave & Fairmount',
    travelTime: '20 minutes', leaveBy: '1:30 PM', lastHome: '11:40 PM', practiced: true, practicedDate: '2026-01-10' })

  Object.assign(p.pages.supportTeam.members.jobCoach, { name: 'Chris Nguyen', phone: '(619) 555-0133' })
  Object.assign(p.pages.supportTeam, { callApplication: 'Ms. Rivera (TRACE case manager)', callProblem: 'Chris Nguyen (Job coach)' })

  const b = p.pages.benefits
  b.getNow = ['SSI (Supplemental Security Income)', 'Medi-Cal']
  b.howReport = ['SSA wage reporting app']
  b.whoHelps = 'Pat Lee (Mom)'
  b.log[0] = { month: 'October', paydays: '10/10, 10/24', total: '$412.50', reported: '2026-11-03', confirmation: 'A1B2C3' }

  const iv = p.pages.interview
  Object.assign(iv, {
    introName: 'Jordan', introNow: "in the TRACE program, where I'm building my job skills",
    introExperience: 'stocking shelves and helping customers at CVS', introGoodAt: "keeping things organized, and I'm always on time",
    introWhy: 'I like helping customers and working on a team', recorded: true, doBetter: 'Speak a little slower',
    myQuestions: ['How will I be trained?', 'What hours or shifts are open?'],
    quiz: ['sa', 'd', 'a', 'a', 'a', 'sd', 'sa', 'a'],
    checklist: ['Plan my route (see Transportation Plan)', '2 copies of my resume', 'A pen'],
    interviewer: 'Ms. Garcia', thanksJob: 'Store Associate', thanksCompany: 'Smart & Final', talkedAbout: 'how the team restocks the store each night',
  })
  iv.practice[0] = { who: 'Mr. Miner', date: '2026-11-04' }
  Object.assign(iv.answers, { strengths: 'reliable, on time, team player', dontKnow: 'Ask my supervisor to show me' })

  p.pages.tracker.rows = [
    { date: '2026-11-01', company: 'Smart & Final', title: 'Store Associate', how: 'Company website', contact: 'Ms. Garcia (619) 555-0150', followUp: '2026-11-08', result: 'interview' },
    { date: '2026-10-20', company: 'Target', title: 'Stocker', how: 'Online', contact: '', followUp: '2026-10-27', result: 'waiting' },
  ]

  p.status.about = { done: true, date: '2026-11-05' }
  return p
}
