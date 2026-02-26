import { FC } from 'react'
import { VStack, HStack, Text, Badge, BadgeText } from '@/components/ui'
import { Book, GraduationCap, Award, BookOpen, BookMarked, ScrollText } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { SubSection, Section, SectionHeader } from '@/components/appUI'
import { TCrew } from '@/api/types'

const CoursesSection: FC<{ crew: TCrew }> = ({ crew }) => {
  const { t } = useTranslation()

  return (
    <Section>
      <SectionHeader title={t('corses-and-certificates', { ns: 'crew-screen' })} icon={Award} />

      <VStack space="xs">
        <HStack className="items-start" space="sm">
          {crew.seamansBook !== 'Seamans Book' && (
            <Badge action="error" variant="outline" className="rounded-md self-start mb-2">
              <BadgeText className="text-error-900">{crew.seamansBook}</BadgeText>
            </Badge>
          )}
          {!crew.courses && (
            <Badge action="error" variant="outline" className="rounded-md self-start mb-2">
              <BadgeText className="text-error-900">{t('no-courses', { ns: 'crew' })}</BadgeText>
            </Badge>
          )}
          {!crew.licenseCode && (
            <Badge action="error" variant="outline" className="rounded-md self-start mb-2">
              <BadgeText className="text-error-900">{t('no-license', { ns: 'crew' })}</BadgeText>
            </Badge>
          )}
        </HStack>

        {crew.seamansBook === 'Seamans Book' && (
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

export default CoursesSection
