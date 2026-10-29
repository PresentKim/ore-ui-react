import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createFacet } from '@react-facet/core'
import { fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { TextSlider } from './TextSlider'

const values = ['Easy', 'Medium', 'Hard']

const setup = (props: { value?: string; disabled?: boolean } = {}) => {
  const value = createFacet<string | undefined>({ initialValue: props.value })
  const disabled = createFacet({ initialValue: props.disabled ?? false })
  const onChange = vi.fn()
  const view = render(<TextSlider values={values} value={value} disabled={disabled} onChange={onChange} />)
  const track = view.container.querySelector('.jui-slider-track') as HTMLElement
  const label = view.container.querySelector('.jui-textslider-label') as HTMLElement
  return { value, disabled, onChange, track, label }
}

describe('jsonui TextSlider', () => {
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

  it('shows the current text', () => {
    const { value, label } = setup({ value: 'Medium' })
    expect(label.textContent).toBe('Medium')
    value.set('Hard')
    expect(label.textContent).toBe('Hard')
  })

  it('shows the first value without a value', () => {
    expect(setup().label.textContent).toBe('Easy')
  })

  it('snap_to_values: 60% of 3 values reports the middle value', () => {
    const { track, onChange } = setup()
    fireEvent.mouseDown(track, { button: 0, clientX: 220 })
    expect(onChange).toHaveBeenCalledWith('Medium')
  })

  it('dragging reports the nearest value', () => {
    const { track, onChange } = setup()
    fireEvent.mouseDown(track, { button: 0, clientX: 110 })
    expect(onChange).toHaveBeenLastCalledWith('Easy')
    fireEvent.mouseMove(document, { clientX: 290 })
    expect(onChange).toHaveBeenLastCalledWith('Hard')
  })

  it('disabled ignores', () => {
    const { track, onChange } = setup({ disabled: true })
    fireEvent.mouseDown(track, { button: 0, clientX: 220 })
    expect(onChange).not.toHaveBeenCalled()
  })
})
