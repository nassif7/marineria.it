import { faker } from '@faker-js/faker'
import type {
  TRecruiterSearch,
  TCrewSimple,
  TCrew,
  TCrewReference,
  TCrewExperience,
  TOffer,
  TNotification,
  TRecruiterUser,
  TCrewUser,
} from './types'

/**
 * Fully client-side fake data used to record app demos without touching the real backend.
 * Off by default so it can never ship active by accident — run with
 * `EXPO_PUBLIC_USE_FAKE_DATA=true npx expo start` to turn it on for a recording session.
 */
export const USE_FAKE_DATA = process.env.EXPO_PUBLIC_USE_FAKE_DATA === 'true'

faker.seed(20260720)

const avatarUrl = (seed: number) => `https://i.pravatar.cc/300?img=${(seed % 70) + 1}`

const simulateNetwork = <T>(value: T, ms = 450): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms))

// ── Shared vocabularies ──────────────────────────────────────

const POSITIONS = [
  'Captain',
  'Chief Officer',
  'Second Officer',
  'Bosun',
  'Lead Deckhand',
  'Deckhand',
  'Chief Engineer',
  'Second Engineer',
  'Chief Stewardess',
  'Stewardess',
  'Chef',
  'Sous Chef',
  'Purser',
  'Deck/Engineer',
]

const YACHT_NAMES = [
  'Aurora',
  'Blue Horizon',
  'Serenity',
  'Wind Dancer',
  'Ocean Pearl',
  'Northern Star',
  'Silver Wake',
  'Emerald Isle',
  'Amaranta',
  'Solara',
  'Kalliste',
  'Azzurra',
  'Perle Noire',
  'Windrose',
  'Calypso',
  'Meridian',
  'Sea Owl',
  'Bellissima',
  'Freedom II',
  'Halcyon',
]

const YACHT_PREFIXES = ['M/Y', 'S/Y', 'M/S']

const LOCATIONS = [
  'Monaco',
  'Palma de Mallorca',
  'Antibes',
  'Fort Lauderdale',
  'Genoa',
  'Naples',
  'Viareggio',
  'Barcelona',
  'Cannes',
  'Olbia, Sardinia',
  'Split',
  'Athens',
]

const BOARDING_OPTIONS = ['Immediate', 'Within 2 weeks', 'Within 1 month', 'Flexible', 'ASAP']
const DURATION_OPTIONS = ['Permanent', 'Seasonal (May–Sept)', 'Rotational 3/3', '6 months', '12 months', 'Daywork']
const CONTRACT_TYPES = ['MLC 2006', 'Permanent contract', 'Seasonal contract', 'Freelance', 'Daily rate']
const NATIONALITIES = [
  'Italian',
  'British',
  'French',
  'Spanish',
  'South African',
  'Filipino',
  'Croatian',
  'Australian',
  'New Zealander',
  'American',
  'Ukrainian',
  'Polish',
]
const LANGUAGES = [
  'English (Fluent)',
  'Italian (Native)',
  'French (Intermediate)',
  'Spanish (Basic)',
  'Croatian (Native)',
  'German (Basic)',
]
const EDUCATION_LEVELS = [
  'High School Diploma',
  "Bachelor's Degree",
  'Maritime Academy Diploma',
  'Vocational Certificate',
]
const COURSES_POOL = [
  'STCW Basic Safety Training',
  'ENG1 Medical Certificate',
  'Powerboat Level 2',
  'PADI Divemaster',
  'Silver Service',
  'Wine & Beverage Service',
  'Advanced Fire Fighting',
  'Security Awareness (STCW VI/6)',
  'RYA Yachtmaster Theory',
  'HELM Operational',
]
const CERT_CODES = ['ITA-DK-2201', 'ITA-EN-1187', 'MCA-DK-3390', 'RYA-DK-0456', 'STCW-DK-7712', 'STCW-EN-8834']

const rand = (min: number, max: number) => faker.number.int({ min, max })
const pick = <T>(arr: T[]) => faker.helpers.arrayElement(arr)
const pickSome = <T>(arr: T[], min: number, max: number) => faker.helpers.arrayElements(arr, { min, max })
const maybe = (probability: number) => faker.number.float({ min: 0, max: 1 }) < probability
const ddmmyyyy = (date: Date) =>
  `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`

// ── Crew people pool ─────────────────────────────────────────

type FakePerson = {
  id: number
  firstName: string
  lastName: string
  gender: 'M' | 'F'
  position: string
  city: string
  nationality: string
  birthYear: number
  hasSeamansBook: boolean
  certs: string[]
  courses: string[]
}

const CREW_POOL_SIZE = 160

const crewPool: FakePerson[] = Array.from({ length: CREW_POOL_SIZE }, (_, i) => {
  const gender: 'M' | 'F' = maybe(0.5) ? 'M' : 'F'
  return {
    id: 500000 + i,
    firstName: faker.person.firstName(gender === 'M' ? 'male' : 'female'),
    lastName: faker.person.lastName(),
    gender,
    position: pick(POSITIONS),
    city: faker.location.city(),
    nationality: pick(NATIONALITIES),
    birthYear: rand(1975, 2004),
    hasSeamansBook: maybe(0.65),
    certs: pickSome(CERT_CODES, 0, 3),
    courses: pickSome(COURSES_POOL, 0, 4),
  }
})

const buildExperiences = (person: FakePerson): TCrewExperience[] => {
  const count = rand(1, 4)
  return Array.from({ length: count }, (_, i) => {
    const to = faker.date.past({ years: i + 1 })
    const from = faker.date.past({ years: 1, refDate: to })
    return {
      idesperienza: person.id * 10 + i,
      fromDate: ddmmyyyy(from),
      toDate: ddmmyyyy(to),
      experiencedate: `${ddmmyyyy(from)} – ${ddmmyyyy(to)}`,
      boatcompany: `${pick(YACHT_PREFIXES)} ${pick(YACHT_NAMES)}`,
      employer: faker.company.name(),
      typeofemployment: person.position,
      typeofassignment: `Responsible for ${faker.hacker.phrase().toLowerCase()} while stationed in ${pick(LOCATIONS)}.`,
      idreference: String(person.id * 10 + i),
    }
  })
}

const buildReferences = (person: FakePerson): TCrewReference[] => {
  const count = rand(0, 3)
  return Array.from({ length: count }, (_, i) => ({
    idReference: person.id * 10 + i,
    positionreferent: pick(['Captain', 'Chief Officer', 'Chief Stewardess', 'Owner Representative', 'Purser']),
    company_name: faker.company.name(),
    yacht: `${pick(YACHT_PREFIXES)} ${pick(YACHT_NAMES)}`,
    yearreference: String(rand(2018, 2025)),
    telephone: faker.phone.number(),
    email: faker.internet.email({ firstName: 'reference', lastName: String(i) }).toLowerCase(),
    notes: `Excellent teamwork and reliability during the ${pick(DURATION_OPTIONS).toLowerCase()} season.`,
  }))
}

const buildFullCrew = (person: FakePerson): TCrew => {
  const { certs, courses } = person
  const photoCount = maybe(0.6) ? rand(1, 3) : 0
  return {
    offersRecieved: rand(0, 12),
    certificateOfCompetence: certs.length > 0,
    contacted: false,
    iduser: person.id,
    published: 'True',
    photoapproved: 'True',
    pushNotificationToken: '',
    userName: `${person.firstName.toLowerCase()}.${person.lastName.toLowerCase()}`,
    name: person.firstName,
    surname: person.lastName,
    yearofBirth: String(person.birthYear),
    gender: person.gender,
    maritalStatus: pick(['Single', 'Married', 'Engaged']),
    nationality: person.nationality,
    company: '',
    address: faker.location.streetAddress(),
    city: person.city,
    province: faker.location.state(),
    zip_code: faker.location.zipCode(),
    emailCc: '',
    email: faker.internet.email({ firstName: person.firstName, lastName: person.lastName }).toLowerCase(),
    url: '',
    telephone: faker.phone.number(),
    cellular: faker.phone.number(),
    callWhatsapp: `https://wa.me/${faker.string.numeric(11)}`,
    userPhoto: avatarUrl(person.id),
    smoker: maybe(0.2) ? 'Yes' : 'No',
    currentPosition: person.position,
    lat: '',
    lng: '',
    mainPosition: person.position,
    qualificationCode: faker.string.alphanumeric({ length: 6, casing: 'upper' }),
    licenseCode: faker.string.alphanumeric({ length: 8, casing: 'upper' }),
    seamansBook: person.hasSeamansBook ? 'Seamans Book' : '',
    registration_Number: faker.string.numeric(6),
    registration_City: person.city,
    registration_Category: pick(['Deck', 'Engine', 'Interior', 'Galley']),
    registration_Year: String(rand(2010, 2023)),
    navigationBook: maybe(0.5) ? 'Yes' : 'No',
    calculatedExperience: `${rand(1, 15)} years`,
    availability: 'Available',
    dateAvailability: ddmmyyyy(faker.date.soon({ days: 60 })),
    lastAccessDate: ddmmyyyy(faker.date.recent({ days: 14 })),
    registraton_date: ddmmyyyy(faker.date.past({ years: 3 })),
    courses: courses.join(', '),
    notesCourses: '',
    specseling: maybe(0.4) ? pick(['Diving Instructor', 'Watersports', 'Fishing Charter', 'Sommelier']) : '',
    referencesNumber: 0,
    approvedReferences: buildReferences(person),
    experiences: buildExperiences(person),
    curriculum: `Dedicated ${person.position.toLowerCase()} with ${rand(1, 15)} years of experience across the Mediterranean and beyond, known for a strong work ethic and attention to detail.`,
    professionalSkills: 'Strong problem-solving skills and calm under pressure during demanding charters.',
    relationalSkills: 'Excellent communicator, comfortable working within a tight-knit international crew.',
    organizationalSkills: 'Meticulous with checklists, provisioning and watch scheduling.',
    technicalSkills: 'Proficient with onboard systems, navigation electronics and safety equipment.',
    couplewith: '',
    card1Couple: '',
    salary: String(rand(2200, 8500)),
    date_lastchange: ddmmyyyy(faker.date.recent({ days: 30 })),
    educationalLevel: pick(EDUCATION_LEVELS),
    language1: LANGUAGES[0],
    language2: pick(LANGUAGES.slice(1)),
    language3: maybe(0.5) ? pick(LANGUAGES) : '',
    language4: maybe(0.2) ? pick(LANGUAGES) : '',
    pos_deck: maybe(0.3) ? 'Deckhand' : '',
    pos_engine: maybe(0.2) ? 'Engineer' : '',
    pos_hotel: maybe(0.3) ? 'Stewardess' : '',
    pos_harbour: maybe(0.15) ? 'Dockmaster' : '',
    pos_special: maybe(0.15) ? 'Watersports Instructor' : '',
    ita_yachts_deck: certs.includes('ITA-DK-2201') ? 'ITA-DK-2201' : '',
    ita_yachts_engine: certs.includes('ITA-EN-1187') ? 'ITA-EN-1187' : '',
    mca_yachts_deck: certs.includes('MCA-DK-3390') ? 'MCA-DK-3390' : '',
    mca_deck_rya: certs.includes('RYA-DK-0456') ? 'RYA-DK-0456' : '',
    stcw_navy_deck: certs.includes('STCW-DK-7712') ? 'STCW-DK-7712' : '',
    stcw_navy_engine: certs.includes('STCW-EN-8834') ? 'STCW-EN-8834' : '',
    numberClick: rand(0, 300),
    passport: person.nationality.slice(0, 3).toUpperCase(),
    secondaryTasks: '',
    namephotoA: photoCount > 0 ? avatarUrl(person.id + 1000) : '',
    namephotoB: photoCount > 1 ? avatarUrl(person.id + 2000) : '',
    namephotoC: photoCount > 2 ? avatarUrl(person.id + 3000) : '',
  }
}

const toCrewSimple = (
  crew: TCrew,
  person: FakePerson,
  extra: { crewlistId: number; offerId: number; contacted: boolean }
): TCrewSimple => ({
  contacted: extra.contacted,
  published: maybe(0.85),
  userId: crew.iduser,
  autoCandidate: maybe(0.4),
  selected: false,
  rejected: false,
  insertDate: ddmmyyyy(faker.date.recent({ days: 21 })),
  firstName: crew.name,
  lastName: crew.surname,
  company: crew.company,
  address: crew.address,
  city: crew.city,
  provincia: crew.province,
  postalCode: crew.zip_code,
  email: crew.email,
  url: crew.url,
  country: person.nationality,
  passport: crew.passport,
  phone: crew.telephone,
  mobile: crew.cellular,
  callWhatsapp: crew.callWhatsapp,
  talkApp: '',
  userPhoto: crew.userPhoto,
  photoApproved: true,
  birthYear: crew.yearofBirth,
  maritalStatus: crew.maritalStatus,
  smoker: crew.smoker,
  gender: crew.gender,
  qualificationCode: crew.qualificationCode,
  licenseCode: crew.licenseCode,
  seamansBook: crew.seamansBook,
  registration_Number: crew.registration_Number,
  registration_City: crew.registration_City,
  registration_Category: crew.registration_Category,
  registration_Year: crew.registration_Year,
  courses: crew.courses,
  mainPosition: crew.mainPosition,
  specseling: crew.specseling,
  pos_deck: crew.pos_deck,
  pos_engine: crew.pos_engine,
  pos_hotel: crew.pos_hotel,
  pos_harbour: crew.pos_harbour,
  pos_special: crew.pos_special,
  ita_yachts_deck: crew.ita_yachts_deck,
  ita_yachts_engine: crew.ita_yachts_engine,
  mca_yachts_deck: crew.mca_yachts_deck,
  mca_yachts_engine: '',
  mca_deck_rya: crew.mca_deck_rya,
  stcw_navy_deck: crew.stcw_navy_deck,
  stcw_navy_engine: crew.stcw_navy_engine,
  navigationBook: crew.navigationBook,
  availability: crew.availability,
  dateAvailability: crew.dateAvailability,
  lastAccessDate: crew.lastAccessDate,
  coupleWith: crew.couplewith,
  coupleProfile: crew.card1Couple,
  salary: crew.salary,
  documentStatus: maybe(0.7) ? 'Complete' : 'Pending',
  calculatedExperience: crew.calculatedExperience,
  stars: rand(0, 5),
  notes: '',
  crewlistId: extra.crewlistId,
  offerId: extra.offerId,
  sent: extra.contacted,
  comment: '',
})

// ── Searches (recruiter job postings) + their candidates ────

const SEARCH_COUNT = 3
let nextCrewlistId = 1

const crewProfiles = new Map<number, TCrew>()
const crewListByOffer = new Map<number, TCrewSimple[]>()
const searches: TRecruiterSearch[] = []

for (let i = 0; i < SEARCH_COUNT; i++) {
  const idoffer = 900000 + i
  const mainPosition = pick(POSITIONS)
  const yacht = `${pick(YACHT_PREFIXES)} ${pick(YACHT_NAMES)}`
  const salaryFrom = rand(2500, 5000)
  const salaryTo = salaryFrom + rand(300, 2000)
  const reference = `MY26_${1000 + i}`

  const candidateCount = rand(8, 22)
  const candidates = faker.helpers.arrayElements(crewPool, candidateCount)
  const listEntries: TCrewSimple[] = []
  let contactedCount = 0

  for (const person of candidates) {
    if (!crewProfiles.has(person.id)) {
      crewProfiles.set(person.id, buildFullCrew(person))
    }
    const contacted = maybe(0.3)
    if (contacted) contactedCount++
    listEntries.push(
      toCrewSimple(crewProfiles.get(person.id)!, person, {
        crewlistId: nextCrewlistId++,
        offerId: idoffer,
        contacted,
      })
    )
  }
  crewListByOffer.set(idoffer, listEntries)

  searches.push({
    idoffer,
    name: '',
    surname: '',
    username: '',
    email: '',
    iduser: 0,
    pushNotificationToken: '',
    contractDescription: pick(CONTRACT_TYPES),
    unit: 1,
    gender: pick(['Indifferent', 'M', 'F']),
    seamensBook: maybe(0.6) ? 'Seamans Book required' : '',
    nauticaLicense: '',
    espCharter: maybe(0.4) ? 'Charter experience preferred' : '',
    requirements: `Minimum ${rand(2, 8)} years of experience as ${mainPosition}. STCW certification required. Team player with excellent references.`,
    title: `${mainPosition} – ${yacht}`,
    offer: `${mainPosition} wanted for ${yacht}, based in ${pick(LOCATIONS)}`,
    offerdate: ddmmyyyy(faker.date.recent({ days: 45 })),
    offertExpirationdate: ddmmyyyy(faker.date.soon({ days: 60 })),
    descriptionOffer: `We are looking for an experienced and motivated ${mainPosition.toLowerCase()} to join the crew of ${yacht}. The successful candidate will be professional, flexible and passionate about the yachting lifestyle.`,
    reference,
    countCandidates: listEntries.length,
    countContacted: contactedCount,
    countResidual: Math.max(0, 30 - listEntries.length),
    ownerDescription: `Privately owned ${rand(30, 70)}m motor yacht cruising the Mediterranean.`,
    mainPosition,
    jobOffer: mainPosition,
    specseling: maybe(0.3) ? pick(['Diving', 'Watersports', 'Fishing']) : '',
    posDeck:
      mainPosition.includes('Deck') || mainPosition === 'Captain' || mainPosition === 'Bosun' ? mainPosition : '',
    posEngine: mainPosition.includes('Engineer') ? mainPosition : '',
    posHotel:
      mainPosition.includes('Stewardess') || mainPosition === 'Chef' || mainPosition === 'Purser' ? mainPosition : '',
    posHarbour: '',
    positionSpecial: '',
    courses: pickSome(COURSES_POOL, 0, 3).join(', '),
    boarding: pick(BOARDING_OPTIONS),
    duration: pick(DURATION_OPTIONS),
    positionArm: pick(LOCATIONS),
    itaYachtsDeck: '',
    itaYachtsEngine: '',
    mcaYachtsDeck: '',
    mcaDeckRya: '',
    stcwNavyDeck: '',
    stcwNavyEngine: '',
    salary_From: String(salaryFrom),
    salary_To: String(salaryTo),
    latArm: 0,
    lngArm: 0,
    listurl: `search/${reference}`,
    listgeourl: `search-location/${pick(LOCATIONS).toLowerCase().replace(/\s+/g, '-')}`,
    offerApplicable: true,
    alreadyApplied: false,
    paid: true,
    credit: true,
    offerPublished: 1,
  })
}

// ── Job offers (crew / pro side) ─────────────────────────────

const OFFER_COUNT = 24

const offers: TOffer[] = Array.from({ length: OFFER_COUNT }, (_, i) => {
  const idoffer = 800000 + i
  const mainPosition = pick(POSITIONS)
  const yacht = `${pick(YACHT_PREFIXES)} ${pick(YACHT_NAMES)}`
  const salaryFrom = rand(2200, 4800)
  const salaryTo = salaryFrom + rand(300, 1800)
  const reference = `JOB26_${2000 + i}`
  const offerApplicable = maybe(0.55)
  const alreadyApplied = offerApplicable ? maybe(0.3) : false

  return {
    idoffer,
    iduser: 0,
    pushNotificationToken: '',
    contractDescription: pick(CONTRACT_TYPES),
    unit: 1,
    gender: pick(['Indifferent', 'M', 'F']),
    seamensBookCode: maybe(0.6) ? 1 : 0,
    seamensBook: maybe(0.6) ? 'Seamans Book required' : '',
    nauticaLicense: '',
    espCharter: maybe(0.4) ? 'Charter experience preferred' : '',
    requirements: `Minimum ${rand(1, 6)} years of experience as ${mainPosition}. STCW certification required.`,
    title: `${mainPosition} – ${yacht}`,
    offer: `${mainPosition} wanted for ${yacht}, based in ${pick(LOCATIONS)}`,
    offerEng: `${mainPosition} wanted for ${yacht}, based in ${pick(LOCATIONS)}`,
    offerdate: ddmmyyyy(faker.date.recent({ days: 30 })),
    offertExpirationdate: ddmmyyyy(faker.date.soon({ days: 45 })),
    descriptionOffer: `We are looking for an experienced ${mainPosition.toLowerCase()} to join the crew of ${yacht}. Professional attitude and flexibility required.`,
    reference,
    ownerDescription: `Privately owned ${rand(25, 65)}m motor yacht.`,
    mainPosition,
    jobOffer: mainPosition,
    specseling: maybe(0.3) ? pick(['Diving', 'Watersports', 'Fishing']) : '',
    posDeck:
      mainPosition.includes('Deck') || mainPosition === 'Captain' || mainPosition === 'Bosun' ? mainPosition : '',
    posEngine: mainPosition.includes('Engineer') ? mainPosition : '',
    posHotel:
      mainPosition.includes('Stewardess') || mainPosition === 'Chef' || mainPosition === 'Purser' ? mainPosition : '',
    posHarbour: '',
    positionSpecial: '',
    courses: pickSome(COURSES_POOL, 0, 3).join(', '),
    boarding: pick(BOARDING_OPTIONS),
    duration: pick(DURATION_OPTIONS),
    positionArm: pick(LOCATIONS),
    itaYachtsDeck: '',
    itaYachtsEngine: '',
    mcaYachtsDeck: '',
    mcaDeckRya: '',
    stcwNavyDeck: '',
    stcwNavyEngine: '',
    date_start_boarding: ddmmyyyy(faker.date.soon({ days: 30 })),
    date_end_boarding: '',
    salary_From: String(salaryFrom),
    salary_To: String(salaryTo),
    latArm: 0,
    lngArm: 0,
    offerApplicable,
    alreadyApplied,
  }
})

// ── Notifications ─────────────────────────────────────────────
// Mirrors the real "Contact\nName\nCity\nemail\nTel: x\nWhatsApp: x" block both
// NotificationsModal (crew) and RecruiterNotificationsModal parse out of `message`.

const buildContactMessage = (name: string, city: string, email: string, phone: string) =>
  `Contact\n${name}\n${city}\n${email}\nTel: ${phone}\nWhatsApp: ${phone}`

const crewNotifications: TNotification[] = offers
  .filter((o) => o.alreadyApplied)
  .slice(0, 4)
  .map((o, i) => {
    const contactName = faker.person.fullName()
    return {
      category: 'application-accepted',
      title: 'Application accepted',
      message: buildContactMessage(
        contactName,
        pick(LOCATIONS),
        faker.internet.email({ firstName: contactName.split(' ')[0] }).toLowerCase(),
        faker.phone.number()
      ),
      idoffer: o.idoffer,
      iduser: 0,
      id: i + 1,
      isread: i < 2 ? 1 : 0,
      link: '',
    }
  })
  .concat({
    category: 'application-accepted',
    title: 'Application accepted',
    message: buildContactMessage(
      faker.person.fullName(),
      pick(LOCATIONS),
      faker.internet.email().toLowerCase(),
      faker.phone.number()
    ),
    idoffer: 0,
    iduser: 0,
    id: 9001,
    isread: 0,
    link: '',
  })

const recruiterNotifications: TNotification[] = searches
  .flatMap((s) =>
    (crewListByOffer.get(s.idoffer) ?? []).filter((c) => c.contacted).map((crew) => ({ search: s, crew }))
  )
  .slice(0, 4)
  .map(({ search, crew }, i) => ({
    category: 'candidate-contacted',
    title: `Position ${search.mainPosition} for private M/Y ${rand(25, 70)}M Italian Flag [${search.idoffer}_${search.idoffer - 899000}]`,
    message: buildContactMessage(`${crew.firstName} ${crew.lastName}`, crew.city, crew.email, crew.mobile),
    idoffer: search.idoffer,
    iduser: crew.userId,
    id: i + 1,
    isread: i < 2 ? 1 : 0,
    link: '',
  }))
  .concat({
    category: 'candidate-contacted',
    title: 'Position Chief Stewardess for private M/Y 45M Italian Flag [70000_10999]',
    message: buildContactMessage(
      faker.person.fullName(),
      pick(LOCATIONS),
      faker.internet.email().toLowerCase(),
      faker.phone.number()
    ),
    idoffer: 0,
    iduser: rand(1000, 9999),
    id: 9002,
    isread: 0,
    link: '',
  })

// ── Logged-in user identity (name + contact only, rest of the real profile stays intact) ──

export const maskRecruiterIdentity = (user: TRecruiterUser): TRecruiterUser => ({
  ...user,
  name: 'Sofia',
  surname: 'Bellini',
  company: 'Bellini Yachts',
  address: 'Via del Porto 12',
  email: 'sofia.bellini@example.com',
  emailCc: '',
  cellular: '+39 345 123 4567',
  telephone: '+39 010 123 4567',
  whatsapp: '+39 345 123 4567',
  callWhatsapp: '+39 345 123 4567',
  url: 'www.belliniyachts.example',
})

export const maskCrewIdentity = (user: TCrewUser): TCrewUser => ({
  ...user,
  name: 'Marco',
  surname: 'Rinaldi',
  email: 'marco.rinaldi@example.com',
  emailCc: '',
  cellular: '+39 347 987 6543',
  telephone: '',
  callWhatsapp: '+39 347 987 6543',
})

// ── Public API of this module ────────────────────────────────

export const fakeGetNotifications = (role: 'crew' | 'recruiter') =>
  simulateNetwork({ notifications: role === 'recruiter' ? [...recruiterNotifications] : [...crewNotifications] })

export const fakeSetNotificationRead = (notificationId: number) => {
  const found = [...crewNotifications, ...recruiterNotifications].find((n) => n.id === notificationId)
  if (found) found.isread = 1
  return simulateNetwork(undefined)
}

export const fakeGetRecruiterActiveSearches = () => simulateNetwork([...searches])

export const fakeGetRecruiterSearchById = (searchId: string | number) => {
  const found = searches.filter((s) => String(s.idoffer) === String(searchId))
  return simulateNetwork(found)
}

export const fakeGetCrewList = (offerId: string | number) =>
  simulateNetwork([...(crewListByOffer.get(Number(offerId)) ?? [])])

export const fakeGetCrewCv = (crewId: string | number) => {
  const crew = crewProfiles.get(Number(crewId))
  if (!crew) return simulateNetwork({} as TCrew)
  return simulateNetwork({ ...crew })
}

export const fakeContactCrew = (crewId: string | number, offerId: string | number) => {
  const uid = Number(crewId)
  const oid = Number(offerId)
  const entries = crewListByOffer.get(oid)
  const entry = entries?.find((c) => c.userId === uid)
  if (entry && !entry.contacted) {
    entry.contacted = true
    entry.sent = true
    const search = searches.find((s) => s.idoffer === oid)
    if (search) search.countContacted += 1
  }
  const profile = crewProfiles.get(uid)
  if (profile) profile.contacted = true
  return simulateNetwork('OK')
}

export const fakeRemoveCrew = (crewId: string | number, offerId: string | number) => {
  const uid = Number(crewId)
  const oid = Number(offerId)
  const entries = crewListByOffer.get(oid)
  if (entries) {
    crewListByOffer.set(
      oid,
      entries.filter((c) => c.userId !== uid)
    )
    const search = searches.find((s) => s.idoffer === oid)
    if (search) search.countCandidates = Math.max(0, search.countCandidates - 1)
  }
  return simulateNetwork('OK')
}

export const fakeGetAllOffers = () => simulateNetwork([...offers])

export const fakeGetOffersForApply = () => simulateNetwork(offers.filter((o) => o.offerApplicable))

export const fakeGetOfferById = (offerId: string | number) => {
  const found = offers.filter((o) => String(o.idoffer) === String(offerId))
  return simulateNetwork(found)
}

export const fakeApplyToOffer = (offerId: string | number) => {
  const offer = offers.find((o) => String(o.idoffer) === String(offerId))
  if (offer) offer.alreadyApplied = true
  return simulateNetwork('OK')
}

export const fakeGetWhyCanNotApply = () =>
  simulateNetwork([
    pick(['Missing seamans book', 'Position does not match your profile', 'Missing required certificate']),
  ])
