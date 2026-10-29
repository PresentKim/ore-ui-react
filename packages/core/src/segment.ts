import type { ReactNode } from 'react'
import type { FacetProp } from './props'

export type SegmentOption = {
  value: string
  label: ReactNode
  disabled?: boolean
}

export type SegmentButtonProps = {
  value: string
  label: ReactNode
  active: FacetProp<boolean>
  disabled?: FacetProp<boolean>
  onPress?: (value: string) => void
}

export type SegmentProps = {
  options: SegmentOption[]
  value?: FacetProp<string | undefined>
  disabled?: FacetProp<boolean>
  onChange?: (value: string) => void
}
