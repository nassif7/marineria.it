import React from 'react'
import renderer from 'react-test-renderer'
import ErrorMessage from '../index'

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

describe('ErrorMessage', () => {
  it('renders a snapshot with default props', () => {
    const tree = renderer.create(<ErrorMessage />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders a snapshot with custom title and description', () => {
    const tree = renderer.create(<ErrorMessage title="Not found" description="The resource does not exist" />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders the default title when no title prop is provided', () => {
    const tree = renderer.create(<ErrorMessage />).toJSON()
    expect(JSON.stringify(tree)).toContain('Error')
  })

  it('renders the default description when no description prop is provided', () => {
    const tree = renderer.create(<ErrorMessage />).toJSON()
    expect(JSON.stringify(tree)).toContain('Please try again later')
  })

  it('renders a custom title', () => {
    const tree = renderer.create(<ErrorMessage title="Something went wrong" />).toJSON()
    expect(JSON.stringify(tree)).toContain('Something went wrong')
  })

  it('renders a custom description', () => {
    const tree = renderer.create(<ErrorMessage description="Check your connection" />).toJSON()
    expect(JSON.stringify(tree)).toContain('Check your connection')
  })
})
