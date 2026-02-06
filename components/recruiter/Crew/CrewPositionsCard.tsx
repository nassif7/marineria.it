import React, { FC } from 'react'
import { Box, Heading, VStack, Text } from '@/components/ui'
import { useTranslation } from 'react-i18next'

interface CrewPositionCardProps {
  mainPosition: string
  otherPositions?: {
    label: string
    value?: string
  }[]
}

const CrewPositionCard: FC<CrewPositionCardProps> = ({ mainPosition, otherPositions }) => {
  const { t } = useTranslation()
  return (
    <Box className="bg-white rounded-lg p-3 shadow-sm">
      <VStack className="gap-3">
        <VStack className="gap-1">
          <Text className="text-typography-500 text-sm  font-medium  tracking-wide">{t('crew.main-position')}</Text>
          <Heading size="lg" className="text-typography-900">
            {mainPosition}
          </Heading>
        </VStack>

        {otherPositions && otherPositions.length > 0 && (
          <VStack className="gap-4">
            <Text className="text-typography-500 text-sm  font-medium  tracking-wide">{t('crew.other-positions')}</Text>
            <Box className="flex-row flex-wrap gap-1">
              {otherPositions.map((position, index) => (
                <Box className="bg-background-50 rounded-lg px-3 py-2 " key={index}>
                  <Text className="text-typography-700 font-medium">{position.value}</Text>
                </Box>
              ))}
            </Box>
          </VStack>
        )}
      </VStack>
    </Box>
  )
}

export default CrewPositionCard
