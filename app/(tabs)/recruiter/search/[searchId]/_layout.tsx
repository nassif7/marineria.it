import { Stack } from 'expo-router'
import { NavBar } from '@/lib/components'
import { useTranslation } from 'react-i18next'
import ContactSupport from '@/components/common/ContactSupport'
import { supportTeam } from '@/api'
import SearchProvider from '@/Providers/RecruiterSearchProvider'

export default function OfferDetailLayout() {
  const { t } = useTranslation(['screens-labels'])
  return (
    <SearchProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          header: (props) => (
            <NavBar
              {...props}
              rightAction={<ContactSupport title={t('contact-support', { ns: 'common' })} supportTeam={supportTeam} />}
            />
          ),
          contentStyle: { backgroundColor: 'white' },
        }}
      >
        {/* Offer details */}
        <Stack.Screen
          name="index"
          options={({ route }) => {
            const { params } = route
            const { searchId } = params as { searchId: string }
            return {
              headerShown: true,
              title: t('search'),
            }
          }}
        />

        {/* Crew section */}
        <Stack.Screen
          name="crew"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </SearchProvider>
  )
}
