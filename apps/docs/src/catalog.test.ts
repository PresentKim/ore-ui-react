import { describe, expect, it } from 'vitest'
import { CATALOG } from './catalog'
import type { CatalogEntry } from './catalog'
import { DEMOS } from './demos/index'

const all = CATALOG.reduce<CatalogEntry[]>((acc, c) => acc.concat(c.entries), [])

describe('CATALOG', () => {
  it('lists categories in order', () => {
    expect(CATALOG.map((c) => c.id)).toEqual(['basic', 'complex', 'feedback', 'layout', 'media', 'minecraft'])
  })

  it('lists Gameface entries', () => {
    const names = (id: string) => CATALOG.find((c) => c.id === id)!.entries.map((e) => e.name)
    expect(names('basic')).toEqual([
      'Accordion', 'Button', 'Checkbox', 'Dropdown', 'InlineTextBlock', 'Input', 'Keybinds',
      'Pagination', 'RadioGroup', 'RoundedButton', 'Segment', 'Slider', 'State', 'Stepper',
      'TextBlock', 'TextSlider', 'ToggleButton', 'TwoHandleSlider', 'XYSlider',
    ])
    expect(names('complex')).toEqual(['Carousel', 'ColorPicker', 'RadialMenu', 'Tutorial'])
    expect(names('feedback')).toEqual(['Chart', 'Modal', 'Progress', 'Toast', 'Tooltip'])
    expect(names('layout')).toEqual([
      'Absolute', 'Block', 'Bottom', 'Column', 'Content', 'Flex', 'Grid', 'GridTile', 'Layout',
      'Layout3D', 'List', 'Relative', 'Row', 'Scroll', 'Tab', 'TabLink', 'Tabs', 'Top', 'Transform',
    ])
    expect(names('media')).toEqual(['Image', 'LiveView', 'MaskImage'])
  })

  it('builds a Gameface entry', () => {
    expect(CATALOG[0].entries[0]).toMatchObject({
      id: 'accordion',
      name: 'Accordion',
      source: 'https://github.com/CoherentLabs/Gameface-UI/tree/main/src/components/Basic/Accordion',
    })
  })

  it('ready_has_demo', () => {
    for (const entry of all) {
      expect(entry.status).toBe(entry.id in DEMOS ? 'ready' : 'planned')
    }
    expect(Object.keys(DEMOS).filter((id) => !all.some((e) => e.id === id))).toEqual([])
  })

  it('keeps liveview planned', () => {
    expect(all.find((e) => e.id === 'liveview')!.status).toBe('planned')
  })

  it('sizedbox_listed', () => {
    const category = CATALOG.find((c) => c.title === 'Minecraft')!
    expect(category.entries).toHaveLength(1)
    expect(category.entries[0]).toMatchObject({ id: 'sizedbox', name: 'SizedBox', status: 'ready' })
    expect(category.entries[0].source).toBeUndefined()
  })
})
