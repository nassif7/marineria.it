import React from 'react'
import { Text, TextStyle, StyleProp } from 'react-native'

interface Props {
  children: string
  style?: StyleProp<TextStyle>
}

const TAG_RE = /(<b>|<\/b>|<em>|<\/em>|<br\s*\/?>)/gi

// The backend embeds these tags directly in otherwise-plain-text fields (offer descriptions,
// crew skills/notes, etc). Any field that can carry them must render through HtmlText instead
// of a plain <Text>, or the tags leak into the UI as literal text — use this to check a field
// before deciding, or just to confirm a render site actually needs the switch.
export const hasHtmlMarkup = (value?: string | null): boolean => !!value && /<\/?(b|em|br)\b[^>]*>/i.test(value)

export default function HtmlText({ children, style }: Props) {
  const parts = children.split(TAG_RE)

  let bold = false
  let italic = false
  const nodes: React.ReactNode[] = []

  parts.forEach((part, i) => {
    if (!part) return
    const tag = part.toLowerCase().replace(/\s/g, '')
    if (tag === '<b>') {
      bold = true
      return
    }
    if (tag === '</b>') {
      bold = false
      return
    }
    if (tag === '<em>') {
      italic = true
      return
    }
    if (tag === '</em>') {
      italic = false
      return
    }
    if (tag === '<br/>' || tag === '<br>') {
      nodes.push('\n')
      return
    }

    const spanStyle: TextStyle = {}
    if (bold) spanStyle.fontWeight = 'bold'
    if (italic) spanStyle.fontStyle = 'italic'

    nodes.push(
      Object.keys(spanStyle).length > 0 ? (
        <Text key={i} style={spanStyle}>
          {part}
        </Text>
      ) : (
        part
      )
    )
  })

  return <Text style={style}>{nodes}</Text>
}
