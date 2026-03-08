import { FC } from 'react'
import { ActivityIndicator } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { getCrewList } from '@/api'
import { useUser } from '@/Providers/UserProvider'
import { Loading, Box, HStack, Text } from '@/components/ui'
import { List, NavBar, ScreenContainer, ErrorMessage } from '@/components/appUI'
import CrewListItem from './CrewListItem'
import ContactSupport from '@/components/common/ContactSupport'
import { supportTeam } from '@/api'
import CrewListEmptyComponent from './CrewListEmptyComponent'

const RightAction = ({ itemsCount, isLoading }: { itemsCount: number; isLoading: boolean }) => {
  const { t } = useTranslation()
  return (
    <HStack className="pr-3 items-center" space="xs">
      <Box className="bg-success-500 rounded-md w-6 h-6 items-center justify-center shrink-0">
        {isLoading && <ActivityIndicator size={4} color="white" />}
        {!isLoading && (
          <Text color="white" bold size="sm">
            {itemsCount}
          </Text>
        )}
      </Box>

      <ContactSupport title={t('contact-support', { ns: 'common' })} supportTeam={supportTeam} />
    </HStack>
  )
}

const CrewList: FC = () => {
  const {
    i18n: { language },
    t,
  } = useTranslation()

  const { searchId } = useLocalSearchParams()
  const { activeProfile } = useUser()
  const { token } = activeProfile as any

  const { isLoading, isSuccess, isError, isRefetching, refetch, data } = useQuery({
    queryKey: ['recruiter-crew-list', searchId],
    queryFn: () => getCrewList(searchId as string, token, language),
  })

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t('crew-list', { ns: 'screens-labels' }),
          contentStyle: { backgroundColor: 'white' },

          header: (props) => (
            <NavBar
              {...props} // pass what NavBar expects
              rightAction={<RightAction itemsCount={data?.length || 0} isLoading={isLoading || isRefetching} />}
              // You can pass other props if NavBar supports them, e.g. title, back button override, etc.
            />
          ),
        }}
      />
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

export default CrewList
