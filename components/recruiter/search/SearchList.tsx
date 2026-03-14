import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { getRecruiterActiveSearches } from '@/api'
import { useAppState } from '@/hooks'
import { useUser, ActiveProfile } from '@/Providers/UserProvider'
import { Loading, Text } from '@/components/ui'
import SearchListItem from './SearchListItem'
import { useQuery } from '@tanstack/react-query'
import { List, ScreenContainer, EmptyList } from '@/components/appUI'
import { ErrorMessage } from '@/components/appUI'

const RecruiterSearchList: FC = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation()
  const state = useAppState()
  const { activeProfile } = useUser()
  const { token } = activeProfile as ActiveProfile

  const { isLoading, isSuccess, isError, isRefetching, refetch, data } = useQuery({
    queryKey: ['recruiter-search-list'],
    queryFn: () => getRecruiterActiveSearches(token, language),
    enabled: state === 'active',
  })

  return (
    <ScreenContainer>
      {(isLoading || isRefetching) && <Loading />}
      {isSuccess && (
        <List
          noHeader
          data={data}
          isRefetching={isRefetching}
          onRefresh={refetch}
          renderItem={({ item }) => <SearchListItem search={item} key={item.reference} />}
          listEmptyComponent={<EmptyList message={t('no-searches')} />}
        />
      )}
      {isError && <ErrorMessage />}
    </ScreenContainer>
  )
}

RecruiterSearchList.displayName = 'RecruiterSearchList'

export default RecruiterSearchList
