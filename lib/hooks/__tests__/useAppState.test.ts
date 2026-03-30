import { act, create } from 'react-test-renderer'
import React from 'react'

// ---------------------------------------------------------------------------
// AppState mock
//
// jest.mock() factories are hoisted before variable declarations by Babel.
// The exception: babel-jest allows variables whose names start with "mock" to
// be referenced inside jest.mock() factory functions. We rely on that rule
// for mockAppStateCallbacks / mockAppStateRemove / mockAppStateListener.
// ---------------------------------------------------------------------------

// Container for the change-listener callback captured during addEventListener
const mockAppStateCallbacks: { change: ((nextState: string) => void) | null } = { change: null }
const mockAppStateRemove = jest.fn()
const mockAppStateCurrentState = { value: 'active' as string }

const mockAppStateListener = jest.fn((_event: string, cb: (nextState: string) => void) => {
  mockAppStateCallbacks.change = cb
  return { remove: mockAppStateRemove }
})

jest.mock('react-native', () => {
  const rn = jest.requireActual('react-native')
  return {
    ...rn,
    AppState: {
      get currentState() {
        return mockAppStateCurrentState.value
      },
      addEventListener: mockAppStateListener,
    },
  }
})

// ---------------------------------------------------------------------------
// Subject under test
// ---------------------------------------------------------------------------

import useAppState from '../useAppState'

// ---------------------------------------------------------------------------
// Helper: mount the hook
// ---------------------------------------------------------------------------

type HookRef = { current: string | null }

const TestComponent = ({ hookRef, handlers }: { hookRef: HookRef; handlers?: Parameters<typeof useAppState>[0] }) => {
  hookRef.current = useAppState(handlers)
  return null
}

const renderHook = (handlers?: Parameters<typeof useAppState>[0]): HookRef => {
  const ref: HookRef = { current: null }
  act(() => {
    create(React.createElement(TestComponent, { hookRef: ref, handlers }))
  })
  return ref
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  mockAppStateRemove.mockClear()
  mockAppStateListener.mockClear()
  mockAppStateCallbacks.change = null
  mockAppStateCurrentState.value = 'active'
})

describe('useAppState — return value', () => {
  it('returns the current AppState value on mount', () => {
    const ref = renderHook()
    expect(ref.current).toBe('active')
  })
})

describe('useAppState — event listener lifecycle', () => {
  it('registers an AppState change listener on mount', () => {
    renderHook()
    expect(mockAppStateListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('removes the listener on unmount', () => {
    let unmount!: () => void

    act(() => {
      const ref: HookRef = { current: null }
      const renderer = create(React.createElement(TestComponent, { hookRef: ref }))
      unmount = () => renderer.unmount()
    })

    act(() => {
      unmount()
    })

    expect(mockAppStateRemove).toHaveBeenCalledTimes(1)
  })
})

describe('useAppState — state transitions', () => {
  it('updates returned state when AppState changes to background', () => {
    const ref = renderHook()
    expect(ref.current).toBe('active')

    act(() => {
      mockAppStateCallbacks.change!('background')
    })

    expect(ref.current).toBe('background')
  })

  it('reflects a transition back to active', () => {
    const ref = renderHook()

    act(() => {
      mockAppStateCallbacks.change!('background')
    })

    act(() => {
      mockAppStateCallbacks.change!('active')
    })

    expect(ref.current).toBe('active')
  })
})

describe('useAppState — optional handlers', () => {
  it('calls onBackGround when app moves from active to background', () => {
    const onBackGround = jest.fn()
    renderHook({ onBackGround })

    // currentState starts as 'active'; next is 'background'
    act(() => {
      mockAppStateCallbacks.change!('background')
    })

    expect(onBackGround).toHaveBeenCalledTimes(1)
  })

  it('calls onForeground when app moves from background/inactive to active', () => {
    const onForeground = jest.fn()
    mockAppStateCurrentState.value = 'background'
    renderHook({ onForeground })

    act(() => {
      mockAppStateCallbacks.change!('active')
    })

    expect(onForeground).toHaveBeenCalledTimes(1)
  })

  it('calls onChange on every state change', () => {
    const onChange = jest.fn()
    renderHook({ onChange })

    act(() => {
      mockAppStateCallbacks.change!('background')
    })
    act(() => {
      mockAppStateCallbacks.change!('active')
    })

    expect(onChange).toHaveBeenCalledTimes(2)
  })

  it('does NOT call onBackGround when transitioning background → active', () => {
    const onBackGround = jest.fn()
    mockAppStateCurrentState.value = 'background'
    renderHook({ onBackGround })

    act(() => {
      mockAppStateCallbacks.change!('active')
    })

    expect(onBackGround).not.toHaveBeenCalled()
  })

  it('does NOT call onForeground when transitioning active → background', () => {
    const onForeground = jest.fn()
    renderHook({ onForeground })

    act(() => {
      mockAppStateCallbacks.change!('background')
    })

    expect(onForeground).not.toHaveBeenCalled()
  })

  it('works with no handlers provided (no throw)', () => {
    expect(() => {
      const ref = renderHook()
      act(() => {
        mockAppStateCallbacks.change!('background')
      })
      expect(ref.current).toBe('background')
    }).not.toThrow()
  })
})
