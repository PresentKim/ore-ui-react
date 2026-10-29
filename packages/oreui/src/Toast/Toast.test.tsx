import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { createToasts } from '@ore-ui-react/core/src/toast'
import { ToastHost } from './Toast'

const items = (container: HTMLElement) => Array.from(container.querySelectorAll('.oui-toast'))

describe('ToastHost', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('numbers ids t1, t2', () => {
    const toasts = createToasts()
    expect(toasts.show({ text: 'a', timeout: 0 })).toBe('t1')
    expect(toasts.show({ text: 'b', timeout: 0 })).toBe('t2')
  })

  it('renders shown toasts', () => {
    const toasts = createToasts()
    const { container } = render(<ToastHost toasts={toasts} />)
    act(() => {
      toasts.show({ text: 'Saved' })
    })
    expect(items(container)).toHaveLength(1)
    expect(container.textContent).toContain('Saved')
  })

  it('dismiss removes a toast', () => {
    const toasts = createToasts()
    const { container } = render(<ToastHost toasts={toasts} />)
    let id = ''
    act(() => {
      id = toasts.show({ text: 'Saved' })
    })
    act(() => toasts.dismiss(id))
    expect(items(container)).toHaveLength(0)
  })

  it('dismisses after the timeout', () => {
    const toasts = createToasts()
    const { container } = render(<ToastHost toasts={toasts} />)
    act(() => {
      toasts.show({ text: 'Saved', timeout: 1000 })
    })
    act(() => vi.advanceTimersByTime(999))
    expect(items(container)).toHaveLength(1)
    act(() => vi.advanceTimersByTime(1))
    expect(items(container)).toHaveLength(0)
  })

  it('keeps a toast with timeout 0', () => {
    const toasts = createToasts()
    const { container } = render(<ToastHost toasts={toasts} />)
    act(() => {
      toasts.show({ text: 'Saved', timeout: 0 })
    })
    act(() => vi.advanceTimersByTime(60000))
    expect(items(container)).toHaveLength(1)
  })

  it('shows only the newest maxVisible toasts', () => {
    const toasts = createToasts()
    const { container } = render(<ToastHost toasts={toasts} maxVisible={2} />)
    act(() => {
      toasts.show({ text: 'one' })
      toasts.show({ text: 'two' })
      toasts.show({ text: 'three' })
    })
    expect(items(container)).toHaveLength(2)
    expect(container.textContent).not.toContain('one')
    expect(container.textContent).toContain('three')
  })

  it('shows nothing when maxVisible is 0', () => {
    const toasts = createToasts()
    const { container } = render(<ToastHost toasts={toasts} maxVisible={0} />)
    act(() => {
      toasts.show({ text: 'one' })
    })
    expect(items(container)).toHaveLength(0)
  })

  it('dismisses on left mousedown', () => {
    const toasts = createToasts()
    const { container } = render(<ToastHost toasts={toasts} />)
    act(() => {
      toasts.show({ text: 'Saved' })
    })
    fireEvent.mouseDown(items(container)[0], { button: 0 })
    expect(items(container)).toHaveLength(0)
  })

  it('places the host in the position corner', () => {
    const toasts = createToasts()
    const { container } = render(<ToastHost toasts={toasts} position="bottom-left" />)
    expect(container.querySelector('.oui-toast-host')?.className).toContain('bottom-left')
  })

  it('defaults to top-right', () => {
    const { container } = render(<ToastHost toasts={createToasts()} />)
    expect(container.querySelector('.oui-toast-host')?.className).toContain('top-right')
  })
})
