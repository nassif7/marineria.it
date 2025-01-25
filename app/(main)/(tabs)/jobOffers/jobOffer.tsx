import { ScrollView } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { Box, Heading, Text, Button, ButtonText, ButtonIcon, ButtonGroup, VStack, Divider } from '@/components/ui'
import { Plus, Share2Icon } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Share, Alert } from 'react-native'
import { useEffect } from 'react'
import { useShowToast } from '@/hooks'
import { JobOfferTypes } from '@/api/types'

const JobOfferScreen = () => {
  const { offerStr } = useLocalSearchParams()
  const offer = JSON.parse(offerStr as string) as JobOfferTypes.JobOfferType
  const {
    i18n: { language },
    t,
  } = useTranslation()
  // const showWarningToast = useShowToast('warning', 'warning', 'warning')
  const showErrorToast = useShowToast(t('error'), t('error'), 'error')
  const showInfoToast = useShowToast('info', 'info', 'info')

  // useEffect(() => {
  //   !offer.offerApplicable && showWarningToast()
  // }, [offerStr])

  const onShare = async () => {
    const title = offer?.offer.trimStart()

    try {
      const result = await Share.share(
        {
          title,
          message: 'Here is a Job Offer for you on marineria!',
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
    if (offer.alredayApplied) {
      showInfoToast()
    }
    if (!offer.offerApplicable) {
      showErrorToast()
    }
  }

  return (
    <ScrollView className="h-full bg-secondary-800 px-2 pt-4">
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
          {offer.offerApplicable && (
            <Button disabled={!offer.offerApplicable} onPress={onApply} action="primary" className="mb-2">
              <ButtonText>Apply</ButtonText>
              <ButtonIcon as={Plus} />
            </Button>
          )}
          <Button className="text-white" onPress={onShare} action="secondary">
            <ButtonText className="text-white">Share</ButtonText>
            <ButtonIcon as={Share2Icon} className="text-white" />
          </Button>
        </VStack>
      </VStack>
    </ScrollView>
  )
}

export default JobOfferScreen
