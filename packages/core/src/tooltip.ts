import { useEffect, useRef } from 'react'
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

export const SCREEN_GAP = 6

const OPPOSITE: Record<TooltipSide, TooltipSide> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }

export const clampInto = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max))

const anchor = (target: Rect, tip: Size, side: TooltipSide) => {
  const centerX = target.x + target.w / 2 - tip.w / 2
  const centerY = target.y + target.h / 2 - tip.h / 2
  if (side === 'right') return { x: target.x + target.w, y: centerY }
  if (side === 'left') return { x: target.x - tip.w, y: centerY }
  if (side === 'bottom') return { x: centerX, y: target.y + target.h }
  return { x: centerX, y: target.y - tip.h }
}

const overflows = (point: { x: number; y: number }, tip: Size, view: Size, side: TooltipSide, gap: number) => {
  if (side === 'right') return point.x + tip.w > view.w - gap
  if (side === 'left') return point.x < gap
  if (side === 'bottom') return point.y + tip.h > view.h - gap
  return point.y < gap
}

export const placeTooltip = (target: Rect, tip: Size, view: Size, side: TooltipSide, gap = 0): Placement => {
  const wanted = anchor(target, tip, side)
  const flipped = overflows(wanted, tip, view, side, gap)
  const finalSide = flipped ? OPPOSITE[side] : side
  const point = flipped ? anchor(target, tip, finalSide) : wanted
  return {
    x: clampInto(point.x, gap, view.w - gap - tip.w),
    y: clampInto(point.y, gap, view.h - gap - tip.h),
    side: finalSide,
  }
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
  onTouchStart: () => void
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

  useEffect(() => {
    const onOutsideTouch = (event: TouchEvent) => {
      const root = rootRef.current
      if (root && event.target instanceof Node && root.contains(event.target)) return
      setHover(false)
    }
    document.addEventListener('touchstart', onOutsideTouch)
    return () => document.removeEventListener('touchstart', onOutsideTouch)
  }, [setHover])

  useFacetEffect(
    (isVisible) => {
      const root = rootRef.current
      const tip = tipRef.current
      if (!isVisible || !root || !tip) return
      setPlacement({ x: 0, y: 0, side: preferred })
      const target = root.getBoundingClientRect()
      const size = tip.getBoundingClientRect()
      setPlacement(
        placeTooltip(
          { x: target.left, y: target.top, w: target.width, h: target.height },
          { w: size.width, h: size.height },
          { w: window.innerWidth, h: window.innerHeight },
          preferred,
          SCREEN_GAP,
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
    onTouchStart: () => setHover(true),
  }
}
