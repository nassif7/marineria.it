// import React from 'react'
// import { Stack } from 'expo-router'

// export default function RecruiterLayout() {
//   return (
//     <Stack
//       screenOptions={{
//         contentStyle: { backgroundColor: 'rgb(30 41 59)' },
//         headerShown: false, // Let nested layouts handle headers
//       }}
//     >
//       <Stack.Screen name="index" />
//       <Stack.Screen name="offers" />
//       <Stack.Screen name="crew" />
//     </Stack>
//   )
// }

// app/(tabs)/recruiterScreens/_layout.tsx
import { Stack } from 'expo-router'

export default function RecruiterLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'rgb(248 250 252)' },
        animation: 'slide_from_right', // iOS-style slide
        animationDuration: 300, // Milliseconds (default is 350)
        animationTypeForReplace: 'push',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Recruiter' }} />
      <Stack.Screen name="search" options={{ title: 'Search Id' }} />
    </Stack>
  )
}
