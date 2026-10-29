import { describe, expect, it, vi } from 'vitest'
import { createFacet } from '@react-facet/core'
import { fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { Checkbox } from './Checkbox'

const setup = (initial = false, disabledInitial = false) => {
  const checked = createFacet({ initialValue: initial })
  const disabled = createFacet({ initialValue: disabledInitial })
  const onChange = vi.fn()
  const view = render(<Checkbox checked={checked} disabled={disabled} onChange={onChange} label="Fancy" />)
  const root = view.container.querySelector('.jui-checkbox') as HTMLElement
  const box = view.container.querySelector('.jui-checkbox-box') as HTMLElement
  return { checked, disabled, onChange, view, root, box }
}

describe('jsonui Checkbox', () => {
  it('box class follows checked', () => {
    const { checked, box } = setup(true)
    expect(box.classList.contains('on')).toBe(true)
    checked.set(false)
    expect(box.classList.contains('off')).toBe(true)
    expect(box.classList.contains('on')).toBe(false)
  })

  it('renders the label', () => {
    const { root } = setup()
    expect(root.textContent).toBe('Fancy')
  })

  it('controlled', () => {
    const { root, box, checked, onChange } = setup(false)
    fireEvent.mouseDown(root, { button: 0 })
    expect(onChange).toHaveBeenCalledWith(true)
    expect(box.classList.contains('off')).toBe(true)
    checked.set(true)
    expect(box.classList.contains('on')).toBe(true)
  })

  it('press on checked reports false', () => {
    const { root, onChange } = setup(true)
    fireEvent.mouseDown(root, { button: 0 })
    expect(onChange).toHaveBeenCalledWith(false)
  })

  it('right-button ignored', () => {
    const { root, onChange } = setup()
    fireEvent.mouseDown(root, { button: 2 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('accepts plain values', () => {
    const onChange = vi.fn()
    const { container } = render(<Checkbox checked={true} disabled={false} onChange={onChange} />)
    fireEvent.mouseDown(container.querySelector('.jui-checkbox') as Element, { button: 0 })
    expect(onChange).toHaveBeenCalledWith(false)
  })

  it('plain disabled ignores press', () => {
    const onChange = vi.fn()
    const { container } = render(<Checkbox checked={false} disabled={true} onChange={onChange} />)
    fireEvent.mouseDown(container.querySelector('.jui-checkbox') as Element, { button: 0 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('disabled_facet_flip', () => {
    const { root, disabled, onChange } = setup()
    fireEvent.mouseDown(root, { button: 0 })
    expect(onChange).toHaveBeenCalledTimes(1)
    disabled.set(true)
    expect(root.classList.contains('disabled')).toBe(true)
    fireEvent.mouseDown(root, { button: 0 })
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})
