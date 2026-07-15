'use client'
import React from 'react'
import { RefreshControl as RNRefreshControl, RefreshControlProps } from 'react-native'
import { C } from '@/components/pro/tokens'

const RefreshControl = React.forwardRef<RNRefreshControl, RefreshControlProps>((props, ref) => (
  <RNRefreshControl ref={ref} tintColor={C.orange} colors={[C.orange]} {...props} />
))

RefreshControl.displayName = 'RefreshControl'

export { RefreshControl }
