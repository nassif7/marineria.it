import { SafeAreaView, ImageBackground, ScrollView } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import {
  View,
  Box,
  Heading,
  Text,
  Button,
  ButtonText,
  ButtonIcon,
  ButtonGroup,
  VStack,
  Divider,
  Loading,
  Card,
  HStack,
} from '@/components/ui'
import { Lamp, Plus, Share2Icon, Subscript, MapPin, Calendar, Loader } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { getOwnerOfferById, getProOfferById, applyToOffer, getCrewList } from '@/api'
import { Share, Alert } from 'react-native'
import { useUser } from '@/Providers/UserProvider'
import { useCallback } from 'react'
import { AuthTypes } from '@/api/types'
import { useFetch } from '@/hooks'

interface OfferDetailsProps {
  offerId: string
}

const OfferDetails: React.FC<OfferDetailsProps> = ({ offerId }) => {
  const {
    i18n: { language },
    t,
  } = useTranslation()
  const { activeProfile } = useUser()
  const { role, token } = activeProfile as any

  const fetchOffer = useCallback(
    async () =>
      await (role == AuthTypes.UserRole.OWNER
        ? getOwnerOfferById(offerId as string, token, language)
        : getProOfferById(offerId as string, token, language)),
    [token, language, offerId]
  )
  const offerData = useFetch(fetchOffer)
  const offer = offerData?.data?.[0]

  if (!offerData?.isLoading && !offerData?.data?.length) {
    console.log('no items matching')
  }

  const onShare = async () => {
    const title = offer?.offer.trimStart()

    try {
      const result = await Share.share(
        {
          title,
          message: 'Here is a jobOffer for you on marineria!',
          url: `https://www.marineria.it/${language}/Apply.aspx?IdOfferta=${offer?.idoffer}`,
        },
        {
          dialogTitle: 'Job offer at marineria!',
          subject: 'Job offer at marineria!',
        }
      )
      // if (result.action === Share.sharedAction) {
      //   if (result.activityType) {
      //     console.log('1', result.activityType, result)
      //     // shared with activity type of result.activityType
      //   } else {
      //     console.log('2', result)
      //     // shared
      //   }
      // } else if (result.action === Share.dismissedAction) {
      //   console.log('dismissed', result)
      //   // dismissed
      // }
    } catch (error: any) {
      Alert.alert(error.message)
    }
  }

  const onApply = async () => {
    const response = await applyToOffer(token, parseInt(offerId as string), language)
    if (response?.ok) {
      Alert.alert('You have successfully applied to this offer')
    } else {
      Alert.alert('Something went wrong, please try again later')
    }
  }

  return (
    <>
      {offerData?.isLoading && <Loading />}
      {!offerData?.isLoading && (
        <ScrollView className="">
          <Card>
            <Box className="mt-4 flex-col">
              <Heading size="2xl" className="text-primary-600">
                {offer?.offer.trim()}
              </Heading>
            </Box>
            <Box className="mt-4 flex-col border-2 border-outline-200 rounded p-2 ">
              <VStack>
                {offer?.positionArm && (
                  <Heading className="text-primary-600" size="md">
                    {offer?.positionArm}
                  </Heading>
                )}
                <HStack className="justify-between">
                  <Heading size="sm">
                    {`${t('offerSalary')}:  ${!offer?.compenso_From ? 'NA' : offer.compenso_From + '-' + offer.compenso_To}`}
                  </Heading>
                </HStack>
                <HStack className="justify-between">
                  <Heading size="sm">
                    {t('offerFrom')}:{offer?.offerfrom.substring(offer.offerfrom.indexOf(',') + 1)} - {t('offerTo')}:{' '}
                    {offer?.offerTo.substring(offer.offerTo.indexOf(',') + 1)}{' '}
                  </Heading>
                </HStack>
              </VStack>
            </Box>
            <Box className="mt-4 flex-col border-2 border-outline-200 rounded p-2 ">
              <Heading size="sm"> {offer?.descriptionOffer.replace(/<[^>]*>?/gm, '').trim()}</Heading>
            </Box>
            <Box className="mt-4 flex-col border-2 border-outline-200 rounded p-2 ">
              <ButtonGroup className="justify-between p-3">
                <Button className="rounded" onPress={onShare} action="secondary">
                  <ButtonText>Share</ButtonText>
                  <ButtonIcon as={Share2Icon} />
                </Button>
                <Button isDisabled={offer?.alreadyApplied} onPress={onApply}>
                  <ButtonText>Apply</ButtonText>
                  <ButtonIcon as={Plus} />
                </Button>
              </ButtonGroup>
            </Box>
          </Card>
        </ScrollView>
      )}
    </>
  )
}

OfferDetails.displayName = 'OfferDetails'

export default OfferDetails
