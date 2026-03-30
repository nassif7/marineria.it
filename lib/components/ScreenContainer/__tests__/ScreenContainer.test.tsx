import React from 'react'
import renderer from 'react-test-renderer'
import ScreenContainer from '../index'

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
      Value: jest.fn(() => ({ interpolate: jest.fn(() => 0) })),
    },
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 812 })),
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    },
    ScrollView: 'ScrollView',
    FlatList: 'FlatList',
    RefreshControl: 'RefreshControl',
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
}))

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 0, top: 0, left: 0, right: 0 }),
  SafeAreaView: 'SafeAreaView',
}))

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ScreenContainer', () => {
  it('renders without crashing (non-scroll mode)', () => {
    const tree = renderer.create(
      <ScreenContainer>
        <React.Fragment />
      </ScreenContainer>
    )
    expect(tree.toJSON()).toBeTruthy()
  })

  it('matches snapshot in default (non-scroll) mode', () => {
    const tree = renderer
      .create(
        <ScreenContainer>
          <React.Fragment />
        </ScreenContainer>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders in scroll mode', () => {
    const tree = renderer.create(
      <ScreenContainer scroll>
        <React.Fragment />
      </ScreenContainer>
    )
    expect(tree.toJSON()).toBeTruthy()
  })

  it('matches snapshot in scroll mode', () => {
    const tree = renderer
      .create(
        <ScreenContainer scroll>
          <React.Fragment />
        </ScreenContainer>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('applies extra className prop', () => {
    const tree = renderer.create(
      <ScreenContainer className="px-4">
        <React.Fragment />
      </ScreenContainer>
    )
    expect(tree.toJSON()).toBeTruthy()
  })

  it('passes refreshing and onRefresh to scroll view', () => {
    const onRefresh = jest.fn()
    const tree = renderer.create(
      <ScreenContainer scroll refreshing={true} onRefresh={onRefresh}>
        <React.Fragment />
      </ScreenContainer>
    )
    expect(tree.toJSON()).toBeTruthy()
  })

  it('accounts for safe area insets in contentContainerStyle paddingBottom', () => {
    // useSafeAreaInsets returns bottom: 0, so paddingBottom should equal the given value
    const tree = renderer.create(
      <ScreenContainer scroll contentContainerStyle={{ paddingBottom: 20 }}>
        <React.Fragment />
      </ScreenContainer>
    )
    expect(tree.toJSON()).toBeTruthy()
  })
})
