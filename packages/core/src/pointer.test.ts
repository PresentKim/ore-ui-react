import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@react-facet/dom-fiber-testing-library'
import { isMouseFromTouch, isPrimaryPress, pointOf, trackDrag } from './pointer'

const mouse = (init: MouseEventInit) => new MouseEvent('mousedown', init)

const touch = (type: string, x: number, y: number) => {
  const event = new Event(type) as TouchEvent
  Object.defineProperty(event, 'touches', { value: [{ clientX: x, clientY: y }] })
  return event
}

describe('pointer', () => {
  afterEach(() => vi.useRealTimers())

  it('takes the left button, a missing button and touches as primary', () => {
    expect(isPrimaryPress(mouse({ button: 0 }))).toBe(true)
    expect(isPrimaryPress(mouse({ button: 2 }))).toBe(false)
    expect(isPrimaryPress(touch('touchstart', 0, 0))).toBe(true)
  })

  it('reads the point from the first touch', () => {
    expect(pointOf(touch('touchmove', 4, 7))).toEqual({ clientX: 4, clientY: 7 })
    const event = mouse({ clientX: 3, clientY: 5 })
    expect(pointOf(event).clientX).toBe(3)
  })

  it('marks a mousedown shortly after a touch', () => {
    vi.useFakeTimers()
    vi.setSystemTime(10_000)
    expect(isMouseFromTouch(mouse({ button: 0 }))).toBe(false)
    document.dispatchEvent(touch('touchstart', 0, 0))
    expect(isMouseFromTouch(mouse({ button: 0 }))).toBe(true)
    vi.setSystemTime(11_000)
    expect(isMouseFromTouch(mouse({ button: 0 }))).toBe(false)
  })

  it('follows mouse and touch moves until release', () => {
    const moves: number[] = []
    const onEnd = vi.fn()
    trackDrag((point) => moves.push(point.clientX), onEnd)
    fireEvent.mouseMove(document, { clientX: 1 })
    document.dispatchEvent(touch('touchmove', 2, 0))
    document.dispatchEvent(touch('touchend', 0, 0))
    fireEvent.mouseMove(document, { clientX: 9 })
    expect(moves).toEqual([1, 2])
    expect(onEnd).toHaveBeenCalledTimes(1)
  })
})
