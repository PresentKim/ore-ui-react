import { describe, expect, it, vi } from 'vitest'
import { createFacet } from '@react-facet/core'
import { fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { Segment } from './Segment'

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta', disabled: true },
  { value: 'c', label: 'Gamma' },
]

const setup = (props: { value?: string; disabled?: boolean } = {}) => {
  const value = createFacet<string | undefined>({ initialValue: props.value })
  const disabled = createFacet({ initialValue: props.disabled ?? false })
  const onChange = vi.fn()
  const view = render(<Segment options={options} value={value} disabled={disabled} onChange={onChange} />)
  const buttons = Array.from(view.container.querySelectorAll('.jui-segment-button')) as HTMLElement[]
  const active = () => buttons.map((button) => button.classList.contains('active'))
  return { value, disabled, onChange, buttons, active }
}

describe('jsonui Segment', () => {
  it('button equal to value is active', () => {
    const { value, active } = setup({ value: 'c' })
    expect(active()).toEqual([false, false, true])
    value.set('a')
    expect(active()).toEqual([true, false, false])
  })

  it('controlled: press calls onChange and activation waits for the facet', () => {
    const { value, buttons, active, onChange } = setup({ value: 'a' })
    fireEvent.mouseDown(buttons[2], { button: 0 })
    expect(onChange).toHaveBeenCalledWith('c')
    expect(active()).toEqual([true, false, false])
    value.set('c')
    expect(active()).toEqual([false, false, true])
  })

  it('disabled_button ignores presses', () => {
    const { buttons, onChange } = setup()
    expect(buttons[1].classList.contains('disabled')).toBe(true)
    fireEvent.mouseDown(buttons[1], { button: 0 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('disabled group ignores presses', () => {
    const { disabled, buttons, onChange } = setup()
    disabled.set(true)
    expect(buttons[0].classList.contains('disabled')).toBe(true)
    fireEvent.mouseDown(buttons[0], { button: 0 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('right button ignored', () => {
    const { buttons, onChange } = setup()
    fireEvent.mouseDown(buttons[0], { button: 2 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('renders labels', () => {
    const { buttons } = setup()
    expect(buttons.map((button) => button.textContent)).toEqual(['Alpha', 'Beta', 'Gamma'])
  })
})
