import React from 'react'
import renderer, { act } from 'react-test-renderer'
import TabBar from '../index'

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
}))

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 34, top: 0, left: 0, right: 0 }),
  SafeAreaView: 'SafeAreaView',
}))

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const HomeIcon = 'HomeIcon'
const SearchIcon = 'SearchIcon'

function makeTabBarProps(overrides: Partial<{ index: number }> = {}) {
  const index = overrides.index ?? 0

  const routes = [
    { key: 'home', name: 'Home', params: {} },
    { key: 'search', name: 'Search', params: {} },
  ] as any[]

  const descriptors: Record<string, any> = {
    home: {
      options: {
        title: 'Home',
        tabBarIcon: HomeIcon,
        tabBarAccessibilityLabel: 'Home tab',
      },
    },
    search: {
      options: {
        title: 'Search',
        tabBarIcon: SearchIcon,
        tabBarAccessibilityLabel: 'Search tab',
      },
    },
  }

  const navigation = {
    emit: jest.fn(() => ({ defaultPrevented: false })),
    navigate: jest.fn(),
  } as any

  return {
    state: { routes, index } as any,
    descriptors,
    navigation,
    insets: { bottom: 34, top: 0, left: 0, right: 0 },
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('TabBar', () => {
  it('renders without crashing', () => {
    const tree = renderer.create(<TabBar {...makeTabBarProps()} />)
    expect(tree.toJSON()).toBeTruthy()
  })

  it('matches snapshot with first tab focused', () => {
    const tree = renderer.create(<TabBar {...makeTabBarProps({ index: 0 })} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('matches snapshot with second tab focused', () => {
    const tree = renderer.create(<TabBar {...makeTabBarProps({ index: 1 })} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('calls navigation.emit with tabPress on tab press', () => {
    const props = makeTabBarProps({ index: 0 })
    let tree: renderer.ReactTestRenderer

    act(() => {
      tree = renderer.create(<TabBar {...props} />)
    })

    // Find all Pressable nodes; press the second tab (index 1, not focused)
    const pressables = tree!.root.findAll((node) => node.type === 'Pressable')
    act(() => {
      pressables[1].props.onPress()
    })

    expect(props.navigation.emit).toHaveBeenCalledWith(expect.objectContaining({ type: 'tabPress', target: 'search' }))
    expect(props.navigation.navigate).toHaveBeenCalledWith('Search', {})
  })

  it('does not navigate when the pressed tab is already focused', () => {
    const props = makeTabBarProps({ index: 0 })
    let tree: renderer.ReactTestRenderer

    act(() => {
      tree = renderer.create(<TabBar {...props} />)
    })

    const pressables = tree!.root.findAll((node) => node.type === 'Pressable')
    act(() => {
      pressables[0].props.onPress() // press the already-focused tab
    })

    // navigate should NOT have been called
    expect(props.navigation.navigate).not.toHaveBeenCalled()
  })

  it('emits tabLongPress on long press', () => {
    const props = makeTabBarProps({ index: 0 })
    let tree: renderer.ReactTestRenderer

    act(() => {
      tree = renderer.create(<TabBar {...props} />)
    })

    const pressables = tree!.root.findAll((node) => node.type === 'Pressable')
    act(() => {
      pressables[0].props.onLongPress()
    })

    expect(props.navigation.emit).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'tabLongPress', target: 'home' })
    )
  })
})
