import { useEffect, useRef, useState } from 'react'
import { useFacetUnwrap, useFacetWrap } from '@react-facet/core'
import type { ReactNode } from 'react'
import type { FacetProp } from './props'
import { placeTooltip } from './tooltip'
import type { Rect, Size } from './tooltip'

export type TutorialStep = { target: string; title: ReactNode; content: ReactNode }

export type TutorialProps = {
  steps: TutorialStep[]
  step: FacetProp<number>
  onChange?: (step: number) => void
  onFinish?: () => void
}

export type TutorialLayout = { highlight: Rect | null; card: { x: number; y: number } }

export const findTarget = (selector: string): Rect | null => {
  let element: Element | null = null
  try {
    element = document.querySelector(selector)
  } catch {
    return null
  }
  if (!element) return null
  const box = element.getBoundingClientRect()
  return { x: box.left, y: box.top, w: box.width, h: box.height }
}

export const placeCard = (target: Rect | null, card: Size, view: Size) => {
  if (!target) return { x: (view.w - card.w) / 2, y: (view.h - card.h) / 2 }
  const { x, y } = placeTooltip(target, card, view, 'bottom')
  return { x, y }
}

export const useTutorial = ({ steps, step, onChange, onFinish }: TutorialProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const unwrapped = useFacetUnwrap(useFacetWrap(step))
  const index = typeof unwrapped === 'number' ? unwrapped : 0
  const [layout, setLayout] = useState<TutorialLayout | null>(null)
  const current = steps[index]
  const isFirst = index <= 0
  const isLast = index >= steps.length - 1

  useEffect(() => {
    const card = cardRef.current
    if (!current || !card) return
    const target = findTarget(current.target)
    const box = card.getBoundingClientRect()
    setLayout({
      highlight: target,
      card: placeCard(target, { w: box.width, h: box.height }, { w: window.innerWidth, h: window.innerHeight }),
    })
  }, [current])

  return {
    cardRef,
    current,
    layout,
    isFirst,
    isLast,
    back: () => {
      if (!isFirst) onChange?.(index - 1)
    },
    next: () => {
      if (isLast) onFinish?.()
      else onChange?.(index + 1)
    },
  }
}
