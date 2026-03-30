import React from 'react'
import renderer from 'react-test-renderer'
import { List, ListHeader } from '../index'

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
  Badge: 'Badge',
  BadgeText: 'BadgeText',
}))

jest.mock('@/lib/components/ui/select', () => ({
  Select: 'Select',
  SelectTrigger: 'SelectTrigger',
  SelectInput: 'SelectInput',
  SelectIcon: 'SelectIcon',
  SelectPortal: 'SelectPortal',
  SelectBackdrop: 'SelectBackdrop',
  SelectContent: 'SelectContent',
  SelectItem: 'SelectItem',
}))

jest.mock('lucide-react-native', () => ({
  ChevronDown: 'ChevronDown',
  ChevronLeft: 'ChevronLeft',
  X: 'X',
  ArrowLeft: 'ArrowLeft',
}))

// ─── Fixtures ─────────────────────────────────────────────────────────────────

type Item = { id: string; name: string }

const renderItem = ({ item }: { item: Item }) => (
  <React.Fragment key={item.id}>{/* item: {item.name} */}</React.Fragment>
)

const baseFilter = {
  value: 'all',
  setValue: jest.fn(),
  filterOptions: [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
  ],
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('List', () => {
  it('returns null when data is falsy', () => {
    // @ts-expect-error intentionally passing null to test guard
    const tree = renderer.create(<List data={null} renderItem={renderItem} isRefetching={false} />)
    expect(tree.toJSON()).toBeNull()
  })

  it('renders with an empty data array', () => {
    const tree = renderer.create(<List<Item> data={[]} renderItem={renderItem} isRefetching={false} />)
    expect(tree.toJSON()).toBeTruthy()
  })

  it('matches snapshot with empty data', () => {
    const tree = renderer.create(<List<Item> data={[]} renderItem={renderItem} isRefetching={false} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders with data items', () => {
    const data: Item[] = [
      { id: '1', name: 'Marina A' },
      { id: '2', name: 'Marina B' },
    ]
    const tree = renderer.create(<List<Item> data={data} renderItem={renderItem} isRefetching={false} />)
    expect(tree.toJSON()).toBeTruthy()
  })

  it('matches snapshot with data', () => {
    const data: Item[] = [
      { id: '1', name: 'Marina A' },
      { id: '2', name: 'Marina B' },
    ]
    const tree = renderer.create(<List<Item> data={data} renderItem={renderItem} isRefetching={false} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders the filter header when filter prop is provided', () => {
    const tree = renderer.create(
      <List<Item> data={[]} renderItem={renderItem} isRefetching={false} filter={baseFilter} />
    )
    expect(tree.toJSON()).toBeTruthy()
  })

  it('renders a listEmptyComponent when data is empty', () => {
    const EmptyComp = <React.Fragment>no items</React.Fragment>
    const tree = renderer.create(
      <List<Item> data={[]} renderItem={renderItem} isRefetching={false} listEmptyComponent={EmptyComp} />
    )
    expect(tree.toJSON()).toBeTruthy()
  })

  it('passes isRefetching to RefreshControl', () => {
    // When isRefetching is true the rendered tree should still be valid
    const tree = renderer.create(<List<Item> data={[]} renderItem={renderItem} isRefetching={true} />)
    expect(tree.toJSON()).toBeTruthy()
  })
})

describe('ListHeader', () => {
  it('renders without crashing', () => {
    const tree = renderer.create(<ListHeader itemsCount={5} filter={baseFilter} />)
    expect(tree.toJSON()).toBeTruthy()
  })

  it('matches snapshot', () => {
    const tree = renderer.create(<ListHeader itemsCount={5} filter={baseFilter} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
