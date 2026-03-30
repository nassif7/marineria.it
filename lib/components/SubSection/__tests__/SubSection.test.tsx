import React from 'react'
import renderer from 'react-test-renderer'
import { SubSection, SubSectionHeader } from '../index'

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

const MockIcon = 'MockIcon'

// ── SubSectionHeader ──────────────────────────────────────────────────────────

describe('SubSectionHeader', () => {
  it('returns null when neither icon nor title is provided', () => {
    const tree = renderer.create(<SubSectionHeader />).toJSON()
    expect(tree).toBeNull()
  })

  it('renders a snapshot with title only', () => {
    const tree = renderer.create(<SubSectionHeader title="Documents" />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders a snapshot with icon and title', () => {
    const tree = renderer.create(<SubSectionHeader icon={MockIcon} title="Documents" />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders a snapshot with a badge', () => {
    const tree = renderer.create(<SubSectionHeader title="Files" badge={3} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders the title text', () => {
    const tree = renderer.create(<SubSectionHeader title="Certificates" />).toJSON()
    expect(JSON.stringify(tree)).toContain('Certificates')
  })

  it('renders the badge value', () => {
    const tree = renderer.create(<SubSectionHeader title="Items" badge={7} />).toJSON()
    expect(JSON.stringify(tree)).toContain('7')
  })

  it('renders a ChevronRight icon when isPressable is true', () => {
    const tree = renderer.create(<SubSectionHeader title="Press me" isPressable />).toJSON()
    expect(JSON.stringify(tree)).toContain('ChevronRight')
  })

  it('does not render a ChevronRight icon when isPressable is false', () => {
    const tree = renderer.create(<SubSectionHeader title="Static" isPressable={false} />).toJSON()
    expect(JSON.stringify(tree)).not.toContain('ChevronRight')
  })
})

// ── SubSection ────────────────────────────────────────────────────────────────

describe('SubSection', () => {
  it('renders a snapshot with children only', () => {
    const tree = renderer
      .create(
        <SubSection>
          <></>
        </SubSection>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders a snapshot with title, icon, and children', () => {
    const tree = renderer
      .create(
        <SubSection title="Docs" icon={MockIcon}>
          <></>
        </SubSection>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders a snapshot with a badge', () => {
    const tree = renderer
      .create(
        <SubSection title="Files" badge={2}>
          <></>
        </SubSection>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders children', () => {
    const tree = renderer
      .create(
        <SubSection>
          <React.Fragment key="inner">inner text</React.Fragment>
        </SubSection>
      )
      .toJSON()
    expect(JSON.stringify(tree)).toContain('inner text')
  })

  it('uses Box as container when onPress is not provided', () => {
    const instance = renderer
      .create(
        <SubSection>
          <></>
        </SubSection>
      )
      .toJSON() as any
    expect(instance.type).toBe('Box')
  })

  it('uses Pressable as container when onPress is provided', () => {
    const instance = renderer
      .create(
        <SubSection onPress={() => {}}>
          <></>
        </SubSection>
      )
      .toJSON() as any
    expect(instance.type).toBe('Pressable')
  })

  it('applies a custom className', () => {
    const instance = renderer
      .create(
        <SubSection className="extra-class">
          <></>
        </SubSection>
      )
      .toJSON() as any
    expect(instance.props.className).toContain('extra-class')
  })

  it('calls onPress when Pressable is pressed', () => {
    const onPress = jest.fn()
    const instance = renderer
      .create(
        <SubSection onPress={onPress}>
          <></>
        </SubSection>
      )
      .toJSON() as any
    instance.props.onPress()
    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
