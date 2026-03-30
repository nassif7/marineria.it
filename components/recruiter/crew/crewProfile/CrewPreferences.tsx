import { FC, useState, useMemo, memo } from 'react'
import { ScrollView, TouchableOpacity, Linking } from 'react-native'
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Icon,
  Image,
  Badge,
  BadgeText,
  BadgeIcon,
  Button,
  ButtonText,
  Divider,
} from '@/lib/components/ui'
import {
  User,
  Calendar,
  MapPin,
  Award,
  Heart,
  Cake,
  Cigarette,
  IdCard,
  Briefcase,
  Phone,
  Mail,
  MessageCircle,
  Link,
  Star,
  Globe,
  BookOpen,
  Anchor,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Contact,
  Euro,
} from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { SubSection, Section, SectionHeader } from '@/components/appUI'
import { getAgeByYear } from '@/lib/utils/dateUtils'
import { TCrew } from '@/api/types'
import { faker } from '@faker-js/faker'

const PreferencesSection: FC<{ crew: TCrew }> = ({ crew }) => {
  const { t } = useTranslation('crew')
  return (
    <Section>
      <SubSection>
        <HStack className="items-start" space="xs">
          <HStack space="xs" className="items-center w-32 shrink-0">
            <Icon as={IdCard} size="sm" className="text-typography-600" />
            <Text size="sm">{t('salary')}:</Text>
          </HStack>
          <Text size="sm" semiBold>
            {crew.salary || '—'}
          </Text>
        </HStack>
        <HStack className="items-start" space="xs">
          <HStack space="xs" className="items-center w-32 shrink-0">
            <Icon as={Heart} size="sm" className="text-typography-600" />
            <Text size="sm">{t('in-team-with', { ns: 'crew' })}:</Text>
          </HStack>
          <Text size="sm" semiBold>
            {crew.card1Couple || '—'}
          </Text>
        </HStack>
      </SubSection>
    </Section>
  )
}

export default memo(PreferencesSection)

PreferencesSection.displayName = 'PreferencesSection'
