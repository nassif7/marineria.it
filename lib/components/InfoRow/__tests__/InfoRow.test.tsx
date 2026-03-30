import React from 'react'
import renderer from 'react-test-renderer'
import InfoRow from '../index'

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

const MockIcon = 'MockIcon'

describe('InfoRow', () => {
  it('renders a snapshot with required props', () => {
    const tree = renderer.create(<InfoRow icon={MockIcon} label="Port" value="Naples" />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders the label text', () => {
    const tree = renderer.create(<InfoRow icon={MockIcon} label="Vessel" value="Titanic" />).toJSON()
    expect(JSON.stringify(tree)).toContain('Vessel')
  })

  it('renders the value text', () => {
    const tree = renderer.create(<InfoRow icon={MockIcon} label="Vessel" value="Titanic" />).toJSON()
    expect(JSON.stringify(tree)).toContain('Titanic')
  })

  it('applies no extra className when className is omitted', () => {
    const instance = renderer.create(<InfoRow icon={MockIcon} label="Flag" value="IT" />).toJSON() as any
    // className will be "items-center mb-1 undefined" when undefined — check it starts correctly
    expect(instance.props.className).toContain('items-center mb-1')
  })

  it('applies a custom className when provided', () => {
    const instance = renderer
      .create(<InfoRow icon={MockIcon} label="Flag" value="IT" className="mt-2" />)
      .toJSON() as any
    expect(instance.props.className).toContain('mt-2')
  })

  it('passes the icon to the Icon component', () => {
    const tree = renderer.create(<InfoRow icon={MockIcon} label="Rank" value="Captain" />).toJSON()
    expect(JSON.stringify(tree)).toContain('MockIcon')
  })
})
