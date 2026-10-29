import { afterEach, describe, expect, it } from 'vitest'
import { act, fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { Scroll } from './Scroll'

const tops = new WeakMap<Element, number>()
const sizes = { view: 100, full: 400, track: 100 }

const restore: Array<() => void> = []
const define = (name: string, descriptor: PropertyDescriptor) => {
  const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, name)
  Object.defineProperty(HTMLElement.prototype, name, { configurable: true, ...descriptor })
  restore.push(() =>
    original ? Object.defineProperty(HTMLElement.prototype, name, original) : delete (HTMLElement.prototype as never)[name],
  )
}

const mockLayout = () => {
  define('clientHeight', {
    get(this: HTMLElement) {
      return this.classList.contains('jui-scroll-bar') ? sizes.track : sizes.view
    },
  })
  define('scrollHeight', {
    get() {
      return sizes.full
    },
  })
  define('scrollTop', {
    get(this: HTMLElement) {
      return tops.get(this) ?? 0
    },
    set(this: HTMLElement, value: number) {
      tops.set(this, Math.max(0, Math.min(value, sizes.full - sizes.view)))
    },
  })
}

afterEach(() => {
  restore.splice(0).forEach((undo) => undo())
  sizes.view = 100
  sizes.full = 400
  sizes.track = 100
})

const setup = (end = false) => {
  mockLayout()
  const view = render(
    <Scroll end={end}>
      <div>Row</div>
    </Scroll>,
  )
  const content = view.container.querySelector('.jui-scroll-content') as HTMLElement
  const bar = view.container.querySelector('.jui-scroll-bar') as HTMLElement
  const handle = view.container.querySelector('.jui-scroll-handle') as HTMLElement
  return { view, content, bar, handle }
}

describe('jsonui Scroll', () => {
  it('shows the bar when content overflows', () => {
    const { bar, handle } = setup()
    expect(bar.style.display).toBe('flex')
    expect(handle.style.height).toBe('25px')
  })

  it('no_overflow_hides_bar', () => {
    sizes.full = 100
    expect(setup().bar.style.display).toBe('none')
  })

  it('wheel scrolls the content', () => {
    const { content } = setup()
    fireEvent.wheel(content, { deltaY: 90 })
    expect(content.scrollTop).toBe(90)
  })

  it('drag_thumb scrolls proportionally', () => {
    const { content, handle } = setup()
    fireEvent.mouseDown(handle, { button: 0, clientY: 0 })
    fireEvent.mouseMove(document, { clientY: 30 })
    expect(content.scrollTop).toBe(120)
    fireEvent.mouseUp(document)
  })

  it('end_sticks when content grows', async () => {
    const { content } = setup(true)
    expect(content.scrollTop).toBe(300)
    sizes.full = 500
    await act(async () => {
      content.appendChild(document.createElement('div'))
      await new Promise((resolve) => setTimeout(resolve, 0))
    })
    expect(content.scrollTop).toBe(400)
  })
})
