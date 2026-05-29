import { FC } from 'react'
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native'
import { useTranslation } from 'react-i18next'
import { getRecruiterActiveSearchesPost } from '@/api'
import { useAppState } from '@/hooks'
import { useRecruiter } from '@/Providers/RecruiterProvider'
import { Loading } from '@/components/ui'
import { EmptyList, ErrorMessage } from '@/components/appUI'
import { C } from '@/components/pro/tokens'
import { useQuery } from '@tanstack/react-query'
import SearchListItem from './SearchListItem'

const RecruiterSearchList: FC = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation(['search-screen', 'screens-labels'])

  const state = useAppState()
  const { token } = useRecruiter()

  const { isLoading, isError, isRefetching, refetch, data } = useQuery({
    queryKey: ['recruiter-search-list', token, language],
    queryFn: () => getRecruiterActiveSearchesPost(token, language),
    enabled: state === 'active',
  })

  const searches = data ?? []

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {isLoading && <Loading />}
      {!isLoading && isError && <ErrorMessage />}

      {!isLoading && !isError && (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={sl.scrollContent}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        >
          <View style={sl.header}>
            <Text style={sl.headerTitle}>{t('search-list', { ns: 'screens-labels' })}</Text>
          </View>

          <View style={sl.list}>
            {searches.length === 0 ? (
              <EmptyList message={t('no-searches-active', { ns: 'search-screen' })} />
            ) : (
              searches.map((s) => <SearchListItem key={s.idoffer} search={s} />)
            )}
          </View>
        </ScrollView>
      )}
    </View>
  )
}

const sl = StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -0.6,
    lineHeight: 30,
  },
  list: {
    paddingHorizontal: 16,
    gap: 12,
  },
})

RecruiterSearchList.displayName = 'RecruiterSearchList'

export default RecruiterSearchList
