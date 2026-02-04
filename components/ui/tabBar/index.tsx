import React from 'react'
import { Platform } from 'react-native'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { Box, HStack, VStack, Text, Pressable } from '@/components/ui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface TabBarProps extends BottomTabBarProps {}

export const TabBar: React.FC<TabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets()

  return (
    <Box
      className="bg-secondary-900"
      style={{
        paddingBottom: Platform.OS === 'ios' ? insets.bottom : 8,
      }}
    >
      <HStack className="justify-around items-center">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]
          const isFocused = state.index === index
          const label = options.title ?? route.name

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            })

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params)
            }
          }

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            })
          }

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              className="flex-1 items-center justify-center py-3"
            >
              <VStack className="items-center gap-1">
                {/* Tab Icon */}
                {options.tabBarIcon &&
                  options.tabBarIcon({
                    focused: isFocused,
                    color: isFocused ? '#10b981' : '#9ca3af',
                    size: 24,
                  })}

                {/* <Text
                  className={isFocused ? 'text-primary-500 text-xs font-semibold' : 'text-gray-400 text-xs'}
                  numberOfLines={1}
                >
                  {label}
                </Text> */}
              </VStack>
            </Pressable>
          )
        })}
      </HStack>
    </Box>
  )
}
