import type { ReactNode } from 'react'
import type { FacetProp } from './props'

export type RadioOption = {
  value: string
  label: ReactNode
  disabled?: boolean
}

export type RadioProps = {
  value: string
  label?: ReactNode
  selected: FacetProp<boolean>
  disabled?: FacetProp<boolean>
  onPress?: (value: string) => void
}

export type RadioGroupProps = {
  options: RadioOption[]
  value?: FacetProp<string | undefined>
  disabled?: FacetProp<boolean>
  onChange?: (value: string) => void
}
