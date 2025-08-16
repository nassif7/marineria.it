import { ScrollView } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { Card, HStack, Box, Heading, VStack } from '@/components/ui-lib'
import { useTranslation } from 'react-i18next'
import { JobOfferTypes } from '@/api/types'

const OfferScreen = () => {
  const { offerStr } = useLocalSearchParams()
  const offer = JSON.parse(offerStr as string) as JobOfferTypes.ProJobOfferType
  const {
    i18n: { language },
    t,
  } = useTranslation()

  return (
    <ScrollView className="">
      <Card>
        <Box className="mt-4 flex-col">
          <Heading size="2xl" className="text-primary-600">
            {offer?.offer.trim()}
          </Heading>
        </Box>
        <Box className="mt-4 flex-col border-2 border-outline-200 rounded p-2 ">
          <VStack>
            <Heading className="text-primary-600" size="md">
              {offer?.positionArm}
            </Heading>
            <HStack className="justify-between">
              <Heading size="sm">
                {`${t('offerSalary')}:  ${!offer?.salary_From ? 'NA' : offer.salary_From + '-' + offer.salary_To}`}
              </Heading>
            </HStack>
          </VStack>
        </Box>
        <Box className="mt-4 flex-col border-2 border-outline-200 rounded p-2 ">
          <Heading size="sm"> {offer?.descriptionOffer.replace(/<[^>]*>?/gm, '').trim()}</Heading>
        </Box>
      </Card>
    </ScrollView>
  )
}

export default OfferScreen
