import type { ReactNode } from 'react'
import type { FacetProp } from './props'

export type DropdownOption = {
  value: string
  label: ReactNode
  disabled?: boolean
}

export type DropdownProps = {
  options: DropdownOption[]
  value?: FacetProp<string | undefined>
  placeholder?: ReactNode
  disabled?: FacetProp<boolean>
  onChange?: (value: string) => void
}
