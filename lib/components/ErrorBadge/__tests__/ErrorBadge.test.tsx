import React from 'react'
import renderer from 'react-test-renderer'
import ErrorBadge from '../index'

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

describe('ErrorBadge', () => {
  it('renders a snapshot with required props', () => {
    const tree = renderer.create(<ErrorBadge label="Validation error" />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders the provided label text', () => {
    const tree = renderer.create(<ErrorBadge label="Field required" />).toJSON()
    expect(JSON.stringify(tree)).toContain('Field required')
  })

  it('applies the default className when none is provided', () => {
    const instance = renderer.create(<ErrorBadge label="Error" />).toJSON() as any
    expect(instance.props.className).toBe('rounded-md self-start')
  })

  it('applies a custom className when provided', () => {
    const instance = renderer.create(<ErrorBadge label="Error" className="custom-class" />).toJSON() as any
    expect(instance.props.className).toBe('custom-class')
  })

  it('passes the error action and outline variant to Badge', () => {
    const instance = renderer.create(<ErrorBadge label="Error" />).toJSON() as any
    expect(instance.props.action).toBe('error')
    expect(instance.props.variant).toBe('outline')
  })
})
