import { formatDate, getAge, getAgeByYear, isDateString } from '../dateUtils'

// ---------------------------------------------------------------------------
// formatDate
// ---------------------------------------------------------------------------

describe('formatDate', () => {
  it('formats a mid-year date with zero-padded day and month', () => {
    // 2024-07-04 → "04/07/2024"
    expect(formatDate('2024-07-04')).toBe('04/07/2024')
  })

  it('formats a date where day and month are already two digits', () => {
    expect(formatDate('2023-12-31')).toBe('31/12/2023')
  })

  it('zero-pads a single-digit day', () => {
    expect(formatDate('2020-03-05')).toBe('05/03/2020')
  })

  it('zero-pads a single-digit month', () => {
    expect(formatDate('1990-01-15')).toBe('15/01/1990')
  })

  it('formats a date at the start of the year', () => {
    expect(formatDate('2000-01-01')).toBe('01/01/2000')
  })

  it('formats a date with a four-digit year correctly', () => {
    expect(formatDate('1999-06-20')).toBe('20/06/1999')
  })
})

// ---------------------------------------------------------------------------
// getAge — pin "today" for deterministic results
// ---------------------------------------------------------------------------

describe('getAge', () => {
  beforeAll(() => {
    // Pin clock to 2026-03-30
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-03-30'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('returns the correct age when birthday already passed this year', () => {
    // Born 2000-01-15 → turned 26 on Jan 15 2026
    expect(getAge('2000-01-15')).toBe(26)
  })

  it('returns the correct age on the exact birthday', () => {
    // Born 2000-03-30 → exactly 26 today
    expect(getAge('2000-03-30')).toBe(26)
  })

  it('subtracts one year when birthday has not yet occurred this year', () => {
    // Born 2000-12-01 → not yet turned 26, so still 25
    expect(getAge('2000-12-01')).toBe(25)
  })

  it('subtracts one year when born on the same month but a later day', () => {
    // Born 2000-03-31 → birthday is tomorrow, so still 25
    expect(getAge('2000-03-31')).toBe(25)
  })

  it('returns 0 for someone born earlier this year who has already had their birthday', () => {
    expect(getAge('2026-01-01')).toBe(0)
  })

  it('handles a newborn (born today) as age 0', () => {
    expect(getAge('2026-03-30')).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// getAgeByYear — simple year-level arithmetic
// ---------------------------------------------------------------------------

describe('getAgeByYear', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-03-30'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('returns the difference in calendar years', () => {
    expect(getAgeByYear('2000-01-01')).toBe(26)
  })

  it('returns 0 when the birth year equals the current year', () => {
    expect(getAgeByYear('2026-06-15')).toBe(0)
  })

  it('handles a past century birth year', () => {
    expect(getAgeByYear('1960-01-01')).toBe(66)
  })
})

// ---------------------------------------------------------------------------
// isDateString
// ---------------------------------------------------------------------------

describe('isDateString', () => {
  // --- Truthy cases ---

  describe('returns true for valid date strings', () => {
    it('recognises ISO format YYYY-MM-DD', () => {
      expect(isDateString('2024-07-04')).toBe(true)
    })

    it('recognises slash-delimited DD/MM/YYYY', () => {
      expect(isDateString('04/07/2024')).toBe(true)
    })

    it('recognises dot-delimited date DD.MM.YYYY', () => {
      expect(isDateString('04.07.2024')).toBe(true)
    })

    it('recognises hyphen-delimited DD-MM-YYYY', () => {
      expect(isDateString('04-07-2024')).toBe(true)
    })

    it('recognises English month name with day and year', () => {
      expect(isDateString('15 March 2022')).toBe(true)
    })

    it('recognises English abbreviated month', () => {
      expect(isDateString('15 Mar 2022')).toBe(true)
    })

    it('recognises Italian month name', () => {
      expect(isDateString('15 marzo 2022')).toBe(true)
    })

    it('recognises an ISO datetime string', () => {
      expect(isDateString('2024-07-04T12:30:00Z')).toBe(true)
    })
  })

  // --- Falsy cases ---

  describe('returns false for non-date strings', () => {
    it('returns false for an empty string', () => {
      expect(isDateString('')).toBe(false)
    })

    it('returns false for a whitespace-only string', () => {
      expect(isDateString('   ')).toBe(false)
    })

    it('returns false for a plain integer string', () => {
      expect(isDateString('12345')).toBe(false)
    })

    it('returns false for a four-digit year alone', () => {
      expect(isDateString('2024')).toBe(false)
    })

    it('returns false for a time string "14:30"', () => {
      expect(isDateString('14:30')).toBe(false)
    })

    it('returns false for a time string with seconds "14:30:00"', () => {
      expect(isDateString('14:30:00')).toBe(false)
    })

    it('returns false for a word without digits', () => {
      expect(isDateString('hello')).toBe(false)
    })

    it('returns false for a string shorter than 6 characters', () => {
      expect(isDateString('1/1/2')).toBe(false)
    })

    it('returns false for a version string', () => {
      expect(isDateString('version 2.0.1')).toBe(false)
    })

    it('returns false for a non-string value passed as any', () => {
      // TypeScript guard: typeof str !== 'string'
      expect(isDateString(null as unknown as string)).toBe(false)
    })

    it('returns false for a two-digit year-only token', () => {
      expect(isDateString('24')).toBe(false)
    })
  })
})
