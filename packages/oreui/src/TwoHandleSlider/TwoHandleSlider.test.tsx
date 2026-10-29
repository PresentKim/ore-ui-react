import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createFacet } from '@react-facet/core'
import { fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { TwoHandleSlider } from './TwoHandleSlider'

const setup = (props: { value?: [number, number]; disabled?: boolean } = {}) => {
  const value = createFacet<[number, number]>({ initialValue: props.value ?? [10, 90] })
  const disabled = createFacet({ initialValue: props.disabled ?? false })
  const onChange = vi.fn()
  const view = render(
    <TwoHandleSlider value={value} min={0} max={100} step={1} disabled={disabled} onChange={onChange} />,
  )
  const track = view.container.querySelector('.oui-twohandleslider-track') as HTMLElement
  return { value, disabled, onChange, view, track }
}

describe('oreui TwoHandleSlider', () => {
  beforeEach(() => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      width: 200,
      right: 300,
      top: 0,
      bottom: 10,
      height: 10,
      x: 100,
      y: 0,
      toJSON: () => ({}),
    })
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('nearest_handle: press moves the low handle when nearer', () => {
    const { track, onChange } = setup()
    fireEvent.mouseDown(track, { button: 0, clientX: 150 })
    expect(onChange).toHaveBeenCalledWith([25, 90])
  })

  it('nearest_handle: press moves the high handle when nearer', () => {
    const { track, onChange } = setup()
    fireEvent.mouseDown(track, { button: 0, clientX: 250 })
    expect(onChange).toHaveBeenCalledWith([10, 75])
  })

  it('drag keeps moving the same handle', () => {
    const { track, onChange } = setup()
    fireEvent.mouseDown(track, { button: 0, clientX: 150 })
    fireEvent.mouseMove(document, { clientX: 200 })
    expect(onChange).toHaveBeenLastCalledWith([50, 90])
  })

  it('no_cross: low handle stops at the high handle', () => {
    const { track, onChange } = setup()
    fireEvent.mouseDown(track, { button: 0, clientX: 150 })
    fireEvent.mouseMove(document, { clientX: 290 })
    expect(onChange).toHaveBeenLastCalledWith([90, 90])
  })

  it('no_cross: high handle stops at the low handle', () => {
    const { track, onChange } = setup()
    fireEvent.mouseDown(track, { button: 0, clientX: 250 })
    fireEvent.mouseMove(document, { clientX: 110 })
    expect(onChange).toHaveBeenLastCalledWith([10, 10])
  })

  it('equal handles pick the side of the pointer', () => {
    const { track, onChange } = setup({ value: [50, 50] })
    fireEvent.mouseDown(track, { button: 0, clientX: 120 })
    expect(onChange).toHaveBeenLastCalledWith([10, 50])
    fireEvent.mouseUp(document)
    fireEvent.mouseDown(track, { button: 0, clientX: 280 })
    expect(onChange).toHaveBeenLastCalledWith([50, 90])
  })

  it('uses the facet value updated during a drag', () => {
    const { track, value, onChange } = setup()
    fireEvent.mouseDown(track, { button: 0, clientX: 150 })
    value.set([25, 60])
    fireEvent.mouseMove(document, { clientX: 290 })
    expect(onChange).toHaveBeenLastCalledWith([60, 60])
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

  it('disabled ignores presses and stops a drag when it flips', () => {
    const { track, disabled, onChange, view } = setup()
    fireEvent.mouseDown(track, { button: 0, clientX: 150 })
    disabled.set(true)
    onChange.mockClear()
    fireEvent.mouseMove(document, { clientX: 250 })
    fireEvent.mouseDown(track, { button: 0, clientX: 250 })
    expect(onChange).not.toHaveBeenCalled()
    expect(view.container.querySelector('.oui-twohandleslider')?.className).toContain('disabled')
  })

  it('removes document listeners on unmount', () => {
    const { track, onChange, view } = setup()
    fireEvent.mouseDown(track, { button: 0, clientX: 150 })
    view.unmount()
    onChange.mockClear()
    fireEvent.mouseMove(document, { clientX: 250 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('fill spans from low to high', () => {
    const { value, view } = setup()
    const fill = view.container.querySelector('.oui-twohandleslider-fill') as HTMLElement
    expect(fill.style.left).toBe('10%')
    expect(fill.style.width).toBe('80%')
    value.set([20, 30])
    expect(fill.style.left).toBe('20%')
    expect(fill.style.width).toBe('10%')
  })
})
