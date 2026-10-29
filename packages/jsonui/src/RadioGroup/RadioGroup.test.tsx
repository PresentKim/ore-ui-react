import { describe, expect, it, vi } from 'vitest'
import { createFacet } from '@react-facet/core'
import { fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { RadioGroup } from './RadioGroup'

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta', disabled: true },
  { value: 'c', label: 'Gamma' },
]

const setup = (props: { value?: string; disabled?: boolean } = {}) => {
  const value = createFacet<string | undefined>({ initialValue: props.value })
  const disabled = createFacet({ initialValue: props.disabled ?? false })
  const onChange = vi.fn()
  const view = render(<RadioGroup options={options} value={value} disabled={disabled} onChange={onChange} />)
  const radios = Array.from(view.container.querySelectorAll('.jui-radio')) as HTMLElement[]
  const boxes = Array.from(view.container.querySelectorAll('.jui-radio-box')) as HTMLElement[]
  return { value, disabled, onChange, radios, boxes }
}

describe('jsonui RadioGroup', () => {
  it('option equal to value has class on', () => {
    const { value, boxes } = setup({ value: 'c' })
    expect(boxes.map((box) => box.classList.contains('on'))).toEqual([false, false, true])
    value.set('a')
    expect(boxes.map((box) => box.classList.contains('on'))).toEqual([true, false, false])
  })

  it('controlled: press calls onChange and selection waits for the facet', () => {
    const { value, radios, boxes, onChange } = setup({ value: 'a' })
    fireEvent.mouseDown(radios[2], { button: 0 })
    expect(onChange).toHaveBeenCalledWith('c')
    expect(boxes[2].classList.contains('on')).toBe(false)
    expect(boxes[0].classList.contains('on')).toBe(true)
    value.set('c')
    expect(boxes[2].classList.contains('on')).toBe(true)
  })

  it('disabled_option ignores presses', () => {
    const { radios, onChange } = setup()
    expect(radios[1].classList.contains('disabled')).toBe(true)
    fireEvent.mouseDown(radios[1], { button: 0 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('disabled group ignores presses', () => {
    const { disabled, radios, onChange } = setup()
    disabled.set(true)
    expect(radios[0].classList.contains('disabled')).toBe(true)
    fireEvent.mouseDown(radios[0], { button: 0 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('right button ignored', () => {
    const { radios, onChange } = setup()
    fireEvent.mouseDown(radios[0], { button: 2 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('renders labels', () => {
    const { radios } = setup()
    expect(radios.map((radio) => radio.textContent)).toEqual(['Alpha', 'Beta', 'Gamma'])
  })
})
