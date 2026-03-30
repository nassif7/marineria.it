import React from 'react'
import { act, create } from 'react-test-renderer'

// ---------------------------------------------------------------------------
// Module mocks
// jest.mock() factories are hoisted before variable declarations, so all spy
// references live on a shared plain object that is accessible post-hoisting.
// ---------------------------------------------------------------------------

const toastMocks = {
  show: jest.fn(),
  close: jest.fn(),
  isActive: jest.fn(() => false),
}

jest.mock('@/lib/components/ui', () => ({
  useToast: () => ({
    show: (...args: unknown[]) => toastMocks.show(...args),
    close: (...args: unknown[]) => toastMocks.close(...args),
    isActive: (...args: unknown[]) => toastMocks.isActive(...args),
  }),
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

jest.mock('lucide-react-native', () => ({
  X: 'X',
}))

// ---------------------------------------------------------------------------
// Subject under test
// ---------------------------------------------------------------------------

import useCustomToast from '../useCustomToast'

// ---------------------------------------------------------------------------
// Helper: mount the hook inside a minimal function component
// ---------------------------------------------------------------------------

type HookResult = ReturnType<typeof useCustomToast>
type HookRef = { current: HookResult | null }

const TestComponent = ({ hookRef }: { hookRef: HookRef }) => {
  hookRef.current = useCustomToast()
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
  toastMocks.show.mockClear()
  toastMocks.close.mockClear()
  toastMocks.isActive.mockClear()
  toastMocks.isActive.mockReturnValue(false)
})

describe('useCustomToast', () => {
  it('returns a showToast function', () => {
    const hook = renderHook()
    expect(hook.current).toHaveProperty('showToast')
    expect(typeof hook.current!.showToast).toBe('function')
  })

  it('calls toast.show with the correct shape when no active toast exists', () => {
    const hook = renderHook()

    act(() => {
      hook.current!.showToast({
        emphasize: 'success',
        title: 'Great job',
        description: 'Everything went fine',
      })
    })

    expect(toastMocks.show).toHaveBeenCalledTimes(1)

    const callArg = toastMocks.show.mock.calls[0][0] as {
      placement: string
      duration: number
      containerStyle: Record<string, unknown>
      render: (args: { id: string }) => React.ReactNode
    }

    expect(callArg.placement).toBe('top')
    expect(callArg.duration).toBe(5000) // default
    expect(callArg.containerStyle).toMatchObject({ marginTop: 40 })
  })

  it('respects a custom duration', () => {
    const hook = renderHook()

    act(() => {
      hook.current!.showToast({ emphasize: 'error', title: 'Oops', duration: 3000 })
    })

    expect(toastMocks.show).toHaveBeenCalledTimes(1)
    expect(toastMocks.show.mock.calls[0][0].duration).toBe(3000)
  })

  it('does NOT call toast.show when an active toast already exists', () => {
    toastMocks.isActive.mockReturnValue(true)

    const hook = renderHook()

    act(() => {
      hook.current!.showToast({ emphasize: 'error', title: 'Duplicate' })
    })

    expect(toastMocks.show).not.toHaveBeenCalled()
  })

  it('checks toast deduplication via isActive before showing', () => {
    const hook = renderHook()

    act(() => {
      hook.current!.showToast({ emphasize: 'success', title: 'First' })
    })

    // isActive must have been consulted
    expect(toastMocks.isActive).toHaveBeenCalled()
  })

  it('renders a close button whose onPress calls toast.close with the toast id', () => {
    const hook = renderHook()

    act(() => {
      hook.current!.showToast({ emphasize: 'success', title: 'Hi' })
    })

    const renderProp = toastMocks.show.mock.calls[0][0].render as (args: { id: string }) => React.ReactNode

    const element = renderProp({ id: 'close-test-id' }) as React.ReactElement

    // Traverse the rendered tree to find the Pressable element
    const findPressable = (node: React.ReactNode): React.ReactElement | null => {
      if (!React.isValidElement(node)) return null
      if ((node as React.ReactElement).type === 'Pressable') return node as React.ReactElement
      const children = (node.props as { children?: React.ReactNode }).children
      if (!children) return null
      for (const child of React.Children.toArray(children)) {
        const found = findPressable(child)
        if (found) return found
      }
      return null
    }

    const pressable = findPressable(element)
    expect(pressable).not.toBeNull()

    act(() => {
      ;(pressable!.props as { onPress: () => void }).onPress()
    })

    expect(toastMocks.close).toHaveBeenCalledWith('close-test-id')
  })

  it('omits ToastDescription when no description is provided', () => {
    const hook = renderHook()

    act(() => {
      hook.current!.showToast({ emphasize: 'success', title: 'No description' })
    })

    const renderProp = toastMocks.show.mock.calls[0][0].render as (args: { id: string }) => React.ReactNode
    const element = renderProp({ id: 'no-desc-id' }) as React.ReactElement

    const findByType = (node: React.ReactNode, type: string): React.ReactElement | null => {
      if (!React.isValidElement(node)) return null
      if ((node as React.ReactElement).type === type) return node as React.ReactElement
      const children = (node.props as { children?: React.ReactNode }).children
      if (!children) return null
      for (const child of React.Children.toArray(children)) {
        const found = findByType(child, type)
        if (found) return found
      }
      return null
    }

    const descEl = findByType(element, 'ToastDescription')
    expect(descEl).toBeNull()
  })

  it('renders ToastDescription when a description is provided', () => {
    const hook = renderHook()

    act(() => {
      hook.current!.showToast({
        emphasize: 'error',
        title: 'With description',
        description: 'Some detail',
      })
    })

    const renderProp = toastMocks.show.mock.calls[0][0].render as (args: { id: string }) => React.ReactNode
    const element = renderProp({ id: 'with-desc-id' }) as React.ReactElement

    const findByType = (node: React.ReactNode, type: string): React.ReactElement | null => {
      if (!React.isValidElement(node)) return null
      if ((node as React.ReactElement).type === type) return node as React.ReactElement
      const children = (node.props as { children?: React.ReactNode }).children
      if (!children) return null
      for (const child of React.Children.toArray(children)) {
        const found = findByType(child, type)
        if (found) return found
      }
      return null
    }

    const descEl = findByType(element, 'ToastDescription')
    expect(descEl).not.toBeNull()
    expect((descEl!.props as { children: string }).children).toBe('Some detail')
  })
})
