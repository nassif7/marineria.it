import React, { useState } from 'react'
import { Linking } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { VStack, Text, HStack, Button, ButtonIcon, ButtonText, View, Heading } from '@/lib/components/ui'
import { Loading } from '@/lib/components/ui/loading'
import { useActiveProfile } from '@/Providers/UserProvider'
import { useTranslation } from 'react-i18next'
import { getRecruiterSearchById } from '@/api'
import { ScreenContainer } from '@/lib/components'

import { UserCheck, MapPin } from 'lucide-react-native'

const CrewListEmptyComponent = () => {
  const { searchId } = useLocalSearchParams()

  const {
    t,
    i18n: { language },
  } = useTranslation(['crew-screen'])
  const { token } = useActiveProfile()

  const { isLoading, isSuccess, isError, isRefetching, refetch, data } = useQuery({
    queryKey: ['recruiter-search-by-id', searchId, language],
    queryFn: () => getRecruiterSearchById(searchId as string, token, language),
  })

  const search = isSuccess ? (data as any)?.[0] : null
  const openSearchByLocation = () => {
    const url = `https://www.marineria.it/${language}/${search.listgeourl}?token=${token}`
    Linking.openURL(url)
  }

  const openSearchBySkill = () => {
    const url = `https://www.marineria.it/${language}/${search.listurl}?token=${token}`
    Linking.openURL(url)
  }

  return (
    <View className={`h-full flex-1 px-2 pt-20`}>
      <VStack space="sm" className="items-center justify-center w-full">
        <Heading>{t('empty-crew-list')}</Heading>

        <Button variant="solid" action="positive" onPress={openSearchBySkill} className="rounded-md w-full" size="md">
          <ButtonIcon as={UserCheck} />
          <ButtonText>
            {`${t('find-crew', { ns: 'search-screen' })} ${t('by-skill', { ns: 'search-screen' })}`}
          </ButtonText>
        </Button>
        <Button
          variant="solid"
          action="positive"
          onPress={openSearchByLocation}
          className="rounded-md w-full"
          size="md"
        >
          <ButtonIcon as={MapPin} />
          <ButtonText>
            {`${t('find-crew', { ns: 'search-screen' })} ${t('by-location', { ns: 'search-screen' })}`}
          </ButtonText>
        </Button>
      </VStack>
    </View>
  )
}

export default CrewListEmptyComponent
