import type { FacetProp } from './props'

export type PaginationProps = {
  pageCount: number
  page?: FacetProp<number>
  windowSize?: number
  loop?: boolean
  disabled?: FacetProp<boolean>
  onChange?: (page: number) => void
}

export const pageWindow = (page: number, pageCount: number, size: number): number[] => {
  const length = Math.max(0, Math.min(size, pageCount))
  const first = Math.max(1, Math.min(page - Math.floor(size / 2), pageCount - length + 1))
  return Array.from({ length }, (_, index) => first + index)
}

export const stepPage = (page: number, pageCount: number, step: 1 | -1, loop: boolean): number | undefined => {
  const next = page + step
  if (next >= 1 && next <= pageCount) return next
  if (!loop || pageCount < 1) return undefined
  return next < 1 ? pageCount : 1
}
