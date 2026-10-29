import type { ReactNode } from 'react'
import type { Facet } from '@react-facet/core'
import type { FacetProp } from './props'

export type AccordionProps = {
  multiple?: boolean
  expanded?: FacetProp<string[]>
  defaultExpanded?: string[]
  disabled?: FacetProp<boolean>
  onChange?: (expanded: string[]) => void
  children?: ReactNode
}

export type AccordionItemProps = {
  id: string
  title: ReactNode
  disabled?: FacetProp<boolean>
  children?: ReactNode
}

export type AccordionContextValue = {
  expanded: Facet<string[]>
  disabled: Facet<boolean>
  toggle: (id: string) => void
}
