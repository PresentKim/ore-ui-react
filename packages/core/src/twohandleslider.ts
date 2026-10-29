import type { FacetProp } from './props'

export type TwoHandleSliderProps = {
  value: FacetProp<[number, number]>
  min?: number
  max?: number
  step?: number
  disabled?: FacetProp<boolean>
  onChange?: (value: [number, number]) => void
}
