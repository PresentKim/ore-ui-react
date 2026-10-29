import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createFacet } from '@react-facet/core'
import { fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { ColorPicker } from './ColorPicker'

const setup = (initial = '#ff0000') => {
  const value = createFacet({ initialValue: initial })
  const onChange = vi.fn()
  const view = render(<ColorPicker value={value} onChange={onChange} />)
  const pick = (selector: string) => view.container.querySelector(selector) as HTMLElement
  return { value, onChange, view, pick }
}

describe('jsonui ColorPicker', () => {
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

  it('area reports saturation and value', () => {
    const { pick, onChange } = setup()
    fireEvent.mouseDown(pick('.jui-colorpicker-area'), { button: 0, clientX: 100, clientY: 25 })
    expect(onChange).toHaveBeenCalledWith('#bf6060')
  })

  it('area drag clamps and mouseup detaches', () => {
    const { pick, onChange } = setup()
    fireEvent.mouseDown(pick('.jui-colorpicker-area'), { button: 0, clientX: 100, clientY: 25 })
    fireEvent.mouseMove(document, { clientX: 900, clientY: -50 })
    expect(onChange).toHaveBeenLastCalledWith('#ff0000')
    fireEvent.mouseUp(document)
    onChange.mockClear()
    fireEvent.mouseMove(document, { clientX: 10, clientY: 10 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('hue strip reports hex and keeps saturation and value', () => {
    const { pick, onChange } = setup()
    fireEvent.mouseDown(pick('.jui-colorpicker-hue'), { button: 0, clientX: 100, clientY: 0 })
    expect(onChange).toHaveBeenCalledWith('#00ffff')
  })

  it('ignores right button', () => {
    const { pick, onChange } = setup()
    fireEvent.mouseDown(pick('.jui-colorpicker-area'), { button: 2, clientX: 100, clientY: 25 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('invalid_hex keeps the last value', () => {
    const { pick, onChange } = setup('#00ff00')
    const field = pick('input') as HTMLInputElement
    fireEvent.input(field, { target: { value: 'zzz' } })
    fireEvent.input(field, { target: { value: '#12345' } })
    expect(onChange).not.toHaveBeenCalled()
    expect(pick('.jui-colorpicker-hue-handle').style.left).toBe('33.33333333333333%')
    fireEvent.input(field, { target: { value: '#0000FF' } })
    expect(onChange).toHaveBeenCalledWith('#0000ff')
  })

  it('follows the value facet', () => {
    const { value, pick } = setup()
    value.set('#0000ff')
    expect(pick('.jui-colorpicker-hue-handle').style.left).toBe('66.66666666666666%')
    expect(pick('.jui-colorpicker-handle').style.left).toBe('100%')
    expect(pick('.jui-colorpicker-handle').style.top).toBe('0%')
  })

  it('keeps the hue when the value turns gray', () => {
    const { value, pick } = setup('#0000ff')
    value.set('#000000')
    expect(pick('.jui-colorpicker-hue-handle').style.left).toBe('66.66666666666666%')
  })
})
