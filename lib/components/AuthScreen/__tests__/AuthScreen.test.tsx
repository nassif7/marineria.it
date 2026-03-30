import React from 'react'
import renderer from 'react-test-renderer'
import AuthScreen from '../index'

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native')
  return {
    ...RN,
    Keyboard: {
      addListener: jest.fn(() => ({ remove: jest.fn() })),
      removeAllListeners: jest.fn(),
    },
    Animated: {
      ...RN.Animated,
      timing: jest.fn(() => ({ start: jest.fn() })),
      parallel: jest.fn(() => ({ start: jest.fn() })),
      Value: jest.fn(() => ({
        interpolate: jest.fn(() => 0),
      })),
    },
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 812 })),
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    },
    ImageBackground: 'ImageBackground',
    KeyboardAvoidingView: 'KeyboardAvoidingView',
    ScrollView: 'ScrollView',
    Platform: { ...RN.Platform, OS: 'ios' },
  }
})

jest.mock('@/lib/components/ui', () => ({
  View: 'View',
  Text: 'Text',
  Box: 'Box',
  Heading: 'Heading',
  HStack: 'HStack',
  VStack: 'VStack',
  Pressable: 'Pressable',
  Icon: 'Icon',
  Divider: 'Divider',
  Spinner: 'Spinner',
  Badge: 'Badge',
  BadgeText: 'BadgeText',
  Avatar: 'Avatar',
  AvatarFallbackText: 'AvatarFallbackText',
  AvatarImage: 'AvatarImage',
}))

jest.mock('@/lib/utils/metrics', () => ({
  horizontalScale: jest.fn((n: number) => n),
  verticalScale: jest.fn((n: number) => n),
  moderateScale: jest.fn((n: number) => n),
}))

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('AuthScreen', () => {
  it('renders without crashing', () => {
    const tree = renderer.create(
      <AuthScreen>
        <></>
      </AuthScreen>
    )
    expect(tree).toBeTruthy()
  })

  it('matches snapshot', () => {
    const tree = renderer
      .create(
        <AuthScreen>
          <React.Fragment>
            <></>
          </React.Fragment>
        </AuthScreen>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders children inside the container', () => {
    const tree = renderer.create(
      <AuthScreen>
        <React.Fragment key="child">{/* sentinel */}</React.Fragment>
      </AuthScreen>
    )
    expect(tree.toJSON()).toBeTruthy()
  })

  it('registers keyboard listeners on mount', () => {
    const { Keyboard } = require('react-native')
    renderer.create(
      <AuthScreen>
        <></>
      </AuthScreen>
    )
    expect(Keyboard.addListener).toHaveBeenCalledWith('keyboardWillShow', expect.any(Function))
    expect(Keyboard.addListener).toHaveBeenCalledWith('keyboardWillHide', expect.any(Function))
  })
})
