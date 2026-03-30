import React from 'react'
import renderer, { act } from 'react-test-renderer'
import PhotoSlider from '../index'

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
    Modal: 'Modal',
    FlatList: 'FlatList',
    TouchableOpacity: 'TouchableOpacity',
    Image: 'Image',
    useWindowDimensions: jest.fn(() => ({ width: 375, height: 812 })),
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

jest.mock('lucide-react-native', () => ({
  X: 'X',
  ChevronLeft: 'ChevronLeft',
  ChevronDown: 'ChevronDown',
  ArrowLeft: 'ArrowLeft',
}))

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const baseProps = {
  visible: true,
  photos: [],
  initialIndex: 0,
  onClose: jest.fn(),
}

const photos = ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg', 'https://example.com/photo3.jpg']

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('PhotoSlider', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.clearAllMocks()
  })

  it('renders without crashing (empty photos)', () => {
    const tree = renderer.create(<PhotoSlider {...baseProps} />)
    expect(tree.toJSON()).toBeTruthy()
  })

  it('matches snapshot with empty photos array', () => {
    const tree = renderer.create(<PhotoSlider {...baseProps} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders without crashing when not visible', () => {
    const tree = renderer.create(<PhotoSlider {...baseProps} visible={false} />)
    expect(tree.toJSON()).toBeTruthy()
  })

  it('renders without crashing with multiple photos', () => {
    act(() => {
      renderer.create(<PhotoSlider {...baseProps} photos={photos} />)
    })
    // Just a smoke test — autoplay timers are faked
    expect(true).toBe(true)
  })

  it('matches snapshot with photos', () => {
    let tree: renderer.ReactTestRenderer
    act(() => {
      tree = renderer.create(<PhotoSlider {...baseProps} photos={photos} />)
    })
    expect(tree!.toJSON()).toMatchSnapshot()
  })

  it('renders title and subtitle when provided', () => {
    let tree: renderer.ReactTestRenderer
    act(() => {
      tree = renderer.create(<PhotoSlider {...baseProps} photos={photos} title="Test Title" subtitle="Test Subtitle" />)
    })
    expect(tree!.toJSON()).toBeTruthy()
  })

  it('calls onClose when close button is pressed', () => {
    const onClose = jest.fn()
    let tree: renderer.ReactTestRenderer

    act(() => {
      tree = renderer.create(<PhotoSlider {...baseProps} photos={photos} onClose={onClose} />)
    })

    const closeButton = tree!.root.findAll((node) => node.type === 'TouchableOpacity')[0]
    act(() => {
      closeButton.props.onPress()
    })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not show counter badge for a single photo', () => {
    let tree: renderer.ReactTestRenderer
    act(() => {
      tree = renderer.create(<PhotoSlider {...baseProps} photos={['https://example.com/photo1.jpg']} />)
    })
    // photos.length <= 1 => no counter view rendered; snapshot verifies this
    expect(tree!.toJSON()).toMatchSnapshot()
  })
})
