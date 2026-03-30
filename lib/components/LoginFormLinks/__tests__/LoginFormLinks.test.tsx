import React from 'react'
import renderer from 'react-test-renderer'
import LoginFormLinks from '../index'

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
  Box: 'Box',
  Link: 'Link',
  LinkText: 'LinkText',
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

describe('LoginFormLinks', () => {
  it('renders a snapshot with no props', () => {
    const tree = renderer.create(<LoginFormLinks />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders a snapshot when isCrew is true', () => {
    const tree = renderer.create(<LoginFormLinks isCrew />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders a snapshot when isRecruiter is true', () => {
    const tree = renderer.create(<LoginFormLinks isRecruiter />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders a snapshot when both isCrew and isRecruiter are true', () => {
    const tree = renderer.create(<LoginFormLinks isCrew isRecruiter />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('always renders the forgot-password link', () => {
    const tree = renderer.create(<LoginFormLinks />).toJSON()
    expect(JSON.stringify(tree)).toContain('forgot-password')
  })

  it('renders the register-as-recruiter link when isRecruiter is false (default)', () => {
    const tree = renderer.create(<LoginFormLinks />).toJSON()
    expect(JSON.stringify(tree)).toContain('register-as-recruiter')
  })

  it('hides the register-as-recruiter link when isRecruiter is true', () => {
    const tree = renderer.create(<LoginFormLinks isRecruiter />).toJSON()
    expect(JSON.stringify(tree)).not.toContain('register-as-recruiter')
  })

  it('renders the register-as-crew link when isCrew is false (default)', () => {
    const tree = renderer.create(<LoginFormLinks />).toJSON()
    expect(JSON.stringify(tree)).toContain('register-as-crew')
  })

  it('hides the register-as-crew link when isCrew is true', () => {
    const tree = renderer.create(<LoginFormLinks isCrew />).toJSON()
    expect(JSON.stringify(tree)).not.toContain('register-as-crew')
  })

  it('renders only the forgot-password link when both isCrew and isRecruiter are true', () => {
    const tree = renderer.create(<LoginFormLinks isCrew isRecruiter />).toJSON()
    const serialised = JSON.stringify(tree)
    expect(serialised).toContain('forgot-password')
    expect(serialised).not.toContain('register-as-recruiter')
    expect(serialised).not.toContain('register-as-crew')
  })
})
