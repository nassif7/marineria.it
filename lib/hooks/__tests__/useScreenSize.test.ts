// ---------------------------------------------------------------------------
// Dimensions mock — must be set up before importing the hook because
// useScreenSize calls Dimensions.get('window') at module evaluation time.
// ---------------------------------------------------------------------------

// Default to a medium-width device (iPhone 14, 390pt logical width)
const mockDimensions = { width: 390, height: 844 }

jest.mock('react-native', () => {
  const rn = jest.requireActual('react-native')
  return {
    ...rn,
    Dimensions: {
      get: jest.fn((_dim: string) => mockDimensions),
    },
  }
})

// ---------------------------------------------------------------------------
// Subject under test
// ---------------------------------------------------------------------------

// Because `useScreenSize` reads `Dimensions.get` at the module's top-level
// (outside of the hook body), each test scenario that needs a different width
// must use `jest.isolateModules` / `jest.resetModules` to force a fresh import.

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Re-import the hook after updating `mockDimensions.width` so the module-level
 * `Dimensions.get` call picks up the new value.
 */
const importHookWithWidth = async (width: number) => {
  mockDimensions.width = width
  jest.resetModules()
  const mod = await import('../useScreenSize')
  return mod.useScreenSize
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useScreenSize', () => {
  afterEach(() => {
    jest.resetModules()
  })

  // ----- width property -----------------------------------------------------

  it('exposes the current screen width', async () => {
    const useScreenSize = await importHookWithWidth(375)
    const result = useScreenSize()
    expect(result.width).toBe(375)
  })

  // ----- isSmall (< 390) ----------------------------------------------------

  it('isSmall = true for width 375 (iPhone SE / mini)', async () => {
    const useScreenSize = await importHookWithWidth(375)
    const { isSmall, isMedium, isLarge } = useScreenSize()
    expect(isSmall).toBe(true)
    expect(isMedium).toBe(false)
    expect(isLarge).toBe(false)
  })

  it('isSmall = true for width 320', async () => {
    const useScreenSize = await importHookWithWidth(320)
    expect(useScreenSize().isSmall).toBe(true)
  })

  it('isSmall = false at the boundary width 390', async () => {
    const useScreenSize = await importHookWithWidth(390)
    expect(useScreenSize().isSmall).toBe(false)
  })

  // ----- isMedium (>= 390 && < 428) -----------------------------------------

  it('isMedium = true for width 390 (iPhone 14)', async () => {
    const useScreenSize = await importHookWithWidth(390)
    const { isSmall, isMedium, isLarge } = useScreenSize()
    expect(isSmall).toBe(false)
    expect(isMedium).toBe(true)
    expect(isLarge).toBe(false)
  })

  it('isMedium = true for width 414', async () => {
    const useScreenSize = await importHookWithWidth(414)
    expect(useScreenSize().isMedium).toBe(true)
  })

  it('isMedium = false at the upper boundary width 428', async () => {
    const useScreenSize = await importHookWithWidth(428)
    expect(useScreenSize().isMedium).toBe(false)
  })

  // ----- isLarge (>= 428) ---------------------------------------------------

  it('isLarge = true for width 428 (iPhone 14 Pro Max)', async () => {
    const useScreenSize = await importHookWithWidth(428)
    const { isSmall, isMedium, isLarge } = useScreenSize()
    expect(isSmall).toBe(false)
    expect(isMedium).toBe(false)
    expect(isLarge).toBe(true)
  })

  it('isLarge = true for width 430', async () => {
    const useScreenSize = await importHookWithWidth(430)
    expect(useScreenSize().isLarge).toBe(true)
  })

  it('isLarge = false for width 427', async () => {
    const useScreenSize = await importHookWithWidth(427)
    expect(useScreenSize().isLarge).toBe(false)
  })

  // ----- mutual exclusivity -------------------------------------------------

  it('exactly one size flag is true for any given width', async () => {
    const widths = [320, 375, 389, 390, 400, 427, 428, 430, 500]

    for (const w of widths) {
      const useScreenSize = await importHookWithWidth(w)
      const { isSmall, isMedium, isLarge } = useScreenSize()
      const trueCount = [isSmall, isMedium, isLarge].filter(Boolean).length
      expect(trueCount).toBe(1)
      jest.resetModules()
    }
  })
})
