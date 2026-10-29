import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createFacet } from '@react-facet/core'
import { fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { XYSlider } from './XYSlider'

const setup = (props: { disabled?: boolean } = {}) => {
  const value = createFacet({ initialValue: { x: 0, y: 0 } })
  const disabled = createFacet({ initialValue: props.disabled ?? false })
  const onChange = vi.fn()
  const view = render(<XYSlider value={value} disabled={disabled} onChange={onChange} />)
  const area = view.container.querySelector('.jui-xyslider-area') as HTMLElement
  return { value, disabled, onChange, view, area }
}

describe('jsonui XYSlider', () => {
  beforeEach(() => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 200,
      height: 100,
      right: 200,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('reports both axes under mousedown', () => {
    const { area, onChange } = setup()
    fireEvent.mouseDown(area, { button: 0, clientX: 50, clientY: 25 })
    expect(onChange).toHaveBeenCalledWith({ x: 25, y: 25 })
  })

  it('clamp_both_axes', () => {
    const { area, onChange } = setup()
    fireEvent.mouseDown(area, { button: 0, clientX: 50, clientY: 25 })
    fireEvent.mouseMove(document, { clientX: 900, clientY: 900 })
    expect(onChange).toHaveBeenLastCalledWith({ x: 100, y: 100 })
    fireEvent.mouseMove(document, { clientX: -50, clientY: -50 })
    expect(onChange).toHaveBeenLastCalledWith({ x: 0, y: 0 })
  })

  it('mouseup_detaches', () => {
    const { area, onChange } = setup()
    fireEvent.mouseDown(area, { button: 0, clientX: 50, clientY: 25 })
    fireEvent.mouseUp(document)
    onChange.mockClear()
    fireEvent.mouseMove(document, { clientX: 100, clientY: 50 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('ignores right button', () => {
    const { area, onChange } = setup()
    fireEvent.mouseDown(area, { button: 2, clientX: 50, clientY: 25 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('ignores mousedown and stops a drag when disabled', () => {
    const { area, disabled, onChange } = setup()
    fireEvent.mouseDown(area, { button: 0, clientX: 50, clientY: 25 })
    disabled.set(true)
    onChange.mockClear()
    fireEvent.mouseMove(document, { clientX: 100, clientY: 50 })
    fireEvent.mouseDown(area, { button: 0, clientX: 100, clientY: 50 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('removes document listeners on unmount', () => {
    const { area, onChange, view } = setup()
    fireEvent.mouseDown(area, { button: 0, clientX: 50, clientY: 25 })
    view.unmount()
    onChange.mockClear()
    fireEvent.mouseMove(document, { clientX: 100, clientY: 50 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('handle position follows the value ratios', () => {
    const { value, view } = setup()
    const handle = view.container.querySelector('.jui-xyslider-handle') as HTMLElement
    value.set({ x: 25, y: 50 })
    expect(handle.style.left).toBe('25%')
    expect(handle.style.top).toBe('50%')
  })
})
