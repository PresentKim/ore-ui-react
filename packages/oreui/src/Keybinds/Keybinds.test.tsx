import { describe, expect, it, vi } from 'vitest'
import { createFacet } from '@react-facet/core'
import { fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { resolveBinding } from '@ore-ui-react/core/src/keybinds'
import type { ConflictPolicy } from '@ore-ui-react/core/src/keybinds'
import { Keybind, Keybinds } from './Keybinds'

const setup = (conflict?: ConflictPolicy) => {
  const bindings = createFacet<Record<string, string | null>>({ initialValue: { jump: 'Space', crouch: 'C', sprint: null } })
  const onChange = vi.fn()
  const view = render(
    <Keybinds bindings={bindings} conflict={conflict} placeholder="Unbound" listeningText="Press a key" onChange={onChange}>
      <Keybind action="jump" label="Jump" />
      <Keybind action="crouch" label="Crouch" />
      <Keybind action="sprint" label="Sprint" />
    </Keybinds>,
  )
  const slots = Array.from(view.container.querySelectorAll('.oui-keybind-slot')) as HTMLElement[]
  const rows = Array.from(view.container.querySelectorAll('.oui-keybind')) as HTMLElement[]
  const visibleText = (index: number) =>
    Array.from(slots[index].children)
      .filter((el) => (el as HTMLElement).style.display !== 'none')
      .map((el) => el.textContent)
      .join('')
  return { bindings, onChange, view, slots, rows, visibleText }
}

describe('oreui resolveBinding', () => {
  const input = { jump: 'Space', crouch: 'C' }
  it('swap exchanges keys', () => {
    expect(resolveBinding(input, 'crouch', 'Space', 'swap')).toEqual({ jump: 'C', crouch: 'Space' })
  })
  it('replace clears the holder', () => {
    expect(resolveBinding(input, 'crouch', 'Space', 'replace')).toEqual({ jump: null, crouch: 'Space' })
  })
  it('block returns the input unchanged on a conflict', () => {
    expect(resolveBinding(input, 'crouch', 'Space', 'block')).toBe(input)
  })
  it('free key binds without conflict', () => {
    expect(resolveBinding(input, 'crouch', 'X', 'block')).toEqual({ jump: 'Space', crouch: 'X' })
  })
})

describe('oreui Keybinds', () => {
  it('shows the key or the placeholder', () => {
    const { visibleText } = setup()
    expect(visibleText(0)).toBe('Space')
    expect(visibleText(2)).toBe('Unbound')
  })

  it('press shows listening text, next keydown calls onChange', () => {
    const { slots, visibleText, onChange, rows } = setup()
    fireEvent.mouseDown(slots[2], { button: 0 })
    expect(visibleText(2)).toBe('Press a key')
    expect(rows[2].classList.contains('listening')).toBe(true)
    fireEvent.keyDown(document, { code: 'KeyV' })
    expect(onChange).toHaveBeenCalledWith({ jump: 'Space', crouch: 'C', sprint: 'V' })
    expect(rows[2].classList.contains('listening')).toBe(false)
  })

  it('conflict uses the swap policy by default', () => {
    const { slots, onChange } = setup()
    fireEvent.mouseDown(slots[1], { button: 0 })
    fireEvent.keyDown(document, { code: 'Space' })
    expect(onChange).toHaveBeenCalledWith({ jump: 'C', crouch: 'Space', sprint: null })
  })

  it('block policy keeps bindings and stops listening', () => {
    const { slots, onChange, rows } = setup('block')
    fireEvent.mouseDown(slots[1], { button: 0 })
    fireEvent.keyDown(document, { code: 'Space' })
    expect(onChange).not.toHaveBeenCalled()
    expect(rows[1].classList.contains('listening')).toBe(false)
  })

  it('escape_cancels', () => {
    const { slots, onChange, rows, visibleText } = setup()
    fireEvent.mouseDown(slots[0], { button: 0 })
    fireEvent.keyDown(document, { code: 'Escape' })
    expect(onChange).not.toHaveBeenCalled()
    expect(rows[0].classList.contains('listening')).toBe(false)
    expect(visibleText(0)).toBe('Space')
  })

  it('keydown without listening does nothing', () => {
    const { onChange } = setup()
    fireEvent.keyDown(document, { code: 'KeyV' })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('mouse buttons bind while listening', () => {
    const { slots, onChange } = setup()
    fireEvent.mouseDown(slots[2], { button: 0 })
    fireEvent.mouseDown(document.body, { button: 2 })
    expect(onChange).toHaveBeenCalledWith({ jump: 'Space', crouch: 'C', sprint: 'Mouse3' })
  })

  it('left press outside cancels', () => {
    const { slots, onChange, rows } = setup()
    fireEvent.mouseDown(slots[2], { button: 0 })
    fireEvent.mouseDown(document.body, { button: 0 })
    expect(onChange).not.toHaveBeenCalled()
    expect(rows[2].classList.contains('listening')).toBe(false)
  })

  it('right button on a slot does not start listening', () => {
    const { slots, rows } = setup()
    fireEvent.mouseDown(slots[2], { button: 2 })
    expect(rows[2].classList.contains('listening')).toBe(false)
  })

  it('listener_cleanup', () => {
    const add = vi.spyOn(document, 'addEventListener')
    const remove = vi.spyOn(document, 'removeEventListener')
    const { view } = setup()
    const added = add.mock.calls.filter(([type]) => type === 'keydown' || type === 'mousedown')
    expect(added.length).toBeGreaterThan(0)
    view.unmount()
    for (const [type, listener] of added) {
      expect(remove.mock.calls.some(([t, l]) => t === type && l === listener)).toBe(true)
    }
    add.mockRestore()
    remove.mockRestore()
  })
})
