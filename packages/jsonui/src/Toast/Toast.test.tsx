import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { LAYER_ID } from '@ore-ui-react/core/src/layer'
import { createToasts } from '@ore-ui-react/core/src/toast'
import { ToastHost } from './Toast'

const layer = () => document.getElementById(LAYER_ID) as HTMLElement
const items = () => Array.from(layer().querySelectorAll('.jui-toast'))

describe('ToastHost', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('renders shown toasts', () => {
    const toasts = createToasts()
    render(<ToastHost toasts={toasts} />)
    act(() => {
      toasts.show({ text: 'Saved' })
    })
    expect(items()).toHaveLength(1)
    expect(layer().textContent).toContain('Saved')
  })

  it('dismiss removes a toast', () => {
    const toasts = createToasts()
    render(<ToastHost toasts={toasts} />)
    let id = ''
    act(() => {
      id = toasts.show({ text: 'Saved' })
    })
    act(() => toasts.dismiss(id))
    expect(items()).toHaveLength(0)
  })

  it('dismisses after the timeout', () => {
    const toasts = createToasts()
    render(<ToastHost toasts={toasts} />)
    act(() => {
      toasts.show({ text: 'Saved', timeout: 1000 })
    })
    act(() => vi.advanceTimersByTime(999))
    expect(items()).toHaveLength(1)
    act(() => vi.advanceTimersByTime(1))
    expect(items()).toHaveLength(0)
  })

  it('keeps a toast with timeout 0', () => {
    const toasts = createToasts()
    render(<ToastHost toasts={toasts} />)
    act(() => {
      toasts.show({ text: 'Saved', timeout: 0 })
    })
    act(() => vi.advanceTimersByTime(60000))
    expect(items()).toHaveLength(1)
  })

  it('shows only the newest maxVisible toasts', () => {
    const toasts = createToasts()
    render(<ToastHost toasts={toasts} maxVisible={2} />)
    act(() => {
      toasts.show({ text: 'one' })
      toasts.show({ text: 'two' })
      toasts.show({ text: 'three' })
    })
    expect(items()).toHaveLength(2)
    expect(layer().textContent).not.toContain('one')
    expect(layer().textContent).toContain('three')
  })

  it('shows nothing when maxVisible is 0', () => {
    const toasts = createToasts()
    render(<ToastHost toasts={toasts} maxVisible={0} />)
    act(() => {
      toasts.show({ text: 'one' })
    })
    expect(items()).toHaveLength(0)
  })

  it('dismisses on left mousedown', () => {
    const toasts = createToasts()
    render(<ToastHost toasts={toasts} />)
    act(() => {
      toasts.show({ text: 'Saved' })
    })
    fireEvent.mouseDown(items()[0], { button: 0 })
    expect(items()).toHaveLength(0)
  })

  it('places the host in the position corner', () => {
    const toasts = createToasts()
    render(<ToastHost toasts={toasts} position="bottom-left" />)
    expect(layer().querySelector('.jui-toast-host')?.className).toContain('bottom-left')
  })

  it('defaults to top-right', () => {
    render(<ToastHost toasts={createToasts()} />)
    expect(layer().querySelector('.jui-toast-host')?.className).toContain('top-right')
  })
})
