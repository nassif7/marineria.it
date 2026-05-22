import { FC } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { ChevronLeft } from 'lucide-react-native'
import { getCrewList } from '@/api'
import { useUser } from '@/Providers/UserProvider'
import { Loading } from '@/components/ui'
import { List, ScreenContainer, ErrorMessage } from '@/components/appUI'
import { C } from '@/components/pro/tokens'
import CrewListItem from './CrewListItem'
import CrewListEmptyComponent from './CrewListEmptyComponent'

const CrewList: FC = () => {
  const {
    i18n: { language },
    t,
  } = useTranslation(['screens-labels'])

  const router = useRouter()
  const { searchId } = useLocalSearchParams()
  const { activeProfile } = useUser()
  const { token } = activeProfile as any

  const { isLoading, isSuccess, isError, isRefetching, refetch, data } = useQuery({
    queryKey: ['recruiter-crew-list', searchId],
    queryFn: () => getCrewList(searchId as string, token, language),
  })

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Inline header */}
      <View style={cl.header}>
        <Pressable style={cl.iconBtn} onPress={() => router.back()}>
          <ChevronLeft size={18} color={C.ink2} strokeWidth={2.2} />
        </Pressable>
        <Text style={cl.title}>{t('crew-list')}</Text>
        {isLoading || isRefetching ? (
          <View style={cl.countBadge} />
        ) : (
          <View style={cl.countBadge}>
            <Text style={cl.countText}>{data?.length ?? 0}</Text>
          </View>
        )}
      </View>

      <ScreenContainer>
        {(isLoading || isRefetching) && <Loading />}
        {isSuccess && (
          <List
            noHeader
            data={data}
            isRefetching={isRefetching}
            onRefresh={refetch}
            renderItem={({ item }) => <CrewListItem crew={item} key={item.userId} />}
            listEmptyComponent={<CrewListEmptyComponent />}
          />
        )}
        {isError && <ErrorMessage />}
      </ScreenContainer>
    </>
  )
}

const cl = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: C.bg,
    borderBottomWidth: 1,
    borderBottomColor: C.hair2,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 99,
    backgroundColor: C.field,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: C.ink,
    letterSpacing: -0.2,
  },
  countBadge: {
    minWidth: 28,
    height: 28,
    borderRadius: 99,
    backgroundColor: C.green,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  countText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
  },
})

export default CrewList
