import { describe, expect, it } from 'vitest'
import { render } from '@react-facet/dom-fiber-testing-library'
import { Block, Column, Flex, Row } from './Box'

const boxOf = (view: { container: HTMLElement }) => view.container.firstElementChild as HTMLElement

describe('boxes', () => {
  it('Block is a block box', () => {
    expect(boxOf(render(<Block />)).style.display).toBe('block')
  })

  it('Row is a flex row', () => {
    const box = boxOf(render(<Row />))
    expect(box.style.display).toBe('flex')
    expect(box.style.flexDirection).toBe('row')
  })

  it('Column is a flex column', () => {
    const box = boxOf(render(<Column />))
    expect(box.style.display).toBe('flex')
    expect(box.style.flexDirection).toBe('column')
  })

  it('Flex passes direction, wrap, align and justify', () => {
    const box = boxOf(render(<Flex direction="column-reverse" wrap="wrap" align="center" justify="space-between" />))
    expect(box.style.flexDirection).toBe('column-reverse')
    expect(box.style.flexWrap).toBe('wrap')
    expect(box.style.alignItems).toBe('center')
    expect(box.style.justifyContent).toBe('space-between')
  })

  it('renders children, className and style', () => {
    const box = boxOf(render(<Row className="x" style={{ color: 'red' }}>hi</Row>))
    expect(box.textContent).toBe('hi')
    expect(box.className).toContain('x')
    expect(box.style.color).toBe('red')
  })
})
