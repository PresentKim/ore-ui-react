import { describe, expect, it, vi } from 'vitest'
import { createFacet } from '@react-facet/core'
import { fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { Stepper } from './Stepper'

const items = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
]

const setup = (props: { value?: string; loop?: boolean; disabled?: boolean } = {}) => {
  const value = createFacet<string | undefined>({ initialValue: props.value ?? 'a' })
  const disabled = createFacet({ initialValue: props.disabled ?? false })
  const onChange = vi.fn()
  const view = render(<Stepper items={items} value={value} loop={props.loop} disabled={disabled} onChange={onChange} />)
  const prev = view.container.querySelector('.oui-stepper-prev') as HTMLElement
  const next = view.container.querySelector('.oui-stepper-next') as HTMLElement
  const visibleText = () =>
    Array.from(view.container.querySelectorAll('.oui-stepper-current > *'))
      .filter((el) => (el as HTMLElement).style.display !== 'none')
      .map((el) => el.textContent)
      .join('')
  return { value, disabled, onChange, prev, next, visibleText }
}

describe('oreui Stepper', () => {
  it('shows the label of value', () => {
    const { value, visibleText } = setup()
    expect(visibleText()).toBe('Alpha')
    value.set('c')
    expect(visibleText()).toBe('Gamma')
  })

  it('arrows call onChange with the neighbor', () => {
    const { prev, next, onChange } = setup({ value: 'b' })
    fireEvent.mouseDown(next, { button: 0 })
    expect(onChange).toHaveBeenLastCalledWith('c')
    fireEvent.mouseDown(prev, { button: 0 })
    expect(onChange).toHaveBeenLastCalledWith('a')
  })

  it('ends are disabled without loop', () => {
    const { prev, next, value, onChange } = setup()
    expect(prev.classList.contains('disabled')).toBe(true)
    fireEvent.mouseDown(prev, { button: 0 })
    expect(onChange).not.toHaveBeenCalled()
    value.set('c')
    expect(next.classList.contains('disabled')).toBe(true)
    expect(prev.classList.contains('disabled')).toBe(false)
    fireEvent.mouseDown(next, { button: 0 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('loop wraps at both ends', () => {
    const { prev, next, value, onChange } = setup({ loop: true })
    expect(prev.classList.contains('disabled')).toBe(false)
    fireEvent.mouseDown(prev, { button: 0 })
    expect(onChange).toHaveBeenLastCalledWith('c')
    value.set('c')
    fireEvent.mouseDown(next, { button: 0 })
    expect(onChange).toHaveBeenLastCalledWith('a')
  })

  it('disabled stepper ignores presses', () => {
    const { next, disabled, onChange } = setup({ disabled: true })
    expect(next.classList.contains('disabled')).toBe(true)
    fireEvent.mouseDown(next, { button: 0 })
    disabled.set(false)
    expect(next.classList.contains('disabled')).toBe(false)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('right button ignored', () => {
    const { next, onChange } = setup()
    fireEvent.mouseDown(next, { button: 2 })
    expect(onChange).not.toHaveBeenCalled()
  })
})
