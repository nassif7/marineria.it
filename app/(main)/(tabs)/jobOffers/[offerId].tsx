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
} from '@/components/ui'
import { Lamp, Plus, Share2Icon, Subscript, MapPin, Calendar, Loader } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { getOwnerOfferById, getProOfferById, applyToOffer } from '@/api'
import { Share, Alert } from 'react-native'
import { useUser } from '@/Providers/UserProvider'
import { useCallback } from 'react'
import { AuthTypes } from '@/api/types'
import { useAppState, useFetch } from '@/hooks'

const JobOfferScreen = () => {
  const { offerId } = useLocalSearchParams()
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

  // const proApplyToOffer = useCallback(
  //   async () => await applyToOffer(token, offerId as string, language),
  //   [token, language, offerId],
  // )

  const fetchOfferData = useFetch(fetchOffer)

  const offer = fetchOfferData?.data?.[0]

  if (!fetchOfferData?.isLoading && !fetchOfferData?.data?.length) {
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
    console.log('apply to offer')
    const response = await applyToOffer(token, offerId as string, language)
    if (response?.ok) {
      Alert.alert('You have successfully applied to this offer')
    } else {
      Alert.alert('Something went wrong, please try again later')
    }
  }

  return (
    <>
      {fetchOfferData?.isLoading && <Loading />}
      {!fetchOfferData?.isLoading && (
        <ScrollView className="h-full bg-secondary-800 px-2">
          <VStack>
            <Box className="p4 mb-4">
              <Heading className="text-white text-4xl p4">{offer?.offer.trim()}</Heading>
            </Box>
            <VStack className="rounded border-secondary-500 border-2 bg-secondary-100 p-2">
              <Box className="flex-row">
                <Text className=" font-bold">From: </Text>
                <Text className="">{new Date(offer?.offerfrom as string).toLocaleDateString()}</Text>
                <Text className=" font-bold"> - To: </Text>
                <Text>{new Date(offer?.offerTo as string).toLocaleDateString()}</Text>
              </Box>
              <Box>
                <Text>
                  {offer?.compenso_From} - {offer?.compenso_To}
                </Text>
              </Box>
              <Box className="mt-2">
                <Text> {offer?.descriptionOffer.replace(/<[^>]*>?/gm, '').trim()}</Text>
                {!!offer?.unit && <Text>unit: {offer?.unit}</Text>}
                {!!offer?.requirements && <Text>requirements: {offer?.requirements}</Text>}
              </Box>
              <Divider className="my-4" />
              <ButtonGroup className="justify-between p-3">
                <Button className="rounded" onPress={onShare} action="secondary">
                  <ButtonText>Share</ButtonText>
                  <ButtonIcon as={Share2Icon} />
                </Button>
                <Button disabled={offer?.alredayApplied} onPress={onApply}>
                  <ButtonText>Apply</ButtonText>
                  <ButtonIcon as={Plus} />
                </Button>
              </ButtonGroup>
            </VStack>
          </VStack>
        </ScrollView>
      )}
    </>
  )
}

export default JobOfferScreen
