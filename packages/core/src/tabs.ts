import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useFacetMap, useFacetWrap } from '@react-facet/core'
import type { Facet } from '@react-facet/core'
import type { FacetProp } from './props'
import { usePress } from './press'

export type TabsProps = {
  active: FacetProp<string>
  onChange?: (id: string) => void
  children?: ReactNode
}

export type TabLinkProps = {
  id: string
  children?: ReactNode
  disabled?: FacetProp<boolean>
}

export type TabProps = {
  id: string
  children?: ReactNode
}

export type TabsContextValue = {
  active: Facet<string>
  select: (id: string) => void
}

export const TabsContext = createContext<TabsContextValue | null>(null)

const useTabsContext = () => {
  const context = useContext(TabsContext)
  if (!context) throw new Error('Tab and TabLink must be inside Tabs')
  return context
}

export const useTabsValue = (active: FacetProp<string>, onChange?: (id: string) => void): TabsContextValue => ({
  active: useFacetWrap(active),
  select: (id) => onChange?.(id),
})

export const useTabLink = ({ id, disabled }: TabLinkProps) => {
  const { active, select } = useTabsContext()
  const isActive = useFacetMap((current) => current === id, [id], [active])
  const onMouseDown = usePress(() => select(id), disabled)
  return { isActive, onMouseDown }
}

export const useTabPanel = (id: string) => {
  const { active } = useTabsContext()
  return useFacetMap((current) => current === id, [id], [active])
}
