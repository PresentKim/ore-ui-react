import { describe, expect, it, vi } from 'vitest'
import { createFacet } from '@react-facet/core'
import { fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { Checkbox } from './Checkbox'

const setup = (props: { checked?: boolean; disabled?: boolean } = {}) => {
  const checked = createFacet({ initialValue: props.checked ?? false })
  const disabled = createFacet({ initialValue: props.disabled ?? false })
  const onChange = vi.fn()
  const view = render(<Checkbox checked={checked} disabled={disabled} label="Remember" onChange={onChange} />)
  const root = view.container.querySelector('.oui-checkbox') as HTMLElement
  const box = view.container.querySelector('.oui-checkbox-box') as HTMLElement
  return { checked, disabled, onChange, view, root, box }
}

describe('oreui Checkbox', () => {
  it('box is on when checked and off when not', () => {
    expect(setup({ checked: true }).box.className).toContain('on')
    expect(setup({ checked: false }).box.className).toContain('off')
  })

  it('renders the label', () => {
    expect(setup().view.container.textContent).toContain('Remember')
  })

  it('controlled', () => {
    const { root, box, checked, onChange } = setup({ checked: false })
    fireEvent.mouseDown(root, { button: 0 })
    expect(onChange).toHaveBeenCalledWith(true)
    expect(box.className).toContain('off')
    checked.set(true)
    expect(box.className).toContain('on')
    fireEvent.mouseDown(root, { button: 0 })
    expect(onChange).toHaveBeenLastCalledWith(false)
  })

  it('plain checked value toggles', () => {
    const onChange = vi.fn()
    const view = render(<Checkbox checked={true} onChange={onChange} />)
    fireEvent.mouseDown(view.container.querySelector('.oui-checkbox') as HTMLElement, { button: 0 })
    expect(onChange).toHaveBeenCalledWith(false)
  })

  it('right button ignored', () => {
    const { root, onChange } = setup()
    fireEvent.mouseDown(root, { button: 2 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('disabled_facet_flip', () => {
    const { root, disabled, onChange } = setup()
    fireEvent.mouseDown(root, { button: 0 })
    expect(onChange).toHaveBeenCalledTimes(1)
    disabled.set(true)
    expect(root.className).toContain('disabled')
    fireEvent.mouseDown(root, { button: 0 })
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})
