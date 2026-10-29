import type { ReactNode } from 'react'
import type { Facet } from '@react-facet/core'
import type { FacetProp } from './props'

export type Bindings = Record<string, string | null>
export type ConflictPolicy = 'replace' | 'swap' | 'block'

export type KeybindsProps = {
  bindings: FacetProp<Bindings>
  conflict?: ConflictPolicy
  placeholder?: ReactNode
  listeningText?: ReactNode
  disabled?: FacetProp<boolean>
  onChange?: (bindings: Bindings) => void
  children?: ReactNode
}

export type KeybindProps = {
  action: string
  label?: ReactNode
}

export type KeybindsContextValue = {
  bindings: Facet<Bindings>
  listening: Facet<string | null>
  disabled: Facet<boolean>
  placeholder: ReactNode
  listeningText: ReactNode
  toggle: (action: string) => void
}

export const resolveBinding = (
  bindings: Bindings,
  action: string,
  key: string,
  conflict: ConflictPolicy,
): Bindings => {
  const holder = Object.keys(bindings).find((other) => other !== action && bindings[other] === key)
  if (holder === undefined) return { ...bindings, [action]: key }
  if (conflict === 'block') return bindings
  if (conflict === 'swap') return { ...bindings, [holder]: bindings[action] ?? null, [action]: key }
  return { ...bindings, [holder]: null, [action]: key }
}

export const keyLabel = (event: { code: string }): string => {
  if (event.code.startsWith('Key')) return event.code.slice(3)
  if (event.code.startsWith('Digit')) return event.code.slice(5)
  return event.code
}

export const mouseLabel = (button: number): string => `Mouse${button + 1}`
