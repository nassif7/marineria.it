import { FC } from 'react'
import { Box, VStack, HStack, Text, Icon } from '@/components/ui'
import { Calendar } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { CrewExperienceType } from '@/api/types/crew'

const CrewExperienceCard: FC<{ experience: CrewExperienceType }> = ({ experience }) => {
  const { t } = useTranslation()
  console.log(experience)

  return (
    <Box className="bg-white border border-outline-200 rounded-xl p-4 shadow-sm">
      <VStack className="gap-1 mb-3 pb-3 border-b border-outline-100">
        <HStack className="items-center gap-2">
          <Icon as={Calendar} className="text-primary-600" size="sm" />
          <Text className="text-primary-900 font-bold text-base">{experience?.experiencedate || '-'}</Text>
        </HStack>
        <Text className="text-typography-900 font-semibold text-lg break-words">{experience?.boatcompany || '-'}</Text>
      </VStack>
      <VStack className="gap-2.5">
        <HStack className="gap-2 items-start">
          <Text className="text-typography-500 text-sm font-medium shrink-0 w-24">
            {t('crew.experience.use-area')}:
          </Text>
          <Text className="text-typography-900 text-sm flex-1 break-words">{experience?.employer || '-'}</Text>
        </HStack>

        <HStack className="gap-2 items-start">
          <Text className="text-typography-500 text-sm font-medium shrink-0 w-24">{t('crew.experience.role')}:</Text>
          <Text className="text-typography-900 text-sm flex-1 break-words">{experience?.typeofemployment || '-'}</Text>
        </HStack>

        <Box className="mt-1">
          <Text className="text-typography-500 text-xs font-medium uppercase tracking-wide mb-1.5">
            {t('crew.experience.main-tasks')}
          </Text>
          <Box className="bg-background-50 rounded-lg p-3">
            <Text className="text-typography-700 text-sm break-words leading-relaxed">
              {experience?.typeofassignment || '-'}
            </Text>
          </Box>
        </Box>
      </VStack>
    </Box>
  )
}

export default CrewExperienceCard
