import { useCallback, useState } from 'react'
import { ScrollView, Share } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Plus, Share2Icon } from 'lucide-react-native'
import { getOwnerOfferById, getProOfferById, applyToOffer } from '@/api'
import { AuthTypes, isErrorResponse } from '@/api/types'
import { useUser } from '@/Providers/UserProvider'
import { useFetch } from '@/hooks'
import {
  View,
  Box,
  Heading,
  Button,
  ButtonText,
  ButtonIcon,
  VStack,
  Loading,
  Card,
  HStack,
  Alert,
  AlertText,
  AlertIcon,
} from '@/components/ui-lib'
import { Icon, CloseIcon } from '@/components/ui-lib/icon'
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
  const [loading, setLoading] = useState(false)
  const [errorObj, setErrorObj] = useState<any>(null)

  console.log('OfferDetails')
  const fetchOffer = useCallback(
    async () => await getProOfferById('nassif' as string, token, language),
    [token, language, offerId]
  )
  const offerData = useFetch(fetchOffer)

  if (offerData?.error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Alert action="success" className="gap-4 max-w-[585px] w-full self-center items-start min-[400px]:items-center">
          <VStack className="gap-4 min-[400px]:flex-row justify-between flex-1 min-[400px]:items-center">
            <AlertText className="font-semibold text-typography-900" size="sm">
              Verify your phone number to create an API key
            </AlertText>
            <Button size="sm" className="hidden sm:flex">
              <ButtonText>Start verification</ButtonText>
            </Button>
          </VStack>
          <Icon as={CloseIcon} />
        </Alert>
      </View>
    )
  }
  const offer = offerData?.data?.[0]

  // if (!offerData?.isLoading && !offerData?.data?.length) {
  //   Alert.alert(t('offer_not_loading'))
  //   router.navigate(`/(tabs)/proScreens/jobOffers`)
  // }

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
      // Alert.alert(error.message)
    }
  }

  // const onApply = async () => {
  //   const response = await applyToOffer(token, parseInt(offerId as string), language)
  //   if (isErrorResponse(response)) {
  //     Alert.alert(t(response.messageKey || 'apply_offer_error'))
  //   } else {
  //     Alert.alert(t(response.messageKey || 'offer_applied_successfully'))
  //     router.navigate(`/(tabs)/proScreens/jobOffers`)
  //   }
  // }

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
                    {`${t('offerSalary')}:  ${!offer?.salary_From ? 'NA' : offer.salary_From + '-' + offer.salary_To}`}
                  </Heading>
                </HStack>
                <HStack className="justify-between">
                  <Heading size="sm">
                    {t('offerFrom')}:{offer?.offerdate.substring(offer.offerdate.indexOf(',') + 1)} - {t('offerTo')}:{' '}
                    {offer?.offertExpirationdate.substring(offer.offertExpirationdate.indexOf(',') + 1)}{' '}
                  </Heading>
                </HStack>
              </VStack>
            </Box>
            <Box className="mt-4 flex-col border-2 border-outline-200 rounded p-2 ">
              <Heading size="sm"> {offer?.descriptionOffer.replace(/<[^>]*>?/gm, '').trim()}</Heading>
            </Box>
            <Box className="mt-4 flex-col border-2 border-outline-200 rounded p-2 ">
              <VStack className="justify-between p-3">
                <Button className="rounded mb-2" onPress={onShare} action="secondary">
                  <ButtonText>Share</ButtonText>
                  <ButtonIcon as={Share2Icon} />
                </Button>
                {/* {!offer?.alreadyApplied && (
                  <Button isDisabled={loading} onPress={onApply}>
                    <ButtonText>Apply</ButtonText>
                    <ButtonIcon as={Plus} />
                  </Button>
                )} */}
              </VStack>
            </Box>
          </Card>
        </ScrollView>
      )}
    </>
  )
}

export default OfferDetails
