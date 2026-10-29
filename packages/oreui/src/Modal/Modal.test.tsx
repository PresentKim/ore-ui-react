import { afterEach, describe, expect, it, vi } from 'vitest'
import { createFacet } from '@react-facet/core'
import { act, cleanup, fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { LAYER_ID } from '@ore-ui-react/core/src/layer'
import { Modal } from './Modal'

afterEach(cleanup)

const readCss = async () => {
  const fs = await vi.importActual<{ readFileSync: (path: string, encoding: string) => string }>('node:fs')
  return fs.readFileSync('packages/oreui/src/Modal/modal.css', 'utf8')
}

const layer = () => document.getElementById(LAYER_ID) as HTMLElement
const overlay = () => document.querySelector(`#${LAYER_ID} .oui-modal`) as HTMLElement
const windowOf = () => document.querySelector(`#${LAYER_ID} .oui-modal-window`) as HTMLElement

describe('Modal', () => {
  it('renders nothing when closed', () => {
    render(<Modal open={false}>Body</Modal>)
    expect(overlay()).toBeNull()
  })

  it('renders title, children and actions when open', () => {
    render(
      <Modal open title="Quit" actions={<span>Yes</span>}>
        Body
      </Modal>,
    )
    expect(layer().textContent).toContain('Quit')
    expect(layer().textContent).toContain('Body')
    expect(layer().textContent).toContain('Yes')
  })

  it('follows the open facet', () => {
    const open = createFacet({ initialValue: false })
    render(<Modal open={open}>Body</Modal>)
    expect(overlay()).toBeNull()
    act(() => open.set(true))
    expect(overlay()).not.toBeNull()
    act(() => open.set(false))
    expect(overlay()).toBeNull()
  })

  it('calls onClose on overlay mousedown', () => {
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose}>
        Body
      </Modal>,
    )
    fireEvent.mouseDown(overlay(), { button: 0 })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('keeps presses inside the window', () => {
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose}>
        Body
      </Modal>,
    )
    fireEvent.mouseDown(windowOf(), { button: 0 })
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
