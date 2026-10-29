import { describe, expect, it, vi } from 'vitest'
import { createFacet } from '@react-facet/core'
import { fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { Accordion, AccordionItem } from './Accordion'

const setup = (props: { multiple?: boolean; accordionDisabled?: boolean; expanded?: string[] } = {}) => {
  const expanded = props.expanded ? createFacet({ initialValue: props.expanded }) : undefined
  const itemDisabled = createFacet({ initialValue: false })
  const onChange = vi.fn()
  const view = render(
    <Accordion multiple={props.multiple} expanded={expanded} disabled={props.accordionDisabled} onChange={onChange}>
      <AccordionItem id="a" title="Alpha">
        Body A
      </AccordionItem>
      <AccordionItem id="b" title="Beta" disabled={itemDisabled}>
        Body B
      </AccordionItem>
      <AccordionItem id="c" title="Gamma">
        Body C
      </AccordionItem>
    </Accordion>,
  )
  const items = Array.from(view.container.querySelectorAll('.oui-accordion-item')) as HTMLElement[]
  const heads = Array.from(view.container.querySelectorAll('.oui-accordion-heading')) as HTMLElement[]
  const bodies = Array.from(view.container.querySelectorAll('.oui-accordion-body')) as HTMLElement[]
  const isOpen = (index: number) => items[index].classList.contains('open') && bodies[index].style.display !== 'none'
  return { expanded, itemDisabled, onChange, items, heads, bodies, isOpen }
}

describe('oreui Accordion', () => {
  it('pressing a heading toggles its body', () => {
    const { heads, isOpen } = setup()
    expect(isOpen(0)).toBe(false)
    fireEvent.mouseDown(heads[0], { button: 0 })
    expect(isOpen(0)).toBe(true)
    fireEvent.mouseDown(heads[0], { button: 0 })
    expect(isOpen(0)).toBe(false)
  })

  it('expanded facet controls open items', () => {
    const { expanded, heads, isOpen, onChange } = setup({ expanded: ['c'] })
    expect(isOpen(2)).toBe(true)
    expanded?.set(['a'])
    expect(isOpen(0)).toBe(true)
    expect(isOpen(2)).toBe(false)
    fireEvent.mouseDown(heads[2], { button: 0 })
    expect(onChange).toHaveBeenCalledWith(['c'])
    expect(isOpen(2)).toBe(false)
  })

  it('onChange reports the open ids', () => {
    const { heads, onChange } = setup({ multiple: true })
    fireEvent.mouseDown(heads[0], { button: 0 })
    fireEvent.mouseDown(heads[2], { button: 0 })
    expect(onChange).toHaveBeenLastCalledWith(['a', 'c'])
    fireEvent.mouseDown(heads[0], { button: 0 })
    expect(onChange).toHaveBeenLastCalledWith(['c'])
  })

  it('multiple_off: opening one closes the other', () => {
    const { heads, isOpen } = setup()
    fireEvent.mouseDown(heads[0], { button: 0 })
    fireEvent.mouseDown(heads[2], { button: 0 })
    expect(isOpen(0)).toBe(false)
    expect(isOpen(2)).toBe(true)
  })

  it('multiple keeps both open', () => {
    const { heads, isOpen } = setup({ multiple: true })
    fireEvent.mouseDown(heads[0], { button: 0 })
    fireEvent.mouseDown(heads[2], { button: 0 })
    expect(isOpen(0)).toBe(true)
    expect(isOpen(2)).toBe(true)
  })

  it('disabled_item ignores presses and flips with its facet', () => {
    const { heads, items, itemDisabled, isOpen, onChange } = setup()
    itemDisabled.set(true)
    expect(items[1].classList.contains('disabled')).toBe(true)
    fireEvent.mouseDown(heads[1], { button: 0 })
    expect(isOpen(1)).toBe(false)
    expect(onChange).not.toHaveBeenCalled()
    itemDisabled.set(false)
    fireEvent.mouseDown(heads[1], { button: 0 })
    expect(isOpen(1)).toBe(true)
  })

  it('disabled accordion ignores presses', () => {
    const { heads, isOpen } = setup({ accordionDisabled: true })
    fireEvent.mouseDown(heads[0], { button: 0 })
    expect(isOpen(0)).toBe(false)
  })

  it('right button ignored', () => {
    const { heads, isOpen } = setup()
    fireEvent.mouseDown(heads[0], { button: 2 })
    expect(isOpen(0)).toBe(false)
  })
})
