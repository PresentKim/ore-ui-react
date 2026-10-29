import { describe, expect, it } from 'vitest'
import { CATALOG } from './catalog'
import type { CatalogEntry } from './catalog'

describe('CATALOG', () => {
  it('lists categories in order', () => {
    expect(CATALOG.map((c) => c.id)).toEqual(['basic', 'complex', 'feedback', 'layout', 'media'])
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

  it('builds the first entry', () => {
    expect(CATALOG[0].entries[0]).toEqual({
      id: 'accordion',
      name: 'Accordion',
      source: 'https://github.com/CoherentLabs/Gameface-UI/tree/main/src/components/Basic/Accordion',
      status: 'planned',
    })
  })

  it('marks exactly four entries ready', () => {
    const all = CATALOG.reduce<CatalogEntry[]>((acc, c) => acc.concat(c.entries), [])
    const ready = all.filter((e) => e.status === 'ready')
    expect(ready.map((e) => e.id).sort()).toEqual(['button', 'checkbox', 'slider', 'togglebutton'])
  })
})
