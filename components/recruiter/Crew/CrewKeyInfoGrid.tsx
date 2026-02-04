import { FC } from 'react'
import { Box, VStack, HStack, Text, Icon } from '@/components/ui'
import { Briefcase, EuroIcon, Globe, MapPin } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'

interface CrewKeyInfoGridProps {
  numberClicked: string | null
  salary: string | null
  passport: string
  currentPosition: string
}

const CrewKeyInfoGrid: FC<CrewKeyInfoGridProps> = ({ numberClicked, salary, passport, currentPosition }) => {
  const { t } = useTranslation()

  return (
    <VStack className="gap-3">
      <HStack className="gap-3">
        <Box className="bg-white rounded-lg p-3 flex-1 shadow-sm">
          <HStack className="items-center gap-2 mb-1">
            <Icon as={Briefcase} className="text-primary-600" size="sm" />
            <Text className="text-typography-500 text-sm  ">{t('crew.job-offers-received')}</Text>
          </HStack>
          <Text className="text-typography-900 font-bold ">{numberClicked ?? 0}</Text>
        </Box>

        <Box className="bg-white rounded-lg p-3 flex-1 shadow-sm">
          <HStack className="items-center gap-2 mb-1">
            <Icon as={EuroIcon} className="text-primary-600" size="sm" />
            <Text className="text-typography-500 text-sm ">{t('crew.salary')}</Text>
          </HStack>
          <Text className="text-typography-900 font-bold ">{salary ? `${salary} €` : 'N/A'}</Text>
        </Box>
      </HStack>

      <Box className="bg-white rounded-lg p-3 shadow-sm">
        <HStack className="items-center gap-2 mb-2">
          <Icon as={Globe} className="text-primary-600" size="sm" />
          <Text className="text-typography-500 text-sm  font-medium uppercase tracking-wide">
            {t('crew.citizenship')}
          </Text>
        </HStack>
        <Text className="text-typography-900 font-semibold text-base">{passport}</Text>
      </Box>

      <Box className="bg-white rounded-lg p-3 shadow-sm">
        <HStack className="items-center gap-2 mb-2">
          <Icon as={MapPin} className="text-primary-600" size="sm" />
          <Text className="text-typography-500 text-sm  font-medium uppercase tracking-wide">
            {t('crew.current-location')}
          </Text>
        </HStack>
        <Text className="text-typography-900 font-semibold text-base">{currentPosition}</Text>
      </Box>
    </VStack>
  )
}

export default CrewKeyInfoGrid
