import { useEffect, useRef } from 'react'
import { useFacetEffect, useFacetMap, useFacetState } from '@react-facet/core'
import type { Facet } from '@react-facet/core'
import type { ReactNode } from 'react'
import type { FacetProp } from './props'
import { SCREEN_GAP, clampInto } from './tooltip'
import type { Rect, Size } from './tooltip'

export type DropdownOption = {
  value: string
  label: ReactNode
  disabled?: boolean
}

export type DropdownProps = {
  options: DropdownOption[]
  value?: FacetProp<string | undefined>
  placeholder?: ReactNode
  disabled?: FacetProp<boolean>
  onChange?: (value: string) => void
}

export type ListPlacement = { x: number; y: number; w: number; maxH: number | null }

export const placeList = (trigger: Rect, listHeight: number, view: Size, gap = 0): ListPlacement => {
  const x = clampInto(trigger.x, gap, view.w - gap - trigger.w)
  const bottom = trigger.y + trigger.h
  const roomBelow = Math.max(0, view.h - gap - bottom)
  const roomAbove = Math.max(0, trigger.y - gap)
  if (listHeight <= roomBelow || roomBelow >= roomAbove) {
    return { x, y: bottom, w: trigger.w, maxH: listHeight <= roomBelow ? null : roomBelow }
  }
  const height = Math.min(listHeight, roomAbove)
  return { x, y: trigger.y - height, w: trigger.w, maxH: listHeight <= roomAbove ? null : roomAbove }
}

type ListLayout = { display: string; left: string; top: string; width: string; maxHeight: string }

const HIDDEN: ListLayout = { display: 'none', left: '0px', top: '0px', width: '', maxHeight: '' }

export const useDropdownList = (open: Facet<boolean>, setOpen: (isOpen: boolean) => void) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [layout, setLayout] = useFacetState<ListLayout>(HIDDEN)

  useEffect(() => {
    const onOutside = (event: MouseEvent) => {
      if (event.target instanceof Node) {
        if (rootRef.current?.contains(event.target) || listRef.current?.contains(event.target)) return
      }
      setOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [setOpen])

  useFacetEffect(
    (isOpen) => {
      const trigger = triggerRef.current
      const list = listRef.current
      if (!isOpen || !trigger || !list) {
        setLayout(HIDDEN)
        return
      }
      const box = trigger.getBoundingClientRect()
      setLayout({ display: 'block', left: '0px', top: '0px', width: `${box.width}px`, maxHeight: '' })
      const placed = placeList(
        { x: box.left, y: box.top, w: box.width, h: box.height },
        list.getBoundingClientRect().height,
        { w: window.innerWidth, h: window.innerHeight },
        SCREEN_GAP,
      )
      setLayout({
        display: 'block',
        left: `${placed.x}px`,
        top: `${placed.y}px`,
        width: `${placed.w}px`,
        maxHeight: placed.maxH === null ? '' : `${placed.maxH}px`,
      })
    },
    [],
    [open],
  )

  return {
    rootRef,
    triggerRef,
    listRef,
    display: useFacetMap((current) => current.display, [], [layout]),
    left: useFacetMap((current) => current.left, [], [layout]),
    top: useFacetMap((current) => current.top, [], [layout]),
    width: useFacetMap((current) => current.width, [], [layout]),
    maxHeight: useFacetMap((current) => current.maxHeight, [], [layout]),
  }
}
