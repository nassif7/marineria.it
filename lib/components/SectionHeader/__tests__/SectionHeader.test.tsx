import React from 'react'
import renderer from 'react-test-renderer'
import SectionHeader from '../index'

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

describe('SectionHeader', () => {
  it('renders a snapshot with title only', () => {
    const tree = renderer.create(<SectionHeader title="Vessel Details" />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders a snapshot with title and icon', () => {
    const tree = renderer.create(<SectionHeader title="Vessel Details" icon={MockIcon} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders a snapshot with title, icon, and custom className', () => {
    const tree = renderer
      .create(<SectionHeader title="Vessel Details" icon={MockIcon} className="text-primary-600" />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders the title text', () => {
    const tree = renderer.create(<SectionHeader title="Crew Info" />).toJSON()
    expect(JSON.stringify(tree)).toContain('Crew Info')
  })

  it('does not render an Icon element when no icon prop is given', () => {
    const tree = renderer.create(<SectionHeader title="No Icon" />).toJSON()
    const serialised = JSON.stringify(tree)
    // The Icon string should not appear as a rendered element type when icon is absent
    expect(serialised).not.toContain('"type":"Icon"')
  })

  it('renders the Icon element when an icon prop is given', () => {
    const tree = renderer.create(<SectionHeader title="With Icon" icon={MockIcon} />).toJSON()
    expect(JSON.stringify(tree)).toContain('"type":"Icon"')
  })

  it('applies the custom className to both Icon and Heading', () => {
    const tree = renderer.create(<SectionHeader title="Styled" icon={MockIcon} className="text-red-500" />).toJSON()
    expect(JSON.stringify(tree)).toContain('text-red-500')
  })
})
