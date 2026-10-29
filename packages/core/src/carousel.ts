import type { ReactNode } from 'react'
import type { FacetProp } from './props'

export type CarouselProps = {
  children?: ReactNode
  page?: FacetProp<number>
  itemsPerPage?: number
  loop?: boolean
  onChange?: (page: number) => void
}

export const carouselPageCount = (itemCount: number, itemsPerPage: number): number =>
  Math.max(1, Math.ceil(itemCount / Math.max(1, itemsPerPage)))

export const trackOffset = (page: number, pageCount: number): string =>
  `translateX(${-(Math.max(1, Math.min(page, pageCount)) - 1) * 100}%)`
