import { describe, expect, it } from 'vitest'
import { fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { DEMOS } from './demos/index'

const rootClass: Record<string, string> = {
  button: 'button',
  checkbox: 'checkbox',
  slider: 'slider',
  togglebutton: 'toggle-button',
}

describe('DEMOS', () => {
  describe.each(Object.keys(DEMOS))('%s', (id) => {
    it.each(['oreui', 'jsonui'] as const)('%s renders', (skin) => {
      const { container } = render(DEMOS[id][skin]())
      expect(container.innerHTML.length).toBeGreaterThan(0)
    })

    it('has a code sample', () => {
      expect(DEMOS[id].code.length).toBeGreaterThan(0)
    })
  })

  describe.each(Object.keys(rootClass))('%s', (id) => {
    it.each(['oreui', 'jsonui'] as const)('%s changes state on one press', (skin) => {
      const prefix = skin === 'oreui' ? 'oui' : 'jui'
      const { container } = render(DEMOS[id][skin]())
      const target = container.querySelector(`.${prefix}-${rootClass[id]}:not(.disabled)`) as HTMLElement
      expect(target).toBeTruthy()
      const before = container.innerHTML
      fireEvent.mouseDown(target, { button: 0, clientX: 0 })
      expect(container.innerHTML).not.toBe(before)
    })
  })
})
