import React from 'react'
import renderer from 'react-test-renderer'
import Section from '../index'

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

describe('Section', () => {
  it('renders a snapshot with children', () => {
    const tree = renderer
      .create(
        <Section>
          <></>
        </Section>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders a snapshot with a className', () => {
    const tree = renderer
      .create(
        <Section className="my-class">
          <></>
        </Section>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders children inside the Box', () => {
    const tree = renderer
      .create(
        <Section>
          <React.Fragment key="child-text">child content</React.Fragment>
        </Section>
      )
      .toJSON()
    expect(JSON.stringify(tree)).toContain('child content')
  })

  it('includes the base classes in className when no extra className is given', () => {
    const instance = renderer
      .create(
        <Section>
          <></>
        </Section>
      )
      .toJSON() as any
    expect(instance.props.className).toContain('bg-white rounded-md p-2 mx-2')
  })

  it('appends a custom className when provided', () => {
    const instance = renderer
      .create(
        <Section className="extra-class">
          <></>
        </Section>
      )
      .toJSON() as any
    expect(instance.props.className).toContain('extra-class')
  })
})
