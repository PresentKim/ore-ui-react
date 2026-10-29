import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createFacet } from '@react-facet/core'
import { fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { Slider } from './Slider'

const mockRect = () =>
  vi
    .spyOn(Element.prototype, 'getBoundingClientRect')
    .mockReturnValue({ left: 100, width: 200, right: 300, top: 0, bottom: 10, height: 10, x: 100, y: 0, toJSON: () => ({}) })

const setup = (props: { disabled?: boolean } = {}) => {
  const value = createFacet({ initialValue: 0 })
  const disabled = createFacet({ initialValue: props.disabled ?? false })
  const onChange = vi.fn()
  const view = render(<Slider value={value} min={0} max={100} step={1} disabled={disabled} onChange={onChange} />)
  const track = view.container.querySelector('.jui-slider-track') as HTMLElement
  return { value, disabled, onChange, view, track }
}

describe('jsonui Slider', () => {
  beforeEach(() => {
    mockRect()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('reports the value under mousedown', () => {
    const { track, onChange } = setup()
    fireEvent.mouseDown(track, { button: 0, clientX: 150 })
    expect(onChange).toHaveBeenCalledWith(25)
  })

  it('follows document mousemove while dragging', () => {
    const { track, onChange } = setup()
    fireEvent.mouseDown(track, { button: 0, clientX: 150 })
    fireEvent.mouseMove(document, { clientX: 250 })
    expect(onChange).toHaveBeenLastCalledWith(75)
  })

  it('drag_clamps', () => {
    const { track, onChange } = setup()
    fireEvent.mouseDown(track, { button: 0, clientX: 150 })
    fireEvent.mouseMove(document, { clientX: 900 })
    expect(onChange).toHaveBeenLastCalledWith(100)
    fireEvent.mouseMove(document, { clientX: -50 })
    expect(onChange).toHaveBeenLastCalledWith(0)
  })

  it('mouseup_detaches', () => {
    const { track, onChange } = setup()
    fireEvent.mouseDown(track, { button: 0, clientX: 150 })
    fireEvent.mouseUp(document)
    onChange.mockClear()
    fireEvent.mouseMove(document, { clientX: 250 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('ignores right button', () => {
    const { track, onChange } = setup()
    fireEvent.mouseDown(track, { button: 2, clientX: 150 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('disabled_facet_flip', () => {
    const { track, disabled, onChange, view } = setup()
    fireEvent.mouseDown(track, { button: 0, clientX: 150 })
    fireEvent.mouseUp(document)
    expect(onChange).toHaveBeenCalledTimes(1)
    disabled.set(true)
    expect(view.container.querySelector('.jui-slider')?.className).toContain('disabled')
    fireEvent.mouseDown(track, { button: 0, clientX: 250 })
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('stops a drag when disabled flips mid-drag', () => {
    const { track, disabled, onChange } = setup()
    fireEvent.mouseDown(track, { button: 0, clientX: 150 })
    disabled.set(true)
    onChange.mockClear()
    fireEvent.mouseMove(document, { clientX: 250 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('unmount removes document listeners', () => {
    const { track, onChange, view } = setup()
    fireEvent.mouseDown(track, { button: 0, clientX: 150 })
    view.unmount()
    onChange.mockClear()
    fireEvent.mouseMove(document, { clientX: 250 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('accepts plain values', () => {
    const onChange = vi.fn()
    const { container } = render(<Slider value={50} disabled={false} onChange={onChange} />)
    fireEvent.mouseDown(container.querySelector('.jui-slider-track') as Element, { button: 0, clientX: 150 })
    expect(onChange).toHaveBeenCalledWith(25)
    fireEvent.mouseUp(document)
  })

  it('fill width follows the value ratio', () => {
    const { value, view } = setup()
    const fill = view.container.querySelector('.jui-slider-fill') as HTMLElement
    value.set(25)
    expect(fill.style.width).toBe('25%')
    value.set(100)
    expect(fill.style.width).toBe('100%')
  })
})
