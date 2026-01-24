import { SafeAreaView, ImageBackground, ScrollView, FlatList, TouchableHighlight, Platform } from 'react-native'
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
import { useTranslation } from 'react-i18next'
import { getOwnerOfferById, getProOfferById, applyToOffer, getCrewList } from '@/api'
import { Share, Alert } from 'react-native'
import { useUser } from '@/Providers/UserProvider'
import { useCallback } from 'react'
import { AuthTypes, CrewType } from '@/api/types'
import { useFetch } from '@/hooks'
import CrewListItem from './CrewListItem'

interface CrewListProps {
  offerId: string
}

const CrewList: React.FC<CrewListProps> = ({ offerId }) => {
  const {
    i18n: { language },
    t,
  } = useTranslation()
  const { activeProfile } = useUser()
  const { role, token } = activeProfile as any

  const fetchCrewList = useCallback(
    async () => await getCrewList(offerId as string, token, language),
    [token, language, offerId]
  )
  const crewListData = useFetch(fetchCrewList)
  const crewList = crewListData?.data as CrewType[]

  if (!crewListData?.isLoading && !crewListData?.data?.length) {
    console.log('no items matching')
  }

  return (
    <>
      {crewListData?.isLoading && <Loading />}
      {!crewListData?.isLoading && (
        <FlatList data={crewList} renderItem={({ item }) => <CrewListItem crew={item} offerId={offerId} />} />
      )}
    </>
  )
}

export default CrewList
