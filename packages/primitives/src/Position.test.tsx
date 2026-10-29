import { describe, expect, it } from 'vitest'
import { render } from '@react-facet/dom-fiber-testing-library'
import { Absolute, Layout3D, Relative, Transform } from './Position'

const boxOf = (view: { container: HTMLElement }) => view.container.firstElementChild as HTMLElement

describe('Absolute', () => {
  it('maps numbers to rem', () => {
    const box = boxOf(render(<Absolute top={2} left={4} />))
    expect(box.style.position).toBe('absolute')
    expect(box.style.top).toBe('2rem')
    expect(box.style.left).toBe('4rem')
  })

  it('passes strings through', () => {
    const box = boxOf(render(<Absolute top="10vh" right="5vw" />))
    expect(box.style.top).toBe('10vh')
    expect(box.style.right).toBe('5vw')
  })

  it('sets no size or inset by default', () => {
    const box = boxOf(render(<Absolute />))
    expect(box.style.width).toBe('')
    expect(box.style.height).toBe('')
    expect(box.style.top).toBe('')
    expect(box.style.left).toBe('')
    expect(box.style.right).toBe('')
    expect(box.style.bottom).toBe('')
  })

  it('centers on one or both axes', () => {
    const both = boxOf(render(<Absolute center />))
    expect(both.style.left).toBe('50%')
    expect(both.style.top).toBe('50%')
    expect(both.style.transform).toBe('translate(-50%, -50%)')
    const x = boxOf(render(<Absolute center="x" />))
    expect(x.style.left).toBe('50%')
    expect(x.style.top).toBe('')
    expect(x.style.transform).toBe('translateX(-50%)')
  })
})

describe('Relative', () => {
  it('is position relative with offsets', () => {
    const box = boxOf(render(<Relative top={1} left="2vw" />))
    expect(box.style.position).toBe('relative')
    expect(box.style.top).toBe('1rem')
    expect(box.style.left).toBe('2vw')
  })
})

describe('Transform', () => {
  it('maps translate, rotate and scale to one string', () => {
    const box = boxOf(
      render(<Transform matrix={{ translate: { x: 10 }, rotate: { z: 15 }, scale: { x: 2, y: 2 } }} />),
    )
    expect(box.style.transform).toBe('translateX(10px) rotateZ(15deg) scaleX(2) scaleY(2)')
  })

  it('maps a single prop', () => {
    expect(boxOf(render(<Transform rotate={{ z: 45 }} />)).style.transform).toBe('rotateZ(45deg)')
    expect(boxOf(render(<Transform translate={{ x: 1, y: 2, z: 3 }} />)).style.transform).toBe(
      'translateX(1px) translateY(2px) translateZ(3px)',
    )
    expect(boxOf(render(<Transform skew={{ x: 15 }} />)).style.transform).toBe('skewX(15deg)')
  })

  it('maps origin', () => {
    expect(boxOf(render(<Transform origin="top right" />)).style.transformOrigin).toBe('top right')
    expect(boxOf(render(<Transform origin={{ x: '10%', y: '20%', z: '0' }} />)).style.transformOrigin).toBe(
      '10% 20% 0',
    )
  })
})

describe('Layout3D', () => {
  it('sets perspective from distance', () => {
    expect(boxOf(render(<Layout3D distance="1000px" />)).style.perspective).toBe('1000px')
  })
})
