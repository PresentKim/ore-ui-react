import type { ReactNode } from 'react'
import type { FacetProp } from './props'

export type RoundedButtonSize = 'small' | 'medium' | 'large'

export type RoundedButtonProps = {
  children?: ReactNode
  size?: RoundedButtonSize
  disabled?: FacetProp<boolean>
  onPress?: () => void
}
