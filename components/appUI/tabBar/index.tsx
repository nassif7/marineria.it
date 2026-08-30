import React from 'react'
import { Platform } from 'react-native'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { CommonActions } from '@react-navigation/native'
import { Box, HStack, VStack, Text, Pressable, Icon } from '@/components/ui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface TabBarProps extends BottomTabBarProps {
  showLabel?: boolean
}

const TabBar: React.FC<TabBarProps> = ({ state, descriptors, navigation, showLabel }) => {
  const insets = useSafeAreaInsets()

  // insets.bottom > 0 means the device already reserves space for system UI
  // (iOS home indicator, Android nav bar/gesture pill), which provides its own
  // visual separation — only add a manual buffer when there's no such reservation.
  const iosBottomPadding = insets.bottom > 0 ? 8 : 12
  const androidBottomPadding = insets.bottom > 12 ? insets.bottom - 12 : 8
  const bottomPadding = Platform.OS === 'ios' ? iosBottomPadding : androidBottomPadding

  return (
    <Box
      className="bg-white"
      style={{
        paddingBottom: bottomPadding,
      }}
    >
      <HStack className="items-center justify-around">
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
              // Reset the target tab's nested stack to its root before switching to it,
              // so that cross-tab deep-link navigations don't leave stale history.
              navigation.dispatch(
                CommonActions.reset({
                  ...state,
                  index,
                  routes: state.routes.map((r, i) => (i === index ? { name: r.name, key: r.key } : r)),
                })
              )
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
              className="items-center justify-center flex-1 py-3"
            >
              <VStack className="items-center gap-1">
                {options.tabBarIcon && (
                  <Icon
                    as={options.tabBarIcon}
                    size={isFocused ? '3xl' : '2xl'}
                    className={isFocused ? 'text-primary-600' : 'text-typography-600'}
                  />
                )}
                <Text
                  className={isFocused ? 'text-primary-600 text-sm font-semibold' : 'text-typography-600 text-xs'}
                  numberOfLines={1}
                >
                  {label}
                </Text>
              </VStack>
            </Pressable>
          )
        })}
      </HStack>
    </Box>
  )
}

export default TabBar

TabBar.displayName = 'TabBar'
