import { describe, expect, it, vi } from 'vitest'
import { createFacet } from '@react-facet/core'
import { fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { ToggleButton } from './ToggleButton'

const setup = (initial: boolean, disabledInitial = false) => {
  const value = createFacet({ initialValue: initial })
  const disabled = createFacet({ initialValue: disabledInitial })
  const onChange = vi.fn()
  const { container } = render(<ToggleButton value={value} disabled={disabled} onChange={onChange} />)
  const root = container.querySelector('.oui-toggle-button') as Element
  const thumb = container.querySelector('.oui-toggle-button-thumb') as Element
  return { value, disabled, onChange, root, thumb }
}

describe('ToggleButton', () => {
  it('thumb follows value', () => {
    const { value, thumb } = setup(false)
    expect(thumb.classList.contains('off')).toBe(true)
    value.set(true)
    expect(thumb.classList.contains('on')).toBe(true)
  })

  it('press reports the inverse and keeps the class until the owner sets value', () => {
    const { value, onChange, root, thumb } = setup(false)
    fireEvent.mouseDown(root, { button: 0 })
    expect(onChange).toHaveBeenCalledWith(true)
    expect(thumb.classList.contains('on')).toBe(false)
    expect(thumb.classList.contains('to-on')).toBe(false)
    value.set(true)
    expect(thumb.classList.contains('to-on')).toBe(true)
  })

  it('slides only after a press', () => {
    const { value, root, thumb } = setup(false)
    value.set(true)
    expect(thumb.classList.contains('on')).toBe(true)
    expect(thumb.classList.contains('to-on')).toBe(false)
    value.set(false)
    fireEvent.mouseDown(root, { button: 0 })
    value.set(true)
    expect(thumb.classList.contains('to-on')).toBe(true)
  })

  it('animationend clears to-on', () => {
    const { value, root, thumb } = setup(false)
    fireEvent.mouseDown(root, { button: 0 })
    value.set(true)
    fireEvent.animationEnd(thumb)
    expect(thumb.classList.contains('to-on')).toBe(false)
    expect(thumb.classList.contains('on')).toBe(true)
  })

  it('ignores right button', () => {
    const { onChange, root } = setup(false)
    fireEvent.mouseDown(root, { button: 2 })
    expect(onChange).not.toHaveBeenCalled()
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
