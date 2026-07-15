import { FC } from 'react'
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Headphones } from 'lucide-react-native'
import { getRecruiterActiveSearchesPost, supportTeam } from '@/api'
import { useAppState, useManualRefresh } from '@/hooks'
import { useRecruiter } from '@/Providers/RecruiterProvider'
import { Loading, RefreshControl } from '@/components/ui'
import { EmptyList, ErrorMessage } from '@/components/appUI'
import { C } from '@/components/pro/tokens'
import { useQuery } from '@tanstack/react-query'
import ContactSupport from '@/components/common/ContactSupport'
import SearchListItem from './SearchListItem'

const RecruiterSearchList: FC = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation(['search-screen', 'screens-labels'])

  const state = useAppState()
  const { token } = useRecruiter()

  const { isLoading, isError, refetch, data } = useQuery({
    queryKey: ['recruiter-search-list', token, language],
    queryFn: () => getRecruiterActiveSearchesPost(token, language),
    enabled: state === 'active',
  })
  const { refreshing, onRefresh } = useManualRefresh(refetch)

  const searches = data ?? []

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {isLoading && <Loading />}
      {!isLoading && isError && <ErrorMessage />}

      {!isLoading && !isError && (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={sl.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View style={sl.header}>
            <Text style={sl.headerTitle}>{t('search-list', { ns: 'screens-labels' })}</Text>
            <ContactSupport
              title={t('contact-support', { ns: 'settings-screen' })}
              supportTeam={supportTeam}
              renderTrigger={({ onPress }) => (
                <Pressable style={sl.iconBtn} onPress={onPress}>
                  <Headphones size={18} color={C.ink2} strokeWidth={1.8} />
                </Pressable>
              )}
            />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.field,
    alignItems: 'center',
    justifyContent: 'center',
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
