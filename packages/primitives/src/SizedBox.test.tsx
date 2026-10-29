import { afterEach, describe, expect, it } from 'vitest'
import { Facet } from '@react-facet/core'
import { act, render } from '@react-facet/dom-fiber-testing-library'
import { SizedBox } from './SizedBox'
import { useSizeClass } from './sizeClass'

const boxOf = (view: { container: HTMLElement }) => view.container.firstElementChild as HTMLElement

const setWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', { value: width, configurable: true })
  window.dispatchEvent(new Event('resize'))
}

describe('SizedBox', () => {
  afterEach(() => setWidth(1024))

  it('renders GUI px sizes as rem', () => {
    const box = boxOf(render(<SizedBox width={326} height={166} />))
    expect(box.style.width).toBe('65.2rem')
    expect(box.style.height).toBe('33.2rem')
  })

  it('caps to 96vw and 96vh by default', () => {
    const box = boxOf(render(<SizedBox />))
    expect(box.style.maxWidth).toBe('96vw')
    expect(box.style.maxHeight).toBe('96vh')
  })

  it('takes explicit caps', () => {
    const box = boxOf(render(<SizedBox maxWidth="50vw" maxHeight="40vh" />))
    expect(box.style.maxWidth).toBe('50vw')
    expect(box.style.maxHeight).toBe('40vh')
  })

  it('fixed sets flex-shrink 0', () => {
    expect(boxOf(render(<SizedBox fixed />)).style.flexShrink).toBe('0')
    expect(boxOf(render(<SizedBox />)).style.flexShrink).toBe('')
  })

  it('passes string sizes, className and style through', () => {
    const box = boxOf(render(<SizedBox width="50vw" className="extra" style={{ color: 'red' }} />))
    expect(box.style.width).toBe('50vw')
    expect(box.className).toContain('extra')
    expect(box.style.color).toBe('red')
  })
})

describe('useSizeClass', () => {
  afterEach(() => setWidth(1024))

  it('updates the facet on window resize', () => {
    let facet: Facet<'s' | 'm' | 'l'> | undefined
    const Probe = () => {
      facet = useSizeClass()
      return <fast-div />
    }
    setWidth(800)
    render(<Probe />)
    expect(facet?.get()).toBe('s')
    act(() => setWidth(1200))
    expect(facet?.get()).toBe('m')
    act(() => setWidth(1700))
    expect(facet?.get()).toBe('l')
  })
})
