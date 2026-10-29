import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, render } from '@react-facet/dom-fiber-testing-library'
import { TestScreen } from './Screen'

const press = (element: Element) =>
  act(() => {
    element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0 }))
  })

const findByText = (container: Element, selector: string, text: string) =>
  Array.from(container.querySelectorAll(selector)).find((element) => element.textContent === text) as Element

const classTokens = (container: Element) => {
  const tokens = new Set<string>()
  container.querySelectorAll('[class]').forEach((element) => {
    element.getAttribute('class')?.split(/\s+/).forEach((token) => tokens.add(token))
  })
  return Array.from(tokens)
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('TestScreen', () => {
  it('renders the panels and the badge', () => {
    const { container } = render(<TestScreen />)
    const text = container.textContent ?? ''
    expect(text).toContain('debug on | route')
    expect(text).toContain('Page')
    expect(text).toContain('Event counts')
    expect(text).toContain('beep (audio)')
  })

  it('increments the counter on +1 press', () => {
    const { container } = render(<TestScreen />)
    const counter = container.querySelector('.tp-counter') as Element
    expect(counter.textContent).toBe('0')
    press(findByText(container, '.oui-button', '+1'))
    expect(counter.textContent).toBe('1')
  })

  it('swaps oui- for jui- classes with the skin switch', () => {
    const { container } = render(<TestScreen />)
    expect(classTokens(container).some((token) => token.startsWith('oui-'))).toBe(true)
    expect(classTokens(container).some((token) => token.startsWith('jui-'))).toBe(false)
    press(findByText(container, '.oui-segment-button', 'JSON UI'))
    expect(classTokens(container).some((token) => token.startsWith('oui-'))).toBe(false)
    expect(classTokens(container).some((token) => token.startsWith('jui-'))).toBe(true)
  })

  it('adds a box per press and wraps after ten', () => {
    const { container } = render(<TestScreen />)
    const addBox = findByText(container, '.oui-button', 'add box')
    for (let i = 0; i < 3; i++) press(addBox)
    expect(container.querySelectorAll('.tp-box')).toHaveLength(3)
    for (let i = 0; i < 8; i++) press(addBox)
    expect(container.querySelectorAll('.tp-box')).toHaveLength(1)
  })

  it('recolors the panel borders', () => {
    const { container } = render(<TestScreen />)
    press(findByText(container, '.oui-button', 'random color'))
    const panel = container.querySelector('.tp-panel') as HTMLElement
    expect(panel.style.borderColor).toMatch(/^rgb\(/)
  })

  it('toggles the badge on press', () => {
    const { container } = render(<TestScreen />)
    press(container.querySelector('.tp-badge') as Element)
    expect(container.querySelector('.tp-badge')?.textContent).toContain('debug off')
  })

  it('removes document and window listeners on unmount', () => {
    const added: Array<[EventTarget, string, unknown]> = []
    const removed: Array<[EventTarget, string, unknown]> = []
    for (const target of [document, window]) {
      const add = target.addEventListener.bind(target)
      const remove = target.removeEventListener.bind(target)
      vi.spyOn(target, 'addEventListener').mockImplementation((type: string, listener: any, options?: any) => {
        added.push([target, type, listener])
        add(type, listener, options)
      })
      vi.spyOn(target, 'removeEventListener').mockImplementation((type: string, listener: any, options?: any) => {
        removed.push([target, type, listener])
        remove(type, listener, options)
      })
    }
    const { unmount } = render(<TestScreen />)
    expect(added.length).toBeGreaterThan(10)
    unmount()
    for (const entry of added) {
      expect(removed.some((other) => other[0] === entry[0] && other[1] === entry[1] && other[2] === entry[2])).toBe(true)
    }
  })

  it('restores console.error on unmount', () => {
    const original = console.error
    const { unmount } = render(<TestScreen />)
    expect(console.error).not.toBe(original)
    unmount()
    expect(console.error).toBe(original)
  })
})
