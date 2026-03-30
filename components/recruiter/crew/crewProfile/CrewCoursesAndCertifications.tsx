import { FC, memo } from 'react'
import { VStack, HStack, Text, Badge, BadgeText } from '@/lib/components/ui'
import { Book, GraduationCap, Award, BookOpen, BookMarked, ScrollText } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { SubSection, Section, SectionHeader } from '@/lib/components'

import { TCrew } from '@/api/types'
import { getCertificateOfCompetence, getSeamansBook } from '@/utils/crewUtils'

const CoursesSection: FC<{ crew: TCrew }> = ({ crew }) => {
  const { t } = useTranslation()

  const { hasCertificateOfCompetence, certificateOfCompetence } = getCertificateOfCompetence(crew)

  const hasSeamansBook = getSeamansBook(crew)

  return (
    <Section>
      <SectionHeader title={t('corses-and-certificates', { ns: 'crew-screen' })} icon={Award} />

      <VStack space="xs">
        <HStack className="items-start flex-wrap align-middle" space="sm">
          {!hasSeamansBook && (
            <Badge action="error" variant="outline" className="rounded-md self-start ">
              <BadgeText className="text-error-900">{crew.seamansBook}</BadgeText>
            </Badge>
          )}
          {!hasCertificateOfCompetence && (
            <Badge action="error" variant="outline" className="rounded-md self-start ">
              <BadgeText className="text-error-900">
                {t('no-certificate-of-competence', { ns: 'crew-screen' })}
              </BadgeText>
            </Badge>
          )}

          {!crew.courses && (
            <Badge action="error" variant="outline" className="rounded-md self-start ">
              <BadgeText className="text-error-900">{t('no-courses', { ns: 'crew' })}</BadgeText>
            </Badge>
          )}
          {!crew.licenseCode && (
            <Badge action="error" variant="outline" className="rounded-md self-start ">
              <BadgeText className="text-error-900">{t('no-license', { ns: 'crew' })}</BadgeText>
            </Badge>
          )}
        </HStack>

        {hasSeamansBook && (
          <SubSection title={t('seamans-book', { ns: 'crew' })} icon={BookOpen}>
            <Text size="sm" semiBold shade={800}>
              {crew.navigationBook}
            </Text>
            <VStack className="pl-2" space="xs">
              <HStack className="items-start" space="xs">
                <Text size="sm" className="w-32 shrink-0 ">
                  {t('category')}:
                </Text>
                <Text size="sm" shade={800} className="flex-1">
                  {crew.registration_Category}
                </Text>
              </HStack>
              <HStack className="items-start" space="xs">
                <Text size="sm" className="w-32 shrink-0 ">
                  {t('city')}:
                </Text>
                <Text size="sm" shade={800} className="flex-1">
                  {crew.registration_City}
                </Text>
              </HStack>
              <HStack className="items-start" space="xs">
                <Text size="sm" className="w-32 shrink-0 ">
                  {t('qualification')}:
                </Text>
                <Text size="sm" shade={800} className="flex-1">
                  {crew?.qualificationCode}
                </Text>
              </HStack>
            </VStack>
          </SubSection>
        )}
        {hasCertificateOfCompetence && (
          <SubSection title={t('certificate-of-competence', { ns: 'crew-screen' })} icon={Book}>
            <VStack>
              {certificateOfCompetence.map((i) => (
                <Text size="sm" semiBold shade={800} key={i}>
                  {i}
                </Text>
              ))}
            </VStack>
          </SubSection>
        )}

        {crew.courses && (
          <SubSection title={t('courses', { ns: 'crew' })} icon={BookMarked}>
            <Text size="sm" semiBold shade={800}>
              {crew.courses}
            </Text>
          </SubSection>
        )}
        {crew.licenseCode && (
          <SubSection title={t('license', { ns: 'crew' })} icon={ScrollText}>
            <Text size="sm" semiBold shade={800}>
              {crew.licenseCode}
            </Text>
          </SubSection>
        )}
      </VStack>
    </Section>
  )
}

export default memo(CoursesSection)

CoursesSection.displayName = 'CoursesSection'
