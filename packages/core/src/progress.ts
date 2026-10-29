import type { FacetProp } from './props'

export type ProgressProps = {
  value: FacetProp<number>
}

export const clampPercent = (value: number) => Math.min(100, Math.max(0, value))

export const percentLabel = (value: number) => `${Math.round(clampPercent(value))}%`

export const halfDiscAngles = (value: number) => {
  const percent = clampPercent(value)
  return {
    first: -180 + Math.min(percent, 50) * 3.6,
    second: -180 + Math.max(percent - 50, 0) * 3.6,
  }
}
