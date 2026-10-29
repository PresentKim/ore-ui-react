import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { sectorOf } from '@ore-ui-react/core/src/radialmenu'
import { RadialMenu } from './RadialMenu'

const setup = () => {
  const onChange = vi.fn()
  const view = render(<RadialMenu items={['a', 'b', 'c', 'd']} onChange={onChange} />)
  const root = view.container.querySelector('.oui-radialmenu') as HTMLElement
  const items = Array.from(view.container.querySelectorAll('.oui-radialmenu-item')) as HTMLElement[]
  return { onChange, root, items }
}

describe('oreui RadialMenu', () => {
  beforeEach(() => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 240,
      height: 240,
      right: 240,
      bottom: 240,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('sectorOf is clockwise from the top', () => {
    expect(sectorOf(0, -10, 4)).toBe(0)
    expect(sectorOf(10, 0, 4)).toBe(1)
    expect(sectorOf(0, 10, 4)).toBe(2)
    expect(sectorOf(-10, 0, 4)).toBe(3)
  })

  it('dead_zone selects nothing', () => {
    const { root, items, onChange } = setup()
    fireEvent.mouseMove(root, { clientX: 120, clientY: 100 })
    expect(root.querySelector('.active')).toBeNull()
    fireEvent.mouseDown(root, { button: 0, clientX: 120, clientY: 100 })
    expect(onChange).not.toHaveBeenCalled()
    expect(items).toHaveLength(4)
  })

  it('places items on a circle', () => {
    const { items } = setup()
    expect(items[0].style.left).toBe('12rem')
    expect(items[0].style.top).toBe('3.5rem')
    expect(items[1].style.left).toBe('20.5rem')
  })

  it('pointer move highlights the sector', () => {
    const { root, items } = setup()
    fireEvent.mouseMove(root, { clientX: 220, clientY: 120 })
    expect(items[1].className).toContain('active')
    expect(items[0].className).not.toContain('active')
    fireEvent.mouseLeave(root)
    expect(root.querySelector('.active')).toBeNull()
  })

  it('mousedown calls onChange with the index', () => {
    const { root, onChange } = setup()
    fireEvent.mouseDown(root, { button: 0, clientX: 120, clientY: 220 })
    expect(onChange).toHaveBeenCalledWith(2)
  })
})
