import React, { useState } from 'react'
import { Linking } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { VStack, Text } from '@/components/ui'
import { Loading } from '@/components/ui/loading'
import { useUser, ActiveProfile } from '@/Providers/UserProvider'
import { useTranslation } from 'react-i18next'
import { getRecruiterSearchById } from '@/api'
import SearchHeader from './searchDetails/SearchHeader'
import SearchContract from './searchDetails/SearchContract'
import SearchPosition from './searchDetails/SearchPosition'
import SearchCandidates from './searchDetails/SearchCandidates'
import SearchActions from './searchDetails/SearchActions'
import { ScreenContainer } from '@/components/appUI'

export default function SearchDetails() {
  const [showContactModal, setShowContactModal] = useState(false)

  const { searchId } = useLocalSearchParams()
  const router = useRouter()
  const {
    i18n: { language },
    t,
  } = useTranslation(['search-details-screen'])
  const { activeProfile } = useUser()
  const { token } = activeProfile as ActiveProfile

  const { isLoading, isSuccess, isError, isRefetching, refetch, data } = useQuery({
    queryKey: ['recruiter-search-by-id', searchId, language],
    queryFn: () => getRecruiterSearchById(searchId as string, token, language),
  })

  const search = isSuccess ? (data as any)?.[0] : null

  const handleEdit = () => {
    const url = `https://www.marineria.it/${language}/rec/Post.aspx?idofferta=${search.idoffer}&token=${token}`
    Linking.openURL(url)
  }

  const handleViewCandidates = () => {
    router.push(`/recruiter/search/${searchId}/crew/list`)
  }

  if (isLoading || isRefetching) {
    return (
      <ScreenContainer>
        <Loading />
      </ScreenContainer>
    )
  }

  if (isError) {
    return (
      <ScreenContainer>
        <Text color="error">{t('error')}</Text>
      </ScreenContainer>
    )
  }

  return (
    <ScreenContainer scroll refreshing={isRefetching} onRefresh={refetch}>
      {isSuccess && search && (
        <VStack className="pb-2" space="xs">
          <SearchHeader search={search} onEdit={handleEdit} />
          <SearchContract search={search} />
          <SearchPosition search={search} />
          <SearchCandidates search={search} onViewCandidates={handleViewCandidates} />
          <SearchActions onEdit={handleEdit} />
        </VStack>
      )}
    </ScreenContainer>
  )
}
