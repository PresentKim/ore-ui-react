import { describe, expect, it, vi } from 'vitest'
import { createFacet } from '@react-facet/core'
import { fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { ToggleButton } from './ToggleButton'

const setup = (initial: boolean, disabledInitial = false) => {
  const value = createFacet({ initialValue: initial })
  const disabled = createFacet({ initialValue: disabledInitial })
  const onChange = vi.fn()
  const { container } = render(<ToggleButton value={value} disabled={disabled} onChange={onChange} />)
  const root = container.querySelector('.jui-toggle-button') as Element
  return { value, disabled, onChange, root }
}

describe('ToggleButton', () => {
  it('class follows value', () => {
    const { value, root } = setup(false)
    expect(root.classList.contains('off')).toBe(true)
    value.set(true)
    expect(root.classList.contains('on')).toBe(true)
    expect(root.classList.contains('off')).toBe(false)
  })

  it('press reports the inverse and keeps the class until the owner sets value', () => {
    const { value, onChange, root } = setup(false)
    fireEvent.mouseDown(root, { button: 0 })
    expect(onChange).toHaveBeenCalledWith(true)
    expect(root.classList.contains('off')).toBe(true)
    value.set(true)
    expect(root.classList.contains('on')).toBe(true)
  })

  it('press on an on toggle reports false', () => {
    const { onChange, root } = setup(true)
    fireEvent.mouseDown(root, { button: 0 })
    expect(onChange).toHaveBeenCalledWith(false)
  })

  it('ignores right button', () => {
    const { onChange, root } = setup(false)
    fireEvent.mouseDown(root, { button: 2 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('accepts plain values', () => {
    const onChange = vi.fn()
    const { container } = render(<ToggleButton value={true} disabled={false} onChange={onChange} />)
    fireEvent.mouseDown(container.querySelector('.jui-toggle-button') as Element, { button: 0 })
    expect(onChange).toHaveBeenCalledWith(false)
  })

  it('disabled facet flip adds class and ignores press', () => {
    const { disabled, onChange, root } = setup(false)
    fireEvent.mouseDown(root, { button: 0 })
    expect(onChange).toHaveBeenCalledTimes(1)
    disabled.set(true)
    expect(root.classList.contains('disabled')).toBe(true)
    fireEvent.mouseDown(root, { button: 0 })
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})
