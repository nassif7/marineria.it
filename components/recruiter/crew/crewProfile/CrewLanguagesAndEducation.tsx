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
import { SubSection, Section, SectionHeader } from '@/lib/components'

import { getAgeByYear } from '@/lib/utils/dateUtils'
import { TCrew } from '@/api/types'
import { faker } from '@faker-js/faker'

const LanguagesSection: FC<{ crew: TCrew }> = ({ crew }) => {
  const { t } = useTranslation(['crew-screen', 'crew'])
  const langs = useMemo(() => [crew.language1, crew.language2, crew.language3, crew.language4].filter(Boolean), [crew])

  return (
    <Section>
      <SectionHeader title={t('languages-and-education')} icon={Globe} />

      <VStack space="xs">
        <HStack>
          {langs.length === 0 ? (
            <Badge action="error" variant="outline" className="rounded-md">
              <BadgeText className="text-typography-800">{t('no-languages', { ns: 'crew' })}</BadgeText>
            </Badge>
          ) : (
            <HStack className="flex-wrap gap-2">
              {langs.map((l) => (
                <Badge key={l} action="muted" variant="outline" className="rounded-md">
                  <BadgeText className="text-typography-800">{l}</BadgeText>
                </Badge>
              ))}
            </HStack>
          )}
        </HStack>
        {crew.educationalLevel && (
          <SubSection title={t('education', { ns: 'crew' })} icon={GraduationCap}>
            <Text size="sm" semiBold shade={800}>
              {crew.educationalLevel}
            </Text>
          </SubSection>
        )}
        {!crew.educationalLevel && (
          <Badge action="error" variant="outline" className="rounded-md">
            <BadgeText className="text-typography-800">{t('no-education', { ns: 'crew' })}</BadgeText>
          </Badge>
        )}
      </VStack>
    </Section>
  )
}

export default memo(LanguagesSection)

LanguagesSection.displayName = 'LanguagesSection'
