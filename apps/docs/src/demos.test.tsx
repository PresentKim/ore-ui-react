import { describe, expect, it } from 'vitest'
import { fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { CATALOG } from './catalog'
import type { CatalogEntry } from './catalog'
import { DEMOS } from './demos'

const readyIds = CATALOG.reduce<CatalogEntry[]>((all, category) => all.concat(category.entries), [])
  .filter((entry) => entry.status === 'ready')
  .map((entry) => entry.id)
  .sort()

const rootClass: Record<string, string> = {
  button: 'button',
  checkbox: 'checkbox',
  slider: 'slider',
  togglebutton: 'toggle-button',
}

describe('DEMOS', () => {
  it('ready_has_demo', () => {
    expect(Object.keys(DEMOS).sort()).toEqual(readyIds)
  })

  describe.each(Object.keys(DEMOS))('%s', (id) => {
    it.each(['oreui', 'jsonui'] as const)('%s renders and one press changes state', (skin) => {
      const prefix = skin === 'oreui' ? 'oui' : 'jui'
      const { container } = render(DEMOS[id][skin]())
      const target = container.querySelector(`.${prefix}-${rootClass[id]}:not(.disabled)`) as HTMLElement
      expect(target).toBeTruthy()
      const before = container.innerHTML
      fireEvent.mouseDown(target, { button: 0, clientX: 0 })
      expect(container.innerHTML).not.toBe(before)
    })

    it('has a code sample', () => {
      expect(DEMOS[id].code.length).toBeGreaterThan(0)
    })
  })
})
