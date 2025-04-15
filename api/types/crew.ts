export type CrewType = {
  userId: number
  autoCandidate: boolean
  selected: number
  rejected: number
  insertDate: string
  firstName: string
  lastName: string
  company: string
  address: string
  city: string //From
  provincia: string
  postalCode: string
  email: string
  url: string
  country: string
  passport: string // Citizenship
  phone: string
  phone1: string
  mobile: string
  cellulare: string
  fax: string
  phoneprefix: string
  landprefix: string
  whatsAppprefix: string
  talkApp: string
  whatsApp: string
  userPhoto: string
  photoApproved: number
  birthYear: string
  maritalStatus: boolean
  smoker: number // 1 is not smoker
  gender: boolean //
  qualificationCode: string
  licenseCode: string
  gdmCode: boolean
  coursesCode: string // should be the right text
  position: string
  pos_deck: string
  pos_engine: string
  pos_hotel: string
  pos_harbour: string
  pos_special: string
  ita_yachts_deck: string
  ita_yachts_engine: string
  mca_yachts_deck: string
  mca_yachts_engine: string
  mca_deck_rya: string
  stcw_navy_deck: string
  stcw_navy_engine: string
  esP_NON: true
  esp_Armatoriali: true
  esp_Charter: true
  navigationBook: number
  navigationPerformed: number
  availability: boolean
  lastUpdateDate: string
  lastAccessDate: string // Last Seen
  coupleWith: string
  coupleProfile: string
  salary: string
  documentStatus: true
  calculatedExperience: string // Experience:
  crewlistId: number
  offerId: number
  preference: number
  sent: number
  comment: string
}

// seaman's book is missing
// seaman's book experience years is missing
// matricola_GDM
// matricola_Citta
// Also skilled as is missing
// secondary rules are missing
//
// notes
// stars
