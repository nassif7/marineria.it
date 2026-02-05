import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Feather from '@expo/vector-icons/Feather'
import { useRouter } from 'expo-router'
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

  return (
    <>
      <StatusBar translucent={true} style="light" />
      {/* <Box className="bg-secondary-900 px-4 py-3">
        <HStack className="items-center justify-between">
          {canGoBack ? (
            <Pressable onPress={() => navigation.goBack()} className="p-2 -ml-2 rounded-lg active:bg-white/10">
              <Icon as={ChevronLeft} size="xl" className="text-white" />
              <Text className="text-white absolute left-10 top-3">{back.title}</Text>
            </Pressable>
          ) : (
            <Box className="w-10" />
          )}

          {title && (
            <Text
              className="text-primary-500 text-lg font-bold absolute left-0 right-0 text-center"
              style={{ zIndex: -1 }}
            >
              {title}
            </Text>
          )}

          <Box className="w-10">{options.headerRight?.({ canGoBack })}</Box>
        </HStack>
      </Box> */}

      <Box className="bg-secondary-900 pt-3 pb-4 px-4 shadow-lg">
        <HStack className="items-center justify-between">
          {/* Left Side - Back Button */}
          {canGoBack ? (
            <Pressable onPress={() => router.back()} className="flex-row items-center gap-1 -ml-2">
              <Icon as={ChevronLeft} size="xl" className="text-white" />
              <Text className="text-white text-lg font-medium">{back.title}</Text>
            </Pressable>
          ) : (
            <Box className="w-20" /> // Spacer for alignment
          )}

          {/* Center - Title */}
          {title && (
            <Heading size="lg" className="text-white absolute left-0 right-0 text-center" style={{ zIndex: -1 }}>
              {title}
            </Heading>
          )}

          {/* Right Side - Action */}
          {/* {rightAction ? (
            <Box>{rightAction}</Box>
          ) : (
            <Box className="w-20" /> // Spacer for alignment
          )} */}
        </HStack>

        {/* Optional: Title below when back button is present */}
        {title && canGoBack && (
          <Box className="mt-2">
            <Text className="text-white/60 text-xs uppercase tracking-wide">{title}</Text>
          </Box>
        )}
      </Box>
    </>
  )
}

// import React from 'react'
// import { View, Text, TouchableOpacity, StatusBar } from 'react-native'
// import Feather from '@expo/vector-icons/Feather'
// import { useRouter } from 'expo-router'
// import { useTranslation } from 'react-i18next'
// import { Box, Heading, HStack, Pressable, Icon } from '@gluestack-ui/themed'
// import { ChevronLeft } from 'lucide-react-native'

// interface NavBarProps {
//   title?: string
//   showBackButton?: boolean
//   rightAction?: React.ReactNode
// }

// export const NavBar: React.FC<NavBarProps> = ({ title, showBackButton = true, rightAction }) => {
//   const router = useRouter()
//   const { t } = useTranslation()

//   return (
//     <>
//       <StatusBar barStyle="light-content" />
//          </>
//   )
// }
