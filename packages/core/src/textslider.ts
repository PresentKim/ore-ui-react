import type { FacetProp } from './props'

export type TextSliderProps = {
  values: string[]
  value?: FacetProp<string | undefined>
  disabled?: FacetProp<boolean>
  onChange?: (value: string) => void
}

export const indexOfValue = (values: string[], value: string | undefined): number => Math.max(0, values.indexOf(value ?? ''))
