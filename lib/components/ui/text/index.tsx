import React from 'react'

import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils'
import { Text as RNText } from 'react-native'
import { textStyle } from './styles'

type ITextProps = React.ComponentProps<typeof RNText> & VariantProps<typeof textStyle>

const Text = React.forwardRef<React.ElementRef<typeof RNText>, ITextProps>(
  (
    {
      className,
      isTruncated,
      bold,
      semiBold,
      underline,
      strikeThrough,
      size = 'md',
      sub,
      italic,
      highlight,
      shade = 600,
      uppercase,
      color = 'typography',
      ...props
    },
    ref
  ) => {
    const fontColor = color === 'white' ? 'text-white' : 'text-' + color + '-' + shade
    return (
      <RNText
        className={textStyle({
          isTruncated,
          bold,
          semiBold,
          underline,
          strikeThrough,
          size,
          sub,
          italic,
          highlight,
          uppercase,
          class: fontColor + ' ' + className,
        })}
        {...props}
        ref={ref}
      />
    )
  }
)

Text.displayName = 'Text'

export { Text }
