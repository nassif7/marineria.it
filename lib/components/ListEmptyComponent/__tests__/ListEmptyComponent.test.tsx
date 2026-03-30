import React from 'react'
import renderer from 'react-test-renderer'
import EmptyList from '../index'

jest.mock('@/lib/components/ui', () => ({
  Badge: 'Badge',
  BadgeText: 'BadgeText',
  Text: 'Text',
  HStack: 'HStack',
  VStack: 'VStack',
  Icon: 'Icon',
  Pressable: 'Pressable',
  Heading: 'Heading',
  Divider: 'Divider',
  Button: 'Button',
  ButtonText: 'ButtonText',
}))

jest.mock('@/lib/components/ui/center', () => ({ Center: 'Center' }))
jest.mock('@/lib/components/ui/icon', () => ({ Icon: 'Icon' }))
jest.mock('@/lib/components/ui/text', () => ({ Text: 'Text' }))
jest.mock('@/lib/components/ui/vstack', () => ({ VStack: 'VStack' }))

jest.mock('lucide-react-native', () => ({
  AlertCircle: 'AlertCircle',
  Inbox: 'Inbox',
  ChevronDown: 'ChevronDown',
  ChevronUp: 'ChevronUp',
  ChevronRight: 'ChevronRight',
  InboxIcon: 'InboxIcon',
}))

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}))

jest.mock('expo-router', () => ({
  Link: 'Link',
  useRouter: () => ({ push: jest.fn() }),
}))

describe('EmptyList', () => {
  it('renders a snapshot with default props', () => {
    const tree = renderer.create(<EmptyList />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders a snapshot with a custom message', () => {
    const tree = renderer.create(<EmptyList message="No vessels available" />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders the default message when no message prop is given', () => {
    const tree = renderer.create(<EmptyList />).toJSON()
    expect(JSON.stringify(tree)).toContain('No results found')
  })

  it('renders a custom message when provided', () => {
    const tree = renderer.create(<EmptyList message="Nothing here yet" />).toJSON()
    expect(JSON.stringify(tree)).toContain('Nothing here yet')
  })
})
