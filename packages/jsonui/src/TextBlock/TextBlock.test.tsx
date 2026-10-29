import { describe, expect, it } from 'vitest'
import { createFacet } from '@react-facet/core'
import { act, render } from '@react-facet/dom-fiber-testing-library'
import { InlineTextBlock, TextBlock } from './TextBlock'

const rootOf = (view: { container: HTMLElement }) => view.container.firstElementChild as HTMLElement

describe('TextBlock', () => {
  it('renders a block with the body variant by default', () => {
    const box = rootOf(render(<TextBlock text="Hello" />))
    expect(box.tagName).toBe('DIV')
    expect(box.className).toBe('jui-textblock jui-textblock-body')
    expect(box.textContent).toBe('Hello')
  })

  it('sets the variant class and passes className and style', () => {
    const box = rootOf(render(<TextBlock text="T" variant="title" className="x" style={{ color: 'red' }} />))
    expect(box.className).toBe('jui-textblock jui-textblock-title x')
    expect(box.style.color).toBe('red')
  })

  it('renders children when text is absent', () => {
    expect(rootOf(render(<TextBlock>child</TextBlock>)).textContent).toBe('child')
  })

  it('updates a facet text without re-rendering', () => {
    const text = createFacet<string>({ initialValue: 'a' })
    let renders = 0
    const Probe = () => {
      renders += 1
      return <TextBlock text={text} />
    }
    const box = rootOf(render(<Probe />))
    expect(box.textContent).toBe('a')
    act(() => text.set('b'))
    expect(box.textContent).toBe('b')
    expect(renders).toBe(1)
  })

  it('renders html markup literally', () => {
    const box = rootOf(render(<TextBlock text="<b>bold</b>" />))
    expect(box.textContent).toBe('<b>bold</b>')
    expect(box.querySelector('b')).toBeNull()
  })
})

describe('InlineTextBlock', () => {
  it('renders an inline span', () => {
    const box = rootOf(render(<InlineTextBlock text="Hi" variant="caption" />))
    expect(box.tagName).toBe('SPAN')
    expect(box.className).toBe('jui-textblock jui-textblock-inline jui-textblock-caption')
    expect(box.textContent).toBe('Hi')
  })
})
