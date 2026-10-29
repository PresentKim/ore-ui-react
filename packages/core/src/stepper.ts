import type { ReactNode } from 'react'
import type { FacetProp } from './props'

export type StepperItem = {
  value: string
  label: ReactNode
}

export type StepperProps = {
  items: StepperItem[]
  value?: FacetProp<string | undefined>
  loop?: boolean
  disabled?: FacetProp<boolean>
  onChange?: (value: string) => void
}
