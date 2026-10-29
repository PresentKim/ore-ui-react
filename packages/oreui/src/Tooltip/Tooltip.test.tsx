import { afterEach, describe, expect, it, vi } from 'vitest'
import { createFacet } from '@react-facet/core'
import { fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { placeTooltip } from '@ore-ui-react/core/src/tooltip'
import { Tooltip } from './Tooltip'

const mockRects = (target: DOMRect, tip: DOMRect) =>
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    return this.classList.contains('oui-tooltip-tip') ? tip : target
  })

const rect = (x: number, y: number, w: number, h: number) =>
  ({ x, y, left: x, top: y, width: w, height: h, right: x + w, bottom: y + h }) as DOMRect

afterEach(() => vi.restoreAllMocks())

describe('placeTooltip', () => {
  const view = { w: 400, h: 300 }
  const tip = { w: 50, h: 20 }

  it('places on the requested side', () => {
    expect(placeTooltip({ x: 10, y: 10, w: 20, h: 10 }, tip, view, 'right')).toEqual({ x: 30, y: 5, side: 'right' })
    expect(placeTooltip({ x: 100, y: 100, w: 20, h: 10 }, tip, view, 'bottom')).toEqual({ x: 85, y: 110, side: 'bottom' })
    expect(placeTooltip({ x: 100, y: 100, w: 20, h: 10 }, tip, view, 'top')).toEqual({ x: 85, y: 80, side: 'top' })
    expect(placeTooltip({ x: 100, y: 100, w: 20, h: 10 }, tip, view, 'left')).toEqual({ x: 50, y: 95, side: 'left' })
  })

  it('flip_on_overflow', () => {
    expect(placeTooltip({ x: 380, y: 10, w: 20, h: 10 }, tip, view, 'right')).toEqual({ x: 330, y: 5, side: 'left' })
    expect(placeTooltip({ x: 100, y: 285, w: 20, h: 10 }, tip, view, 'bottom').side).toBe('top')
    expect(placeTooltip({ x: 100, y: 5, w: 20, h: 10 }, tip, view, 'top').side).toBe('bottom')
    expect(placeTooltip({ x: 5, y: 100, w: 20, h: 10 }, tip, view, 'left').side).toBe('right')
  })

  it('clamp_into_view', () => {
    expect(placeTooltip({ x: 10, y: 2, w: 20, h: 10 }, tip, view, 'right')).toEqual({ x: 30, y: 0, side: 'right' })
    expect(placeTooltip({ x: 10, y: 295, w: 20, h: 10 }, tip, view, 'right').y).toBe(280)
    expect(placeTooltip({ x: 0, y: 100, w: 20, h: 10 }, tip, view, 'bottom').x).toBe(0)
    expect(placeTooltip({ x: 395, y: 100, w: 20, h: 10 }, tip, view, 'top').x).toBe(350)
  })
})

describe('oreui Tooltip', () => {
  const setup = (open?: ReturnType<typeof createFacet<boolean>>) => {
    const view = render(
      <Tooltip content="Hint" open={open}>
        <span>Target</span>
      </Tooltip>,
    )
    const root = view.container.querySelector('.oui-tooltip') as HTMLElement
    const tip = view.container.querySelector('.oui-tooltip-tip') as HTMLElement
    return { view, root, tip }
  }

  it('renders the content', () => {
    expect(setup().tip.textContent).toBe('Hint')
  })

  it('hover shows and mouseleave hides', () => {
    const { root, tip } = setup()
    expect(tip.style.visibility).toBe('hidden')
    fireEvent.mouseEnter(root)
    expect(tip.style.visibility).toBe('visible')
    fireEvent.mouseLeave(root)
    expect(tip.style.visibility).toBe('hidden')
  })

  it('open facet controls it', () => {
    const open = createFacet({ initialValue: false })
    const { root, tip } = setup(open)
    open.set(true)
    expect(tip.style.visibility).toBe('visible')
    fireEvent.mouseLeave(root)
    expect(tip.style.visibility).toBe('visible')
    open.set(false)
    expect(tip.style.visibility).toBe('hidden')
    fireEvent.mouseEnter(root)
    expect(tip.style.visibility).toBe('hidden')
  })

  it('positions on show', () => {
    mockRects(rect(10, 10, 20, 10), rect(0, 0, 50, 20))
    const { root, tip } = setup()
    fireEvent.mouseEnter(root)
    expect(tip.style.left).toBe('30px')
    expect(tip.style.top).toBe('5px')
  })

  it('flips left when no room on the right', () => {
    window.innerWidth = 400
    window.innerHeight = 300
    mockRects(rect(380, 10, 20, 10), rect(0, 0, 50, 20))
    const { root, tip } = setup()
    fireEvent.mouseEnter(root)
    expect(tip.style.left).toBe('330px')
    expect(tip.className).toContain('left')
  })
})
