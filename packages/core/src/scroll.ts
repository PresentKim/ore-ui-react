import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useFacetMap, useFacetState } from '@react-facet/core'
import type { Facet } from '@react-facet/core'

export type ScrollProps = {
  children?: ReactNode
  end?: boolean
  minThumb?: number
}

export type Thumb = { top: number; height: number }

const MIN_THUMB = 10

export const thumbOf = (scrollTop: number, viewH: number, contentH: number, trackH: number, minThumb: number): Thumb => {
  if (contentH <= viewH) return { top: 0, height: trackH }
  const height = Math.min(trackH, Math.max(minThumb, (trackH * viewH) / contentH))
  const top = ((trackH - height) * scrollTop) / (contentH - viewH)
  return { top, height }
}

type Bar = { visible: boolean; top: number; height: number }

export type ScrollBinding = {
  contentRef: { current: HTMLDivElement | null }
  barRef: { current: HTMLDivElement | null }
  display: Facet<string>
  top: Facet<string>
  height: Facet<string>
  onHandleMouseDown: (event: MouseEvent) => void
  onBarMouseDown: (event: MouseEvent) => void
}

export const useScroll = (end: boolean, minThumb = MIN_THUMB): ScrollBinding => {
  const contentRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const stuckRef = useRef(true)
  const handleTopRef = useRef(0)
  const detachRef = useRef<(() => void) | null>(null)
  const [bar, setBar] = useFacetState<Bar>({ visible: false, top: 0, height: 0 })

  const display = useFacetMap((state) => (state.visible ? 'flex' : 'none'), [], [bar])
  const top = useFacetMap((state) => `${Math.round(state.top)}px`, [], [bar])
  const height = useFacetMap((state) => `${Math.round(state.height)}px`, [], [bar])

  const update = () => {
    const content = contentRef.current
    const track = barRef.current
    if (!content || !track) return
    const view = content.clientHeight
    const full = content.scrollHeight
    if (full <= view + 1) {
      setBar({ visible: false, top: 0, height: 0 })
      return
    }
    const thumb = thumbOf(content.scrollTop, view, full, track.clientHeight, minThumb)
    handleTopRef.current = thumb.top
    setBar({ visible: true, ...thumb })
  }

  const syncStuck = () => {
    const content = contentRef.current
    if (content) stuckRef.current = content.scrollTop + content.clientHeight >= content.scrollHeight - 1
  }

  useEffect(() => {
    const content = contentRef.current
    if (!content) return
    if (end) content.scrollTop = content.scrollHeight
    syncStuck()
    update()

    const onScroll = () => {
      syncStuck()
      update()
    }
    const onWheel = (event: WheelEvent) => {
      content.scrollTop += event.deltaY
      event.preventDefault()
      onScroll()
    }
    const onGrow = () => {
      if (end && stuckRef.current) content.scrollTop = content.scrollHeight
      update()
    }

    content.addEventListener('scroll', onScroll)
    content.addEventListener('wheel', onWheel)
    const observer = typeof MutationObserver === 'undefined' ? null : new MutationObserver(onGrow)
    observer?.observe(content, { childList: true, subtree: true, characterData: true })
    window.addEventListener('resize', onGrow)

    return () => {
      content.removeEventListener('scroll', onScroll)
      content.removeEventListener('wheel', onWheel)
      observer?.disconnect()
      window.removeEventListener('resize', onGrow)
      detachRef.current?.()
    }
  }, [end, minThumb])

  const onHandleMouseDown = (event: MouseEvent) => {
    const content = contentRef.current
    const track = barRef.current
    if (event.button !== 0 || !content || !track) return
    event.stopPropagation()
    detachRef.current?.()
    const startY = event.clientY
    const startTop = content.scrollTop

    const onMove = (move: MouseEvent) => {
      const full = content.scrollHeight
      const view = content.clientHeight
      const thumb = thumbOf(startTop, view, full, track.clientHeight, minThumb)
      const room = track.clientHeight - thumb.height
      if (room <= 0) return
      content.scrollTop = startTop + ((move.clientY - startY) * (full - view)) / room
      syncStuck()
      update()
    }
    const detach = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', detach)
      detachRef.current = null
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', detach)
    detachRef.current = detach
  }

  const onBarMouseDown = (event: MouseEvent) => {
    const content = contentRef.current
    const track = barRef.current
    if (event.button !== 0 || !content || !track) return
    const rect = track.getBoundingClientRect()
    const handleTop = rect.top + handleTopRef.current
    content.scrollTop += event.clientY < handleTop ? -content.clientHeight : content.clientHeight
    syncStuck()
    update()
  }

  return { contentRef, barRef, display, top, height, onHandleMouseDown, onBarMouseDown }
}
