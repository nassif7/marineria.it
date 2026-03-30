import React from 'react'
import { act, create } from 'react-test-renderer'

// ---------------------------------------------------------------------------
// Module mocks
// jest.mock() factories are hoisted above variable declarations; spy references
// live on a shared object so they remain accessible after hoisting.
// ---------------------------------------------------------------------------

const customToastMocks = {
  showToast: jest.fn(),
}

// Mock the underlying useCustomToast so we can assert on the arguments passed.
jest.mock('../useCustomToast', () => ({
  __esModule: true,
  default: () => ({
    showToast: (...args: unknown[]) => customToastMocks.showToast(...args),
  }),
}))

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}))

// These UI mocks prevent resolution errors if Jest walks the real useCustomToast
// source during module graph resolution under certain configurations.
jest.mock('@/lib/components/ui', () => ({
  useToast: () => ({ show: jest.fn(), close: jest.fn(), isActive: jest.fn(() => false) }),
  Toast: 'Toast',
  ToastTitle: 'ToastTitle',
  ToastDescription: 'ToastDescription',
  HStack: 'HStack',
  VStack: 'VStack',
  Icon: 'Icon',
}))

jest.mock('@/lib/components/ui/pressable', () => ({
  Pressable: 'Pressable',
}))

jest.mock('lucide-react-native', () => ({ X: 'X' }))

// ---------------------------------------------------------------------------
// Subject under test
// ---------------------------------------------------------------------------

import useAuthErrorToast from '../useAuthErrorToast'

// ---------------------------------------------------------------------------
// Helper: mount the hook
// ---------------------------------------------------------------------------

type HookResult = ReturnType<typeof useAuthErrorToast>
type HookRef = { current: HookResult | null }

const TestComponent = ({ hookRef }: { hookRef: HookRef }) => {
  hookRef.current = useAuthErrorToast()
  return null
}

const renderHook = (): HookRef => {
  const ref: HookRef = { current: null }
  act(() => {
    create(<TestComponent hookRef={ref} />)
  })
  return ref
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  customToastMocks.showToast.mockClear()
})

describe('useAuthErrorToast', () => {
  it('returns a callable function', () => {
    const hook = renderHook()
    expect(typeof hook.current).toBe('function')
  })

  it('calls showToast with the correct arguments when invoked', () => {
    const hook = renderHook()

    act(() => {
      hook.current!()
    })

    expect(customToastMocks.showToast).toHaveBeenCalledTimes(1)
    expect(customToastMocks.showToast).toHaveBeenCalledWith({
      emphasize: 'error',
      title: 'login-error',
      description: 'invalid-credentials',
      duration: 3000,
    })
  })

  it('passes the translation key for title (identity t() in tests)', () => {
    const hook = renderHook()

    act(() => {
      hook.current!()
    })

    const callArg = customToastMocks.showToast.mock.calls[0][0] as {
      title: string
      description: string
    }
    expect(callArg.title).toBe('login-error')
  })

  it('passes the translation key for description', () => {
    const hook = renderHook()

    act(() => {
      hook.current!()
    })

    const callArg = customToastMocks.showToast.mock.calls[0][0] as {
      description: string
    }
    expect(callArg.description).toBe('invalid-credentials')
  })

  it('uses a 3-second duration', () => {
    const hook = renderHook()

    act(() => {
      hook.current!()
    })

    const callArg = customToastMocks.showToast.mock.calls[0][0] as { duration: number }
    expect(callArg.duration).toBe(3000)
  })

  it('uses emphasize "error"', () => {
    const hook = renderHook()

    act(() => {
      hook.current!()
    })

    const callArg = customToastMocks.showToast.mock.calls[0][0] as { emphasize: string }
    expect(callArg.emphasize).toBe('error')
  })

  it('can be called multiple times and invokes showToast each time', () => {
    const hook = renderHook()

    act(() => {
      hook.current!()
      hook.current!()
    })

    expect(customToastMocks.showToast).toHaveBeenCalledTimes(2)
  })
})
