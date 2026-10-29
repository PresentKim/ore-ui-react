import type { CSSProperties, ReactNode } from 'react'
import type { FacetProp } from './props'

export type TextBlockVariant = 'title' | 'body' | 'caption'

export type TextBlockProps = {
  text?: FacetProp<string>
  children?: ReactNode
  variant?: TextBlockVariant
  className?: string
  style?: CSSProperties
}
