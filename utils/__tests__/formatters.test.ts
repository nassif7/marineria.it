import { formatSalary } from '../formatters'

describe('formatSalary', () => {
  describe('both values absent', () => {
    it('returns "NA" when both salaryFrom and salaryTo are empty strings', () => {
      expect(formatSalary('', '')).toBe('NA')
    })
  })

  describe('one value absent', () => {
    it('returns salaryFrom when salaryTo is an empty string', () => {
      expect(formatSalary('2000', '')).toBe('2000')
    })

    it('returns salaryTo when salaryFrom is an empty string', () => {
      expect(formatSalary('', '4000')).toBe('4000')
    })
  })

  describe('both values equal', () => {
    it('returns the single value when salaryFrom equals salaryTo', () => {
      expect(formatSalary('3000', '3000')).toBe('3000')
    })

    it('returns the single value for non-numeric equal strings', () => {
      expect(formatSalary('3.000 €', '3.000 €')).toBe('3.000 €')
    })
  })

  describe('range', () => {
    it('returns "from - to" range string when both values differ', () => {
      expect(formatSalary('2000', '4000')).toBe('2000 - 4000')
    })

    it('returns range with formatted currency strings', () => {
      expect(formatSalary('2.000 €', '5.000 €')).toBe('2.000 € - 5.000 €')
    })

    it('returns range when salaryFrom is greater than salaryTo (no ordering enforced)', () => {
      expect(formatSalary('5000', '2000')).toBe('5000 - 2000')
    })
  })
})
