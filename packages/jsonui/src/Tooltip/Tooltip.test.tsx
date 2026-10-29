import { afterEach, describe, expect, it, vi } from 'vitest'
import { createFacet } from '@react-facet/core'
import { cleanup, fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { LAYER_ID } from '@ore-ui-react/core/src/layer'
import { Tooltip } from './Tooltip'

const rect = (x: number, y: number, w: number, h: number) =>
  ({ x, y, left: x, top: y, width: w, height: h, right: x + w, bottom: y + h }) as DOMRect

const mockRects = (target: DOMRect, tip: DOMRect) =>
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    return this.classList.contains('jui-tooltip-tip') ? tip : target
  })

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('jsonui Tooltip', () => {
  const setup = (open?: ReturnType<typeof createFacet<boolean>>) => {
    const view = render(
      <Tooltip content="Hint" open={open}>
        <span className="target">Target</span>
      </Tooltip>,
    )
    const root = view.container.querySelector('.jui-tooltip') as HTMLElement
    const tip = document.querySelector(`#${LAYER_ID} .jui-tooltip-tip`) as HTMLElement
    return { view, root, tip }
  }

  it('renders the content in the layer', () => {
    const { view, tip } = setup()
    expect(tip.textContent).toBe('Hint')
    expect(view.container.querySelector('.jui-tooltip-tip')).toBeNull()
  })

  it('hover shows and mouseleave hides', () => {
    const { root, tip } = setup()
    expect(tip.style.visibility).toBe('hidden')
    fireEvent.mouseEnter(root)
    expect(tip.style.visibility).toBe('visible')
    fireEvent.mouseLeave(root)
    expect(tip.style.visibility).toBe('hidden')
  })

  it('touchstart on the target shows and a touchstart elsewhere hides', () => {
    const { root, tip } = setup()
    fireEvent.touchStart(root.querySelector('.target') as HTMLElement)
    expect(tip.style.visibility).toBe('visible')
    fireEvent.touchStart(document.body)
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
    fireEvent.mouseEnter(root)
    expect(tip.style.visibility).toBe('hidden')
  })

  it('flip_on_overflow and clamp_into_view', () => {
    window.innerWidth = 400
    window.innerHeight = 300
    mockRects(rect(380, 2, 20, 10), rect(0, 0, 50, 20))
    const { root, tip } = setup()
    fireEvent.mouseEnter(root)
    expect(tip.style.left).toBe('330px')
    expect(tip.style.top).toBe('6px')
    expect(tip.className).toContain('left')
  })
})
