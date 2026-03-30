import React from 'react'
import renderer, { act } from 'react-test-renderer'
import MarineriaSplash from '../index'

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native')

  // A minimal Animated.Value stub that supports interpolate and the loop/sequence helpers
  class AnimatedValueStub {
    _value: number
    constructor(v: number) {
      this._value = v
    }
    interpolate() {
      return this._value
    }
    setValue(v: number) {
      this._value = v
    }
  }

  const timingMock = jest.fn(() => ({ start: jest.fn() }))
  const loopMock = jest.fn((anim: any) => ({ start: jest.fn(), stop: jest.fn(), ...anim }))
  const sequenceMock = jest.fn(() => ({ start: jest.fn() }))

  return {
    ...RN,
    Keyboard: {
      addListener: jest.fn(() => ({ remove: jest.fn() })),
      removeAllListeners: jest.fn(),
    },
    Animated: {
      ...RN.Animated,
      Value: AnimatedValueStub,
      timing: timingMock,
      loop: loopMock,
      sequence: sequenceMock,
      parallel: jest.fn(() => ({ start: jest.fn() })),
      View: 'Animated.View',
    },
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 812 })),
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    },
    StyleSheet: {
      ...RN.StyleSheet,
      absoluteFillObject: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      },
    },
    Image: 'Image',
    View: 'View',
    Text: 'Text',
  }
})

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MarineriaSplash', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.clearAllMocks()
  })

  it('renders without crashing when loading', () => {
    let tree: renderer.ReactTestRenderer
    act(() => {
      tree = renderer.create(<MarineriaSplash isLoading={true} />)
    })
    expect(tree!.toJSON()).toBeTruthy()
  })

  it('matches snapshot when loading', () => {
    let tree: renderer.ReactTestRenderer
    act(() => {
      tree = renderer.create(<MarineriaSplash isLoading={true} />)
    })
    expect(tree!.toJSON()).toMatchSnapshot()
  })

  it('renders without crashing when not loading', () => {
    let tree: renderer.ReactTestRenderer
    act(() => {
      tree = renderer.create(<MarineriaSplash isLoading={false} />)
    })
    expect(tree!.toJSON()).toBeTruthy()
  })

  it('matches snapshot when not loading', () => {
    let tree: renderer.ReactTestRenderer
    act(() => {
      tree = renderer.create(<MarineriaSplash isLoading={false} />)
    })
    expect(tree!.toJSON()).toMatchSnapshot()
  })

  it('starts fade-out animation when isLoading transitions to false', () => {
    const { Animated } = require('react-native')

    let tree: renderer.ReactTestRenderer
    act(() => {
      tree = renderer.create(<MarineriaSplash isLoading={true} />)
    })

    act(() => {
      tree.update(<MarineriaSplash isLoading={false} />)
    })

    // Animated.timing should have been called (logo float, content fade, fade-out)
    expect(Animated.timing).toHaveBeenCalled()
  })

  it('starts loop animations on mount', () => {
    const { Animated } = require('react-native')

    act(() => {
      renderer.create(<MarineriaSplash isLoading={true} />)
    })

    expect(Animated.loop).toHaveBeenCalled()
  })
})
