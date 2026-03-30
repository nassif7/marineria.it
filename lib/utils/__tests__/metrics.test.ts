// Must be hoisted above the module import so that the top-level Dimensions.get()
// call inside metrics.ts receives mocked values at evaluation time.
jest.mock('react-native', () => ({
  Dimensions: {
    get: () => ({ width: 375, height: 812 }),
  },
}))

import { horizontalScale, verticalScale, moderateScale } from '../metrics'

// ---------------------------------------------------------------------------
// Constants mirroring the guideline base values in metrics.ts
// ---------------------------------------------------------------------------
const BASE_WIDTH = 375
const BASE_HEIGHT = 812
const MOCK_WIDTH = 375
const MOCK_HEIGHT = 812

// With mocked dimensions equal to the base values all scale factors are 1,
// which keeps the arithmetic clean and easy to reason about.

describe('horizontalScale', () => {
  it('returns the same size when device width equals the guideline base width', () => {
    // (375 / 375) * size = size
    expect(horizontalScale(10)).toBe(10)
    expect(horizontalScale(100)).toBe(100)
  })

  it('returns 0 for a size of 0', () => {
    expect(horizontalScale(0)).toBe(0)
  })

  it('scales a positive size correctly (formula: width/baseWidth * size)', () => {
    const size = 24
    const expected = (MOCK_WIDTH / BASE_WIDTH) * size
    expect(horizontalScale(size)).toBe(expected)
  })

  it('scales a fractional size correctly', () => {
    const size = 0.5
    const expected = (MOCK_WIDTH / BASE_WIDTH) * size
    expect(horizontalScale(size)).toBeCloseTo(expected, 5)
  })

  it('handles large sizes without overflow', () => {
    expect(horizontalScale(1000)).toBe((MOCK_WIDTH / BASE_WIDTH) * 1000)
  })
})

describe('verticalScale', () => {
  it('returns the same size when device height equals the guideline base height', () => {
    // (812 / 812) * size = size
    expect(verticalScale(10)).toBe(10)
    expect(verticalScale(100)).toBe(100)
  })

  it('returns 0 for a size of 0', () => {
    expect(verticalScale(0)).toBe(0)
  })

  it('scales a positive size correctly (formula: height/baseHeight * size)', () => {
    const size = 20
    const expected = (MOCK_HEIGHT / BASE_HEIGHT) * size
    expect(verticalScale(size)).toBe(expected)
  })

  it('handles a fractional size correctly', () => {
    const size = 1.5
    const expected = (MOCK_HEIGHT / BASE_HEIGHT) * size
    expect(verticalScale(size)).toBeCloseTo(expected, 5)
  })
})

describe('moderateScale', () => {
  // Formula: size + (horizontalScale(size) - size) * factor
  // With mock dimensions == base, horizontalScale(size) == size, so
  //   size + (size - size) * factor = size  (factor has no effect)

  it('returns size unchanged when device width equals base width (scale ratio = 1)', () => {
    expect(moderateScale(10)).toBe(10)
    expect(moderateScale(24)).toBe(24)
  })

  it('returns 0 for a size of 0 regardless of factor', () => {
    expect(moderateScale(0)).toBe(0)
    expect(moderateScale(0, 0.25)).toBe(0)
    expect(moderateScale(0, 1)).toBe(0)
  })

  it('uses the default factor of 0.5 when none is provided', () => {
    const size = 16
    const hScale = (MOCK_WIDTH / BASE_WIDTH) * size
    const expected = size + (hScale - size) * 0.5
    expect(moderateScale(size)).toBeCloseTo(expected, 5)
  })

  it('respects a custom factor of 0', () => {
    // factor=0 means no moderation — result equals original size
    const size = 20
    const hScale = (MOCK_WIDTH / BASE_WIDTH) * size
    const expected = size + (hScale - size) * 0
    expect(moderateScale(size, 0)).toBeCloseTo(expected, 5)
  })

  it('respects a custom factor of 1', () => {
    // factor=1 means full horizontal scaling — result equals horizontalScale(size)
    const size = 20
    const hScale = (MOCK_WIDTH / BASE_WIDTH) * size
    const expected = size + (hScale - size) * 1
    expect(moderateScale(size, 1)).toBeCloseTo(expected, 5)
  })

  it('handles a fractional size with default factor', () => {
    const size = 2.5
    const hScale = (MOCK_WIDTH / BASE_WIDTH) * size
    const expected = size + (hScale - size) * 0.5
    expect(moderateScale(size)).toBeCloseTo(expected, 5)
  })
})
