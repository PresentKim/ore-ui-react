import type { ReactNode } from 'react'
import type { FacetProp } from '@react-facet/core'

export type { FacetProp }

export type ButtonProps = {
  children?: ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: FacetProp<boolean>
  onPress?: () => void
}

export type CheckboxProps = {
  checked: FacetProp<boolean>
  label?: ReactNode
  disabled?: FacetProp<boolean>
  onChange?: (checked: boolean) => void
}

export type ToggleButtonProps = {
  value: FacetProp<boolean>
  disabled?: FacetProp<boolean>
  onChange?: (on: boolean) => void
}

export type SliderProps = {
  value: FacetProp<number>
  min?: number
  max?: number
  step?: number
  disabled?: FacetProp<boolean>
  onChange?: (value: number) => void
}
