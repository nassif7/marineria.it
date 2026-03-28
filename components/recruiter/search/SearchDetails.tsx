import React from 'react'
import { Linking } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { VStack } from '@/components/ui'
import { Loading } from '@/components/ui/loading'
import { useActiveProfile } from '@/Providers/UserProvider'
import { useTranslation } from 'react-i18next'
import SearchHeader from './searchDetails/SearchHeader'
import SearchContract from './searchDetails/SearchContract'
import SearchPosition from './searchDetails/SearchPosition'
import SearchCandidates from './searchDetails/SearchCandidates'
import SearchActions from './searchDetails/SearchActions'
import { ScreenContainer, ErrorMessage } from '@/components/appUI'
import { useRecruiterSearch } from '@/Providers/RecruiterSearchProvider'

export default function SearchDetails() {
  const { token } = useActiveProfile()
  const {
    i18n: { language },
  } = useTranslation()

  const { searchId } = useLocalSearchParams()
  const router = useRouter()

  const {
    search: { data: search, isLoading, isRefetching, isError, isSuccess, refetch },
  } = useRecruiterSearch()

  const handleEdit = () => {
    const url = `https://www.marineria.it/${language}/rec/Post.aspx?idofferta=${search?.idoffer}&token=${token}`
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
        <ErrorMessage />
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
