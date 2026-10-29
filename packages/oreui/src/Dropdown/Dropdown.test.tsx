import { afterEach, describe, expect, it, vi } from 'vitest'
import { createFacet } from '@react-facet/core'
import { cleanup, fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { LAYER_ID } from '@ore-ui-react/core/src/layer'
import { placeList } from '@ore-ui-react/core/src/dropdown'
import { Dropdown } from './Dropdown'

const rect = (x: number, y: number, w: number, h: number) =>
  ({ x, y, left: x, top: y, width: w, height: h, right: x + w, bottom: y + h }) as DOMRect

const mockRects = (trigger: DOMRect, list: DOMRect) =>
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    return this.classList.contains('oui-dropdown-list') ? list : trigger
  })

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta', disabled: true },
  { value: 'c', label: 'Gamma' },
]

const setup = (props: { value?: string; disabled?: boolean } = {}) => {
  const value = createFacet<string | undefined>({ initialValue: props.value })
  const disabled = createFacet({ initialValue: props.disabled ?? false })
  const onChange = vi.fn()
  const view = render(
    <Dropdown options={options} value={value} disabled={disabled} placeholder="Pick one" onChange={onChange} />,
  )
  const root = view.container.querySelector('.oui-dropdown') as HTMLElement
  const trigger = view.container.querySelector('.oui-dropdown-trigger') as HTMLElement
  const list = document.querySelector(`#${LAYER_ID} .oui-dropdown-list`) as HTMLElement
  const optionEls = Array.from(list.querySelectorAll('.oui-dropdown-option')) as HTMLElement[]
  const visibleText = () =>
    Array.from(trigger.querySelectorAll('.oui-dropdown-current > *'))
      .filter((el) => (el as HTMLElement).style.display !== 'none')
      .map((el) => el.textContent)
      .join('')
  return { value, disabled, onChange, view, root, trigger, list, optionEls, visibleText }
}

describe('placeList', () => {
  const view = { w: 400, h: 300 }

  it('goes below the trigger at its width', () => {
    expect(placeList({ x: 10, y: 10, w: 120, h: 30 }, 100, view, 6)).toEqual({ x: 10, y: 40, w: 120, maxH: null })
  })

  it('goes above when there is no room below', () => {
    expect(placeList({ x: 10, y: 240, w: 120, h: 30 }, 100, view, 6)).toEqual({ x: 10, y: 140, w: 120, maxH: null })
  })

  it('caps the height to the larger side', () => {
    expect(placeList({ x: 10, y: 100, w: 120, h: 30 }, 400, view, 6)).toEqual({ x: 10, y: 130, w: 120, maxH: 164 })
    expect(placeList({ x: 10, y: 200, w: 120, h: 30 }, 400, view, 6)).toEqual({ x: 10, y: 6, w: 120, maxH: 194 })
  })

  it('clamps inside the screen width', () => {
    expect(placeList({ x: 350, y: 10, w: 120, h: 30 }, 100, view, 6).x).toBe(274)
  })
})

describe('oreui Dropdown', () => {
  it('renders the list in the layer and an option press there selects it', () => {
    const { view, root, trigger, list, optionEls, onChange } = setup()
    expect(view.container.querySelector('.oui-dropdown-list')).toBeNull()
    fireEvent.mouseDown(trigger, { button: 0 })
    expect(list.style.display).toBe('block')
    fireEvent.mouseDown(optionEls[0], { button: 0 })
    expect(onChange).toHaveBeenCalledWith('a')
    expect(root.className).not.toContain('open')
    expect(list.style.display).toBe('none')
  })

  it('a press on the list outside an option keeps it open', () => {
    const { root, trigger, list } = setup()
    fireEvent.mouseDown(trigger, { button: 0 })
    fireEvent.mouseDown(list, { button: 0 })
    expect(root.className).toContain('open')
  })

  it('places the list below the trigger at its width', () => {
    window.innerWidth = 400
    window.innerHeight = 300
    mockRects(rect(20, 30, 150, 32), rect(0, 0, 150, 80))
    const { trigger, list } = setup()
    fireEvent.mouseDown(trigger, { button: 0 })
    expect(list.style.left).toBe('20px')
    expect(list.style.top).toBe('62px')
    expect(list.style.width).toBe('150px')
    expect(list.style.maxHeight).toBe('')
  })

  it('places the list above the trigger near the bottom', () => {
    window.innerWidth = 400
    window.innerHeight = 300
    mockRects(rect(20, 250, 150, 32), rect(0, 0, 150, 80))
    const { trigger, list } = setup()
    fireEvent.mouseDown(trigger, { button: 0 })
    expect(list.style.top).toBe('170px')
  })

  it('press opens and closes', () => {
    const { root, trigger } = setup()
    fireEvent.mouseDown(trigger, { button: 0 })
    expect(root.className).toContain('open')
    fireEvent.mouseDown(trigger, { button: 0 })
    expect(root.className).not.toContain('open')
  })

  it('choosing calls onChange and closes', () => {
    const { root, trigger, optionEls, onChange } = setup()
    fireEvent.mouseDown(trigger, { button: 0 })
    fireEvent.mouseDown(optionEls[2], { button: 0 })
    expect(onChange).toHaveBeenCalledWith('c')
    expect(root.className).not.toContain('open')
  })

  it('trigger shows the label of value or the placeholder', () => {
    const { value, visibleText } = setup()
    expect(visibleText()).toBe('Pick one')
    value.set('a')
    expect(visibleText()).toBe('Alpha')
  })

  it('selected option has class on', () => {
    const { value, optionEls } = setup({ value: 'c' })
    expect(optionEls[2].classList.contains('on')).toBe(true)
    value.set('a')
    expect(optionEls[0].classList.contains('on')).toBe(true)
    expect(optionEls[2].classList.contains('on')).toBe(false)
  })

  it('outside_closes', () => {
    const { root, trigger } = setup()
    fireEvent.mouseDown(trigger, { button: 0 })
    fireEvent.mouseDown(document.body, { button: 0 })
    expect(root.className).not.toContain('open')
  })

  it('mousedown inside keeps it open', () => {
    const { root, trigger } = setup()
    fireEvent.mouseDown(trigger, { button: 0 })
    fireEvent.mouseDown(root, { button: 0 })
    expect(root.className).toContain('open')
  })

  it('disabled_option_ignored', () => {
    const { root, trigger, optionEls, onChange } = setup()
    fireEvent.mouseDown(trigger, { button: 0 })
    fireEvent.mouseDown(optionEls[1], { button: 0 })
    expect(onChange).not.toHaveBeenCalled()
    expect(root.className).toContain('open')
  })

  it('disabled dropdown does not open', () => {
    const { root, trigger, disabled } = setup()
    disabled.set(true)
    expect(root.className).toContain('disabled')
    fireEvent.mouseDown(trigger, { button: 0 })
    expect(root.className).not.toContain('open')
  })

  it('right button ignored', () => {
    const { root, trigger } = setup()
    fireEvent.mouseDown(trigger, { button: 2 })
    expect(root.className).not.toContain('open')
  })

  it('listener_cleanup', () => {
    const add = vi.spyOn(document, 'addEventListener')
    const remove = vi.spyOn(document, 'removeEventListener')
    const { view } = setup()
    const added = add.mock.calls.filter(([type]) => type === 'mousedown')
    expect(added.length).toBeGreaterThan(0)
    view.unmount()
    const removed = remove.mock.calls.filter(([type]) => type === 'mousedown')
    for (const [, listener] of added) {
      expect(removed.some(([, l]) => l === listener)).toBe(true)
    }
    add.mockRestore()
    remove.mockRestore()
  })
})
