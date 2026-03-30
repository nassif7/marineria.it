import React from 'react'
import { config } from './config'
import { ColorSchemeName, useColorScheme, View, ViewProps } from 'react-native'
import { OverlayProvider } from '@gluestack-ui/core/overlay/creator'
import { ToastProvider } from '@gluestack-ui/core/toast/creator'
import { colorScheme as colorSchemeNW } from 'nativewind'

type ModeType = 'light' | 'dark' | 'system'

const getColorSchemeName = (colorScheme: ColorSchemeName, mode: ModeType): 'light' | 'dark' => {
  if (mode === 'system') {
    return colorScheme ?? 'light'
  }
  return mode
}

export function ThemeUIProvider({
  mode = 'light',
  ...props
}: {
  mode?: 'light' | 'dark' | 'system'
  children?: React.ReactNode
  style?: ViewProps['style']
}) {
  const colorScheme = useColorScheme()

  const colorSchemeName = getColorSchemeName(colorScheme, mode)

  colorSchemeNW.set(mode)

  return (
    <View style={[config['light'], { flex: 1, height: '100%', width: '100%' }, props.style]}>
      <OverlayProvider>
        <ToastProvider>{props.children}</ToastProvider>
      </OverlayProvider>
    </View>
  )
}
