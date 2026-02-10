// import React from 'react'
// import { Stack } from 'expo-router'
// import { NavBar } from '@/components/ui'

// const _layout = () => {
//   return (
//     <Stack screenOptions={{ contentStyle: { backgroundColor: 'rgb(30 41 59)' } }}>
//       <Stack.Screen
//         name="index" // pro/jobOffers
//         options={{
//           headerShown: false,
//         }}
//       />
//       <Stack.Screen
//         name="[offerId]" // pro/jobOffers/0009
//         options={{
//           header: (props) => {
//             return <NavBar showBackButton={true} />
//           },
//         }}
//       />
//       <Stack.Screen
//         name="jobOffer" // pro/jobOffers/jpbOffer
//         options={{
//           header: (props) => {
//             return <NavBar showBackButton={true} />
//           },
//         }}
//       />
//     </Stack>
//   )
// }

// export default _layout

import { Stack } from 'expo-router'
import { NavBar } from '@/components/ui'
import { useTranslation } from 'react-i18next'

export default function OffersLayout() {
  const { t } = useTranslation()
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        header: (props) => <NavBar {...props} />,
        contentStyle: { backgroundColor: 'rgb(30 41 59)' },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: t('crew-screens.offers-list'),
        }}
      />
      <Stack.Screen name="[offerId]" />
    </Stack>
  )
}
