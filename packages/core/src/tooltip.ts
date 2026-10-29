import { useRef } from 'react'
import { useFacetEffect, useFacetMap, useFacetState, useFacetWrap } from '@react-facet/core'
import type { Facet } from '@react-facet/core'
import type { ReactNode } from 'react'
import type { FacetProp } from './props'

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right'

export type Rect = { x: number; y: number; w: number; h: number }
export type Size = { w: number; h: number }
export type Placement = { x: number; y: number; side: TooltipSide }

export type TooltipProps = {
  content: ReactNode
  children?: ReactNode
  side?: TooltipSide
  open?: FacetProp<boolean>
}

const OPPOSITE: Record<TooltipSide, TooltipSide> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }

const clamp = (value: number, max: number) => Math.max(0, Math.min(value, max))

const anchor = (target: Rect, tip: Size, side: TooltipSide) => {
  const centerX = target.x + target.w / 2 - tip.w / 2
  const centerY = target.y + target.h / 2 - tip.h / 2
  if (side === 'right') return { x: target.x + target.w, y: centerY }
  if (side === 'left') return { x: target.x - tip.w, y: centerY }
  if (side === 'bottom') return { x: centerX, y: target.y + target.h }
  return { x: centerX, y: target.y - tip.h }
}

const overflows = (point: { x: number; y: number }, tip: Size, view: Size, side: TooltipSide) => {
  if (side === 'right') return point.x + tip.w > view.w
  if (side === 'left') return point.x < 0
  if (side === 'bottom') return point.y + tip.h > view.h
  return point.y < 0
}

export const placeTooltip = (target: Rect, tip: Size, view: Size, side: TooltipSide): Placement => {
  const wanted = anchor(target, tip, side)
  const flipped = overflows(wanted, tip, view, side)
  const finalSide = flipped ? OPPOSITE[side] : side
  const point = flipped ? anchor(target, tip, finalSide) : wanted
  return { x: clamp(point.x, view.w - tip.w), y: clamp(point.y, view.h - tip.h), side: finalSide }
}

export type TooltipBinding = {
  rootRef: { current: HTMLDivElement | null }
  tipRef: { current: HTMLDivElement | null }
  visibility: Facet<string>
  left: Facet<string>
  top: Facet<string>
  side: Facet<TooltipSide>
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export const useTooltip = (preferred: TooltipSide, open?: FacetProp<boolean>): TooltipBinding => {
  const rootRef = useRef<HTMLDivElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useFacetState(false)
  const [placement, setPlacement] = useFacetState<Placement>({ x: 0, y: 0, side: preferred })
  const openFacet = useFacetWrap(open ?? false)
  const controlled = open !== undefined

  const visible = useFacetMap((isHover, isOpen) => (controlled ? isOpen : isHover), [controlled], [hover, openFacet])
  const visibility = useFacetMap((isVisible) => (isVisible ? 'visible' : 'hidden'), [], [visible])
  const left = useFacetMap((place) => `${place.x}px`, [], [placement])
  const top = useFacetMap((place) => `${place.y}px`, [], [placement])
  const side = useFacetMap((place) => place.side, [], [placement])

  useFacetEffect(
    (isVisible) => {
      const root = rootRef.current
      const tip = tipRef.current
      if (!isVisible || !root || !tip) return
      const target = root.getBoundingClientRect()
      const size = tip.getBoundingClientRect()
      setPlacement(
        placeTooltip(
          { x: target.left, y: target.top, w: target.width, h: target.height },
          { w: size.width, h: size.height },
          { w: window.innerWidth, h: window.innerHeight },
          preferred,
        ),
      )
    },
    [preferred],
    [visible],
  )

  return {
    rootRef,
    tipRef,
    visibility,
    left,
    top,
    side,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
  }
}
