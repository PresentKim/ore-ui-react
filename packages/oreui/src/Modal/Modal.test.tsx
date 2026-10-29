import { describe, expect, it, vi } from 'vitest'
import { createFacet } from '@react-facet/core'
import { act, fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { Modal } from './Modal'

const readCss = async () => {
  const fs = await vi.importActual<{ readFileSync: (path: string, encoding: string) => string }>('node:fs')
  return fs.readFileSync('packages/oreui/src/Modal/modal.css', 'utf8')
}

const overlay = (container: HTMLElement) => container.querySelector('.oui-modal') as HTMLElement
const windowOf = (container: HTMLElement) => container.querySelector('.oui-modal-window') as HTMLElement

describe('Modal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<Modal open={false}>Body</Modal>)
    expect(overlay(container)).toBeNull()
  })

  it('renders title, children and actions when open', () => {
    const { container } = render(
      <Modal open title="Quit" actions={<span>Yes</span>}>
        Body
      </Modal>,
    )
    expect(container.textContent).toContain('Quit')
    expect(container.textContent).toContain('Body')
    expect(container.textContent).toContain('Yes')
  })

  it('follows the open facet', () => {
    const open = createFacet({ initialValue: false })
    const { container } = render(<Modal open={open}>Body</Modal>)
    expect(overlay(container)).toBeNull()
    act(() => open.set(true))
    expect(overlay(container)).not.toBeNull()
    act(() => open.set(false))
    expect(overlay(container)).toBeNull()
  })

  it('calls onClose on overlay mousedown', () => {
    const onClose = vi.fn()
    const { container } = render(
      <Modal open onClose={onClose}>
        Body
      </Modal>,
    )
    fireEvent.mouseDown(overlay(container), { button: 0 })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('keeps presses inside the window', () => {
    const onClose = vi.fn()
    const { container } = render(
      <Modal open onClose={onClose}>
        Body
      </Modal>,
    )
    fireEvent.mouseDown(windowOf(container), { button: 0 })
    expect(onClose).not.toHaveBeenCalled()
  })

  it('closes on Escape only while open', () => {
    const onClose = vi.fn()
    const open = createFacet({ initialValue: true })
    render(
      <Modal open={open} onClose={onClose}>
        Body
      </Modal>,
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
    act(() => open.set(false))
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('sizes the overlay in vw and vh, not percent', async () => {
    const css = await readCss()
    const rule = css.slice(css.indexOf('.oui-modal {'), css.indexOf('}', css.indexOf('.oui-modal {')))
    expect(rule).toContain('100vw')
    expect(rule).toContain('100vh')
    expect(rule).not.toContain('%')
  })
})
