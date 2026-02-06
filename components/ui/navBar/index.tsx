import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Feather from '@expo/vector-icons/Feather'
import { useRouter, usePathname } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Box, Heading, HStack, Pressable, Icon } from '@/components/ui'
import { ChevronLeft } from 'lucide-react-native'
import { StatusBar } from 'expo-status-bar'
import type { NativeStackHeaderProps } from '@react-navigation/native-stack'

interface NavBarProps {
  title?: string
  showBackButton?: boolean
  rightAction?: React.ReactNode
}

export const NavBar = ({ navigation, route, options, back }: NativeStackHeaderProps) => {
  const title = options.title
  const canGoBack = back !== undefined

  const router = useRouter()
  const { t } = useTranslation()

  const pathname = usePathname()

  return (
    <>
      <StatusBar translucent={true} style="light" />
      <Box className="bg-secondary-800 px-4 py-3 shadow-lg">
        {/* <Box className="bg-secondary-900 px-4 py-3"> */}

        <HStack className="items-center justify-between min-h-[40px]">
          {canGoBack ? (
            <Pressable onPress={() => router.back()} className="flex-row items-center gap-1 -ml-2">
              <Icon as={ChevronLeft} size="xl" className="text-white" />
              <Text className="text-white text-base font-medium">{back.title}</Text>
            </Pressable>
          ) : (
            <Box className="w-20" />
          )}

          {title && (
            <Heading
              size="lg"
              className="text-primary-400 absolute left-0 right-0 text-center font-semibold"
              style={{ zIndex: -1 }}
            >
              {title}
            </Heading>
          )}
        </HStack>
      </Box>
    </>
  )
}

// {
//   /* Right Side - Action */
// }
// {
//   /* {rightAction ? (
//             <Box>{rightAction}</Box>
//           ) : (
//             <Box className="w-20" /> // Spacer for alignment
//           )} */
// }

// import React from 'react'
// import { StatusBar } from 'expo-status-bar'
// import type { NativeStackHeaderProps } from '@react-navigation/native-stack'
// import { Box, Text, Heading, HStack, Pressable, Icon } from '@gluestack-ui/themed'
// import { ChevronLeft } from 'lucide-react-native'
// import { useRouter } from 'expo-router'

// export const NavBar = ({ navigation, route, options, back }: NativeStackHeaderProps) => {
//   const router = useRouter()
//   const title = options.title
//   const canGoBack = back !== undefined

//   return (
//     <>
//       <StatusBar style="light" backgroundColor="#1e293b" />
//       <Box className="bg-secondary-900 px-4 py-3">
//         <HStack className="items-center justify-between min-h-[40px]">
//           {canGoBack ? (
//             <Pressable onPress={() => router.back()} className="p-2 -ml-2 rounded-lg active:bg-white/10">
//               <Icon as={ChevronLeft} size="xl" className="text-white" />
//             </Pressable>
//           ) : (
//             <Box className="w-10" />
//           )}

//           {title && (
//             <Text
//               className="text-primary-500 text-lg font-bold absolute left-0 right-0 text-center"
//               style={{ zIndex: -1 }}
//             >
//               {title}
//             </Text>
//           )}

//           <Box className="w-10" />
//         </HStack>
//       </Box>
//     </>
//   )
// }
