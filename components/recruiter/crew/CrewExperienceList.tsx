import { FC } from 'react'
import { Box, Heading, VStack, HStack, Text, Icon } from '@/components/ui'
import { Briefcase } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import CrewExperienceCard from './ExperienceCard'
import { CrewExperienceType } from '@/api/types/crew'

const CrewExperienceList: FC<{ experiences: CrewExperienceType[]; calculatedExperience: string }> = ({
  experiences,
  calculatedExperience,
}) => {
  const { t } = useTranslation()

  return (
    <Box className="bg-white rounded-2xl p-3 shadow-sm">
      <HStack className="items-center justify-between mb-4">
        <HStack className="items-center gap-2">
          <Icon
            as={Briefcase}
            className={experiences && experiences?.length ? 'text-primary-600' : 'text-error-600'}
            size="md"
          />
          <VStack className="gap-0.5">
            <Heading size="md" className={experiences && experiences?.length ? 'text-primary-600' : 'text-error-600'}>
              {experiences && experiences?.length ? t('crew.experience.boarding') : t('crew.experience.no-experience')}
            </Heading>
            {experiences && experiences.length > 0 && (
              <Text className="text-typography-600 text-sm">
                {t('crew.experience.experience')} {calculatedExperience}
              </Text>
            )}
          </VStack>
        </HStack>
        {experiences && experiences.length && (
          <Box className="bg-success-100 rounded-full px-3 py-1.5">
            <Text className="text-success-700 font-bold text-sm">{experiences.length}</Text>
          </Box>
        )}
      </HStack>
      {experiences && experiences.length && (
        <VStack className="gap-3">
          {experiences.map((exp, index) => (
            <CrewExperienceCard key={index} experience={exp} />
          ))}
        </VStack>
      )}
    </Box>
  )
}

export default CrewExperienceList
