import { TCrew, TCrewSimple } from '@/api/types'

export const getCertificateOfCompetence = (crew: TCrew | TCrewSimple) => {
  const certificateOfCompetence = [
    crew.ita_yachts_deck,
    crew.ita_yachts_engine,
    crew.mca_yachts_deck,
    crew.mca_deck_rya,
    crew.stcw_navy_deck,
    crew.stcw_navy_engine,
  ].filter(Boolean)

  const hasCertificateOfCompetence = !!certificateOfCompetence.length

  return {
    hasCertificateOfCompetence,
    certificateOfCompetence,
  }
}

export const getSeamansBook = (crew: TCrew | TCrewSimple) => {
  return crew.seamansBook === 'Seamans Book'
}
