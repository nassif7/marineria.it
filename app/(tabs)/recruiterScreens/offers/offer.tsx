import { ScrollView } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import {
  Card,
  HStack,
  Box,
  Heading,
  Text,
  Button,
  ButtonText,
  ButtonIcon,
  ButtonGroup,
  VStack,
  Divider,
} from '@/components/ui'
import { Plus, Share2Icon } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Share, Alert } from 'react-native'
import { useEffect } from 'react'
import { useShowToast } from '@/hooks'
import { JobOfferTypes } from '@/api/types'
import { applyToOffer } from '@/api'
import { useUser } from '@/Providers/UserProvider'

const OfferScreen = () => {
  const { offerStr } = useLocalSearchParams()
  const offer = JSON.parse(offerStr as string) as JobOfferTypes.JobOfferType
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
        {/* <Box className="mt-4 flex-col border-2 border-outline-200 rounded p-2 ">
          <ButtonGroup className="justify-between p-3">
            <Button className="rounded" onPress={onShare} action="secondary">
              <ButtonText>Share</ButtonText>
              <ButtonIcon as={Share2Icon} />
            </Button>
            <Button isDisabled={!offer?.alreadyApplied} onPress={onApply}>
              <ButtonText>Apply</ButtonText>
              <ButtonIcon as={Plus} />
            </Button>
          </ButtonGroup>
        </Box> */}
      </Card>
    </ScrollView>
  )
}

export default OfferScreen
