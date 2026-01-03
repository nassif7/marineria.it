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

const JobOfferScreen = () => {
  const { offerStr } = useLocalSearchParams()
  const offer = JSON.parse(offerStr as string) as JobOfferTypes.ProJobOfferType
  const {
    i18n: { language },
    t,
  } = useTranslation()
  // const showWarningToast = useShowToast('warning', 'warning', 'warning')
  const showErrorToast = useShowToast(t('error'), t('error'), 'error')
  const showInfoToast = useShowToast('info', 'info', 'info')
  const { activeProfile } = useUser()
  const { role, token } = activeProfile as any

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
    console.log('apply to offer')
    await applyToOffer(token, offer.idoffer, language)
  }

  return (
    <>
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
          </Box>
        </Card>
      </ScrollView>
    </>
  )
}

export default JobOfferScreen
