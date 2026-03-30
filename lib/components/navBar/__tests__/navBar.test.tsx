import React from 'react'
import renderer, { act } from 'react-test-renderer'
import NavBar from '../index'

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
    View: 'View',
    Text: 'Text',
    TouchableOpacity: 'TouchableOpacity',
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

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
  usePathname: () => '/',
  useSegments: () => [],
}))

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}))

jest.mock('lucide-react-native', () => ({
  ChevronLeft: 'ChevronLeft',
  ChevronDown: 'ChevronDown',
  X: 'X',
  ArrowLeft: 'ArrowLeft',
}))

jest.mock('@expo/vector-icons/Feather', () => 'Feather')

// ─── Minimal NativeStackHeaderProps stub ──────────────────────────────────────

const baseProps = {
  // Required by NativeStackHeaderProps
  navigation: {} as any,
  route: { key: 'test', name: 'Test' } as any,
  options: {},
  back: undefined,
} as any

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('NavBar', () => {
  it('renders without crashing', () => {
    const tree = renderer.create(<NavBar {...baseProps} />)
    expect(tree.toJSON()).toBeTruthy()
  })

  it('matches snapshot without back button and without title', () => {
    const tree = renderer.create(<NavBar {...baseProps} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('matches snapshot with a title', () => {
    const props = { ...baseProps, options: { title: 'My Screen' } }
    const tree = renderer.create(<NavBar {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders a back button when back prop is defined', () => {
    const propsWithBack = {
      ...baseProps,
      back: { title: 'Back', href: '/prev' },
    }
    const tree = renderer.create(<NavBar {...propsWithBack} />).toJSON()
    // Snapshot captures the back-button branch
    expect(tree).toMatchSnapshot()
  })

  it('calls router.back() when back button is pressed', () => {
    const backFn = jest.fn()
    jest.spyOn(require('expo-router'), 'useRouter').mockReturnValue({ back: backFn, push: jest.fn() })

    const propsWithBack = {
      ...baseProps,
      back: { title: 'Back', href: '/prev' },
    }

    let tree: renderer.ReactTestRenderer
    act(() => {
      tree = renderer.create(<NavBar {...propsWithBack} />)
    })

    // Find the Pressable that triggers router.back
    const pressable = tree!.root.findAll((node) => node.type === 'Pressable')[0]
    act(() => {
      pressable.props.onPress()
    })

    expect(backFn).toHaveBeenCalled()
  })

  it('renders rightAction when provided', () => {
    const rightAction = <React.Fragment key="ra">settings</React.Fragment>
    const tree = renderer.create(<NavBar {...baseProps} rightAction={rightAction} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
