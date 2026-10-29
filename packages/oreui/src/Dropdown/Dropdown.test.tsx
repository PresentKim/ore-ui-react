import { describe, expect, it, vi } from 'vitest'
import { createFacet } from '@react-facet/core'
import { fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { Dropdown } from './Dropdown'

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
  const optionEls = Array.from(view.container.querySelectorAll('.oui-dropdown-option')) as HTMLElement[]
  const visibleText = () =>
    Array.from(trigger.querySelectorAll('.oui-dropdown-current > *'))
      .filter((el) => (el as HTMLElement).style.display !== 'none')
      .map((el) => el.textContent)
      .join('')
  return { value, disabled, onChange, view, root, trigger, optionEls, visibleText }
}

describe('oreui Dropdown', () => {
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
