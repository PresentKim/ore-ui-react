import { afterEach, describe, expect, it, vi } from 'vitest'
import { createFacet } from '@react-facet/core'
import { act, fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { Tutorial } from './Tutorial'

const rect = (x: number, y: number, w: number, h: number) =>
  ({ x, y, left: x, top: y, width: w, height: h, right: x + w, bottom: y + h }) as DOMRect

const mockRects = () =>
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    return this.classList.contains('oui-tutorial-card') ? rect(0, 0, 100, 40) : rect(50, 60, 30, 20)
  })

const steps = [
  { target: '#a', title: 'One', content: 'First' },
  { target: '#b', title: 'Two', content: 'Second' },
  { target: '#missing', title: 'Three', content: 'Third' },
]

const setup = (step: number, extra: { onChange?: (s: number) => void; onFinish?: () => void } = {}) => {
  document.body.innerHTML = '<div id="a"></div><div id="b"></div>'
  window.innerWidth = 400
  window.innerHeight = 300
  const view = render(<Tutorial steps={steps} step={step} {...extra} />)
  const q = (selector: string) => view.container.querySelector(selector) as HTMLElement
  const buttons = () => Array.from(view.container.querySelectorAll('.oui-button')) as HTMLElement[]
  return { view, q, buttons }
}

afterEach(() => vi.restoreAllMocks())

describe('oreui Tutorial', () => {
  it('highlight box matches the target rect', () => {
    mockRects()
    const { q } = setup(0)
    const box = q('.oui-tutorial-highlight')
    expect(box.style.left).toBe('50px')
    expect(box.style.top).toBe('60px')
    expect(box.style.width).toBe('30px')
    expect(box.style.height).toBe('20px')
  })

  it('shows title and content of the step', () => {
    mockRects()
    const { q } = setup(1)
    expect(q('.oui-tutorial-title').textContent).toBe('Two')
    expect(q('.oui-tutorial-content').textContent).toBe('Second')
  })

  it('places the card below the target', () => {
    mockRects()
    const { q } = setup(0)
    const card = q('.oui-tutorial-card')
    expect(card.style.left).toBe('15px')
    expect(card.style.top).toBe('80px')
  })

  it('missing_target shows the step centered', () => {
    mockRects()
    const { q } = setup(2)
    const card = q('.oui-tutorial-card')
    expect(q('.oui-tutorial-highlight')).toBeNull()
    expect(card.style.left).toBe('150px')
    expect(card.style.top).toBe('130px')
  })

  it('next and back call onChange with step +- 1', () => {
    mockRects()
    const onChange = vi.fn()
    const { buttons } = setup(1, { onChange })
    fireEvent.mouseDown(buttons()[0], { button: 0 })
    expect(onChange).toHaveBeenLastCalledWith(0)
    fireEvent.mouseDown(buttons()[1], { button: 0 })
    expect(onChange).toHaveBeenLastCalledWith(2)
  })

  it('back is inert on the first step', () => {
    mockRects()
    const onChange = vi.fn()
    const { buttons } = setup(0, { onChange })
    fireEvent.mouseDown(buttons()[0], { button: 0 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('last_step_finish calls onFinish and not onChange', () => {
    mockRects()
    const onChange = vi.fn()
    const onFinish = vi.fn()
    const { buttons, q } = setup(2, { onChange, onFinish })
    expect(buttons()[1].textContent).toBe('Finish')
    fireEvent.mouseDown(buttons()[1], { button: 0 })
    expect(onFinish).toHaveBeenCalledTimes(1)
    expect(onChange).not.toHaveBeenCalled()
    expect(q('.oui-tutorial')).not.toBeNull()
  })

  it('follows the step facet', () => {
    mockRects()
    document.body.innerHTML = '<div id="a"></div><div id="b"></div>'
    const step = createFacet({ initialValue: 0 })
    const { container } = render(<Tutorial steps={steps} step={step} />)
    act(() => step.set(1))
    expect(container.querySelector('.oui-tutorial-title')?.textContent).toBe('Two')
  })

  it('renders nothing for an out of range step', () => {
    mockRects()
    const { q } = setup(9)
    expect(q('.oui-tutorial')).toBeNull()
  })

  it('sizes the overlay in vw and vh, not percent', async () => {
    const fs = await vi.importActual<{ readFileSync: (path: string, encoding: string) => string }>('node:fs')
    const css = fs.readFileSync('packages/oreui/src/Tutorial/tutorial.css', 'utf8')
    const rule = css.slice(css.indexOf('.oui-tutorial {'), css.indexOf('}', css.indexOf('.oui-tutorial {')))
    expect(rule).toContain('100vw')
    expect(rule).toContain('100vh')
    expect(rule).not.toContain('%')
  })
})
