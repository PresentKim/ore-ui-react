import { describe, expect, it } from 'vitest'
import { act, render } from '@react-facet/dom-fiber-testing-library'
import { TestScreen } from './Screen'
import { DEMOS } from '../../docs/src/demos/index'

const press = (element: Element) =>
  act(() => {
    element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0 }))
  })

const linkNamed = (container: Element, name: string) =>
  Array.from(container.querySelectorAll('.tp-link')).find((element) => element.textContent === name) as Element

describe('TestScreen', () => {
  it('lists every demo in the sidebar', () => {
    const { container } = render(<TestScreen />)
    expect(container.querySelectorAll('.tp-link')).toHaveLength(Object.keys(DEMOS).length)
  })

  it('shows the selected component in both skins', () => {
    const { container } = render(<TestScreen />)
    press(linkNamed(container, 'Dropdown'))
    expect(container.querySelector('.tp-heading')?.textContent).toBe('Dropdown')
    expect(container.querySelector('.oui-dropdown')).not.toBeNull()
    expect(container.querySelector('.jui-dropdown')).not.toBeNull()
  })

  it('renders every demo without throwing', () => {
    const { container } = render(<TestScreen />)
    Array.from(container.querySelectorAll('.tp-link')).forEach((link) => {
      press(link)
      expect(container.querySelector('.tp-link.active')?.textContent).toBe(link.textContent)
    })
  })

  it('hides and shows the gallery from the badge', () => {
    const { container } = render(<TestScreen />)
    press(container.querySelector('.tp-badge') as Element)
    expect(container.querySelector('.tp-window')).toBeNull()
    press(container.querySelector('.tp-badge') as Element)
    expect(container.querySelector('.tp-window')).not.toBeNull()
  })
})
