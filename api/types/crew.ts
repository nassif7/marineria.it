export type TCrewBase = {
  contacted: boolean | string
  company: string
  address: string
  city: string
  email: string
  url: string
  passport: string
  callWhatsapp: string
  userPhoto: string
  smoker: string
  gender: string
  maritalStatus: string
  qualificationCode: string
  licenseCode: string
  seamansBook: string
  registration_Number: string
  registration_City: string
  registration_Category: string
  registration_Year: string
  courses: string
  mainPosition: string
  specseling: string
  pos_deck: string
  pos_engine: string
  pos_hotel: string
  pos_harbour: string
  pos_special: string
  ita_yachts_deck: string
  ita_yachts_engine: string
  mca_yachts_deck: string
  mca_deck_rya: string
  stcw_navy_deck: string
  stcw_navy_engine: string
  navigationBook: string
  availability: string
  dateAvailability: string
  lastAccessDate: string
  salary: string
  calculatedExperience: string
}

export type TCrew = TCrewBase & {
  offersReceived: number
  certificateOfCompetence: boolean
  iduser: number
  publisched: string
  photoapproved: string
  pushNotificationToken: string
  userName: string
  name: string
  surname: string
  yearofBirth: string
  nationality: string
  province: string
  zip_code: string
  emailCc: string
  telephone: string
  cellular: string
  currentPosition: string
  lat: string
  lng: string
  registraton_date: string
  notesCourses: string
  referencesNumber: number
  approvedReferences: TCrewReference[]
  experiences: TCrewExperience[]
  curriculum: string
  professionalSkills: string
  relationalSkills: string
  organizationalSkills: string
  technicalSkills: string
  couplewith: string
  card1Couple: string
  date_lastchange: string
  educationalLevel: string
  language1: string
  language2: string
  language3: string
  language4: string
  // Certificates of Competence
  mca_yachts_engine: string
  //
  numberClick: number
  secondaryTasks: string
  namephotoA: string
  namephotoB: string
  namephotoC: string
}

export type TCrewSimple = TCrewBase & {
  contacted: boolean
  userId: number
  autoCandidate: boolean
  selected: boolean
  rejected: boolean
  insertDate: string
  firstName: string
  lastName: string
  provincia: string
  postalCode: string
  country: string
  phone: string
  mobile: string
  talkApp: string
  photoApproved: boolean
  birthYear: string
  mca_yachts_engine: string
  coupleWith: string
  coupleProfile: string
  documentStatus: string
  stars: number
  notes: string
  crewlistId: number
  offerId: number
  sent: boolean
  comment: string
}

export type TCrewReference = {
  idReference: number
  positionreferent: string
  company_name: string
  yacht: string
  yearreference: string
  telephone: string
  email: string
  notes: string
}

export type TCrewExperience = {
  idesperienza: number
  fromDate: string
  toDate: string
  experiencedate: string
  boatcompany: string
  employer: string
  typeofemployment: string
  typeofassignment: string
  idreference: string
}
