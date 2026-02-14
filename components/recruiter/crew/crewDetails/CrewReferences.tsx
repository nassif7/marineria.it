import { FC } from 'react'
import { Box, Heading, VStack, HStack, Text, Icon } from '@/components/ui'
import { Anchor, Star, Mail, Phone } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { CrewReferenceType } from '@/api/types/crew'

const CrewReferences: FC<{ references?: CrewReferenceType[] }> = ({ references }) => {
  const { t } = useTranslation()

  return (
    <Box className="bg-white rounded-2xl p-3  ">
      <HStack className="items-center justify-between mb-4">
        <HStack className="items-center gap-2">
          <Icon as={Star} className={!!references?.length ? 'text-primary-600' : 'text-error-600'} size="md" />
          <Heading size="md" className={!!references?.length ? 'text-primary-600' : 'text-error-600'}>
            {t(!!references?.length ? 'crew.references' : 'crew.no-references')}
          </Heading>
        </HStack>
        {references && references.length > 0 && (
          <Box className="bg-success-100 rounded-full px-3 py-1.5">
            <Text className="text-success-700 font-bold text-sm">{references.length}</Text>
          </Box>
        )}
      </HStack>

      {references && references.length > 0 && (
        <VStack className="gap-3">
          {references.map((ref, index) => (
            <Box key={index} className="border border-outline-200 rounded-lg p-3">
              <VStack className="gap-1 mb-3 pb-3 border-b border-outline-100">
                <Text className="text-typography-900 font-bold text-lg break-words">{ref.company_name}</Text>
                <HStack className="items-center gap-1.5">
                  <Icon as={Anchor} className="text-primary-600" size="xs" />
                  <Text className="text-primary-700 font-semibold text-sm">{ref.yacht}</Text>
                </HStack>
                <Text className="text-typography-600 text-sm mt-0.5">{ref.positionreferent}</Text>
              </VStack>

              {(ref.telephone || ref.email) && (
                <VStack className="gap-1.5 pt-3  border-outline-100">
                  {ref.telephone && (
                    <HStack className="items-center gap-2">
                      <Icon as={Phone} className="text-typography-400" size="xs" />
                      <Text className="text-typography-600 text-sm  break-words">{ref.telephone}</Text>
                    </HStack>
                  )}
                  {ref.email && (
                    <HStack className="items-center gap-2">
                      <Icon as={Mail} className="text-typography-400" size="xs" />
                      <Text className="text-typography-600 text-sm  break-words">{ref.email}</Text>
                    </HStack>
                  )}
                </VStack>
              )}
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  )
}

export default CrewReferences
