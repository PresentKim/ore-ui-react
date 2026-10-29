import type { ReactElement } from 'react'

export type Demo = {
  oreui: () => ReactElement
  jsonui: () => ReactElement
  code: string
}

export type CatalogEntry = {
  id: string
  name: string
  source: string
  status: 'ready' | 'planned'
}

export type CatalogCategory = {
  id: string
  title: string
  entries: CatalogEntry[]
}

const READY = ['button', 'checkbox', 'slider', 'togglebutton']

const NAMES: Record<string, string[]> = {
  Basic: [
    'Accordion',
    'Button',
    'Checkbox',
    'Dropdown',
    'InlineTextBlock',
    'Input',
    'Keybinds',
    'Pagination',
    'RadioGroup',
    'RoundedButton',
    'Segment',
    'Slider',
    'State',
    'Stepper',
    'TextBlock',
    'TextSlider',
    'ToggleButton',
    'TwoHandleSlider',
    'XYSlider',
  ],
  Complex: ['Carousel', 'ColorPicker', 'RadialMenu', 'Tutorial'],
  Feedback: ['Chart', 'Modal', 'Progress', 'Toast', 'Tooltip'],
  Layout: [
    'Absolute',
    'Block',
    'Bottom',
    'Column',
    'Content',
    'Flex',
    'Grid',
    'GridTile',
    'Layout',
    'Layout3D',
    'List',
    'Relative',
    'Row',
    'Scroll',
    'Tab',
    'TabLink',
    'Tabs',
    'Top',
    'Transform',
  ],
  Media: ['Image', 'LiveView', 'MaskImage'],
}

const SOURCE_ROOT = 'https://github.com/CoherentLabs/Gameface-UI/tree/main/src/components'

export const CATALOG: CatalogCategory[] = Object.keys(NAMES).map((title) => ({
  id: title.toLowerCase(),
  title,
  entries: NAMES[title].map((name) => {
    const id = name.toLowerCase()
    return {
      id,
      name,
      source: `${SOURCE_ROOT}/${title}/${name}`,
      status: READY.includes(id) ? 'ready' : 'planned',
    }
  }),
}))
