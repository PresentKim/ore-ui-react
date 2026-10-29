import { describe, expect, it, vi } from 'vitest'
import { createFacet } from '@react-facet/core'
import { fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { NumberInput, PasswordInput, TextInput } from './Input'

const field = (container: HTMLElement) => container.querySelector('input') as HTMLInputElement
const type = (input: HTMLInputElement, text: string) => fireEvent.input(input, { target: { value: text } })

describe('jsonui TextInput', () => {
  it('typing calls onChange with the text', () => {
    const onChange = vi.fn()
    const view = render(<TextInput value="" onChange={onChange} />)
    type(field(view.container), 'hello')
    expect(onChange).toHaveBeenCalledWith('hello')
  })

  it('max_length', () => {
    const onChange = vi.fn()
    const view = render(<TextInput value="" maxLength={3} onChange={onChange} />)
    type(field(view.container), 'abcdef')
    expect(onChange).toHaveBeenCalledWith('abc')
    expect(field(view.container).value).toBe('abc')
  })

  it('facet_value_sync', () => {
    const value = createFacet({ initialValue: 'one' })
    const view = render(<TextInput value={value} />)
    expect(field(view.container).value).toBe('one')
    value.set('two')
    expect(field(view.container).value).toBe('two')
  })

  it('placeholder and readOnly reach the field', () => {
    const view = render(<TextInput value="" placeholder="Name" readOnly />)
    expect(field(view.container).placeholder).toBe('Name')
    expect(field(view.container).readOnly).toBe(true)
  })

  it('disabled facet flips the field and root class', () => {
    const disabled = createFacet({ initialValue: false })
    const view = render(<TextInput value="" disabled={disabled} />)
    const root = view.container.querySelector('.jui-input') as HTMLElement
    expect(field(view.container).disabled).toBe(false)
    disabled.set(true)
    expect(field(view.container).disabled).toBe(true)
    expect(root.classList.contains('disabled')).toBe(true)
  })
})

describe('jsonui NumberInput', () => {
  it('number_clamp', () => {
    const onChange = vi.fn()
    const view = render(<NumberInput value={0} min={0} max={100} onChange={onChange} />)
    type(field(view.container), '500')
    expect(onChange).toHaveBeenCalledWith(100)
    expect(field(view.container).value).toBe('100')
    type(field(view.container), '-5')
    expect(onChange).toHaveBeenLastCalledWith(0)
  })

  it('ignores text that is not a number', () => {
    const onChange = vi.fn()
    const view = render(<NumberInput value={1} onChange={onChange} />)
    type(field(view.container), '')
    type(field(view.container), '-')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('step buttons add and subtract step', () => {
    const value = createFacet({ initialValue: 10 })
    const onChange = vi.fn()
    const view = render(<NumberInput value={value} step={5} max={12} onChange={onChange} />)
    const up = view.container.querySelector('.jui-input-increase') as HTMLElement
    const down = view.container.querySelector('.jui-input-decrease') as HTMLElement
    fireEvent.mouseDown(up, { button: 0 })
    expect(onChange).toHaveBeenLastCalledWith(12)
    fireEvent.mouseDown(down, { button: 0 })
    expect(onChange).toHaveBeenLastCalledWith(5)
    fireEvent.mouseDown(down, { button: 2 })
    expect(onChange).toHaveBeenCalledTimes(2)
  })

  it('step buttons are ignored when disabled', () => {
    const onChange = vi.fn()
    const view = render(<NumberInput value={1} disabled onChange={onChange} />)
    fireEvent.mouseDown(view.container.querySelector('.jui-input-increase') as HTMLElement, { button: 0 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('facet_value_sync', () => {
    const value = createFacet({ initialValue: 3 })
    const view = render(<NumberInput value={value} />)
    value.set(8)
    expect(field(view.container).value).toBe('8')
  })
})

describe('jsonui PasswordInput', () => {
  it('masks and toggles visibility', () => {
    const view = render(<PasswordInput value="secret" />)
    const toggle = view.container.querySelector('.jui-input-toggle') as HTMLElement
    expect(field(view.container).type).toBe('password')
    fireEvent.mouseDown(toggle, { button: 0 })
    expect(field(view.container).type).toBe('text')
    fireEvent.mouseDown(toggle, { button: 0 })
    expect(field(view.container).type).toBe('password')
  })

  it('typing calls onChange', () => {
    const onChange = vi.fn()
    const view = render(<PasswordInput value="" onChange={onChange} />)
    type(field(view.container), 'pw')
    expect(onChange).toHaveBeenCalledWith('pw')
  })
})
