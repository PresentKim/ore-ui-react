import { describe, expect, it, vi } from 'vitest'
import { createFacet } from '@react-facet/core'
import { act, fireEvent, render } from '@react-facet/dom-fiber-testing-library'
import { Tab, TabLink, Tabs } from './Tabs'

const setup = (initial = 'a') => {
  const active = createFacet({ initialValue: initial })
  const onChange = vi.fn()
  const view = render(
    <Tabs active={active} onChange={onChange}>
      <div>
        <TabLink id="a">One</TabLink>
        <TabLink id="b">Two</TabLink>
        <TabLink id="c" disabled>
          Three
        </TabLink>
      </div>
      <Tab id="a">Panel A</Tab>
      <Tab id="b">Panel B</Tab>
    </Tabs>,
  )
  const links = Array.from(view.container.querySelectorAll('.jui-tablink')) as HTMLElement[]
  return { active, onChange, view, links }
}

describe('jsonui Tabs', () => {
  it('only_active_panel renders', () => {
    const { active, view } = setup()
    expect(view.container.textContent).toContain('Panel A')
    expect(view.container.textContent).not.toContain('Panel B')
    act(() => active.set('b'))
    expect(view.container.textContent).toContain('Panel B')
    expect(view.container.textContent).not.toContain('Panel A')
  })

  it('groups bare TabLinks in one link bar', () => {
    const active = createFacet({ initialValue: 'a' })
    const { container } = render(
      <Tabs active={active}>
        <TabLink id="a">One</TabLink>
        <Tab id="a">Panel A</Tab>
        <TabLink id="b">Two</TabLink>
      </Tabs>,
    )
    const bar = container.querySelector('.jui-tabs-bar') as HTMLElement
    expect(bar.querySelectorAll('.jui-tablink')).toHaveLength(2)
    expect(bar.querySelector('.jui-tab')).toBeNull()
    expect(container.querySelectorAll('.jui-tabs-bar')).toHaveLength(1)
  })

  it('pressing a TabLink calls onChange with its id', () => {
    const { links, onChange } = setup()
    fireEvent.mouseDown(links[1], { button: 0 })
    expect(onChange).toHaveBeenCalledWith('b')
  })

  it('controlled', () => {
    const { links, active } = setup()
    fireEvent.mouseDown(links[1], { button: 0 })
    expect(links[0].className).toContain('active')
    active.set('b')
    expect(links[1].className).toContain('active')
    expect(links[0].className).not.toContain('active')
  })

  it('disabled link and right button ignored', () => {
    const { links, onChange } = setup()
    fireEvent.mouseDown(links[2], { button: 0 })
    fireEvent.mouseDown(links[1], { button: 2 })
    expect(onChange).not.toHaveBeenCalled()
  })
})
