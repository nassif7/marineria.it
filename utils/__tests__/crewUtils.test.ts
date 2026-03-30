// Mock the @/api/types module so the import inside crewUtils resolves during tests.
// The actual type shapes are inlined below as plain objects — only the fields
// consumed by each function need to be present.
jest.mock('@/api/types', () => ({}))

import { getCertificateOfCompetence, getSeamansBook } from '../crewUtils'
import type { TCrew, TCrewSimple } from '@/api/types'

// ---------------------------------------------------------------------------
// Minimal helper factories
// ---------------------------------------------------------------------------

type CertFields = Pick<
  TCrew,
  'ita_yachts_deck' | 'ita_yachts_engine' | 'mca_yachts_deck' | 'mca_deck_rya' | 'stcw_navy_deck' | 'stcw_navy_engine'
>

const makeCertCrew = (overrides: Partial<CertFields> = {}): TCrew =>
  ({
    ita_yachts_deck: '',
    ita_yachts_engine: '',
    mca_yachts_deck: '',
    mca_deck_rya: '',
    stcw_navy_deck: '',
    stcw_navy_engine: '',
    ...overrides,
  }) as unknown as TCrew

const makeSeamansCrew = (seamansBook: string): TCrew => ({ seamansBook }) as unknown as TCrew

const makeSimpleCertCrew = (overrides: Partial<CertFields> = {}): TCrewSimple =>
  ({
    ita_yachts_deck: '',
    ita_yachts_engine: '',
    mca_yachts_deck: '',
    mca_deck_rya: '',
    stcw_navy_deck: '',
    stcw_navy_engine: '',
    ...overrides,
  }) as unknown as TCrewSimple

// ---------------------------------------------------------------------------
// getCertificateOfCompetence
// ---------------------------------------------------------------------------

describe('getCertificateOfCompetence', () => {
  describe('when no certificate fields are set', () => {
    it('returns hasCertificateOfCompetence = false and an empty array', () => {
      const result = getCertificateOfCompetence(makeCertCrew())

      expect(result.hasCertificateOfCompetence).toBe(false)
      expect(result.certificateOfCompetence).toEqual([])
    })
  })

  describe('when all certificate fields are empty strings', () => {
    it('filters out all falsy values and returns an empty array', () => {
      const crew = makeCertCrew({
        ita_yachts_deck: '',
        ita_yachts_engine: '',
        mca_yachts_deck: '',
        mca_deck_rya: '',
        stcw_navy_deck: '',
        stcw_navy_engine: '',
      })
      const result = getCertificateOfCompetence(crew)

      expect(result.hasCertificateOfCompetence).toBe(false)
      expect(result.certificateOfCompetence).toEqual([])
    })
  })

  describe('when one certificate field is set', () => {
    it('returns hasCertificateOfCompetence = true and array with one entry', () => {
      const crew = makeCertCrew({ ita_yachts_deck: 'Master 500gt' })
      const result = getCertificateOfCompetence(crew)

      expect(result.hasCertificateOfCompetence).toBe(true)
      expect(result.certificateOfCompetence).toEqual(['Master 500gt'])
    })

    it('picks up mca_deck_rya when set', () => {
      const crew = makeCertCrew({ mca_deck_rya: 'RYA Day Skipper' })
      const result = getCertificateOfCompetence(crew)

      expect(result.hasCertificateOfCompetence).toBe(true)
      expect(result.certificateOfCompetence).toEqual(['RYA Day Skipper'])
    })
  })

  describe('when multiple certificate fields are set', () => {
    it('collects all truthy values', () => {
      const crew = makeCertCrew({
        ita_yachts_deck: 'Patente Nautica',
        mca_yachts_deck: 'OOW',
        stcw_navy_engine: 'Y4',
      })
      const result = getCertificateOfCompetence(crew)

      expect(result.hasCertificateOfCompetence).toBe(true)
      expect(result.certificateOfCompetence).toEqual(['Patente Nautica', 'OOW', 'Y4'])
    })

    it('returns all six entries when all fields are set', () => {
      const crew = makeCertCrew({
        ita_yachts_deck: 'A',
        ita_yachts_engine: 'B',
        mca_yachts_deck: 'C',
        mca_deck_rya: 'D',
        stcw_navy_deck: 'E',
        stcw_navy_engine: 'F',
      })
      const result = getCertificateOfCompetence(crew)

      expect(result.hasCertificateOfCompetence).toBe(true)
      expect(result.certificateOfCompetence).toEqual(['A', 'B', 'C', 'D', 'E', 'F'])
    })
  })

  describe('works with TCrewSimple shape', () => {
    it('returns correct result when using a TCrewSimple object', () => {
      const crew = makeSimpleCertCrew({ stcw_navy_deck: 'STCW Basic' })
      const result = getCertificateOfCompetence(crew)

      expect(result.hasCertificateOfCompetence).toBe(true)
      expect(result.certificateOfCompetence).toEqual(['STCW Basic'])
    })
  })
})

// ---------------------------------------------------------------------------
// getSeamansBook
// ---------------------------------------------------------------------------

describe('getSeamansBook', () => {
  it('returns true when seamansBook is exactly "Seamans Book"', () => {
    expect(getSeamansBook(makeSeamansCrew('Seamans Book'))).toBe(true)
  })

  it('returns false when seamansBook is an empty string', () => {
    expect(getSeamansBook(makeSeamansCrew(''))).toBe(false)
  })

  it('returns false when seamansBook is a different string', () => {
    expect(getSeamansBook(makeSeamansCrew('None'))).toBe(false)
  })

  it('returns false when seamansBook differs by case', () => {
    expect(getSeamansBook(makeSeamansCrew('seamans book'))).toBe(false)
  })

  it('returns false when seamansBook has extra whitespace', () => {
    expect(getSeamansBook(makeSeamansCrew(' Seamans Book '))).toBe(false)
  })
})
