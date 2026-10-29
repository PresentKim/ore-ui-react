import { describe, expect, it } from 'vitest'
import { createFacet } from '@react-facet/core'
import { act, render } from '@react-facet/dom-fiber-testing-library'
import { Match, State } from './State'

const textOf = (view: { container: HTMLElement }) => view.container.textContent

describe('State', () => {
  it('renders only the matching Match', () => {
    const view = render(
      <State value="b">
        <Match name="a">A</Match>
        <Match name="b">B</Match>
      </State>,
    )
    expect(textOf(view)).toBe('B')
  })

  it('switches when the facet changes', () => {
    const value = createFacet<string>({ initialValue: 'a' })
    const view = render(
      <State value={value}>
        <Match name="a">A</Match>
        <Match name="b">B</Match>
      </State>,
    )
    expect(textOf(view)).toBe('A')
    act(() => value.set('b'))
    expect(textOf(view)).toBe('B')
  })

  it('renders the empty-name fallback when nothing matches', () => {
    const value = createFacet<string>({ initialValue: 'a' })
    const view = render(
      <State value={value}>
        <Match name="">fallback</Match>
        <Match name="a">A</Match>
      </State>,
    )
    expect(textOf(view)).toBe('A')
    act(() => value.set('missing'))
    expect(textOf(view)).toBe('fallback')
  })

  it('renders nothing when nothing matches and no fallback exists', () => {
    const view = render(
      <State value="x">
        <Match name="a">A</Match>
      </State>,
    )
    expect(textOf(view)).toBe('')
  })
})
