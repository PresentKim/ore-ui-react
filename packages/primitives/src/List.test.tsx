import { describe, expect, it } from 'vitest'
import { render } from '@react-facet/dom-fiber-testing-library'
import { List, ListItem } from './List'

const markersOf = (view: { container: HTMLElement }) =>
  Array.from(view.container.querySelectorAll('.ou-list-marker')).map((marker) => marker.textContent)

describe('List', () => {
  it('renders a marker per item', () => {
    const view = render(
      <List>
        <ListItem>a</ListItem>
        <ListItem>b</ListItem>
        <ListItem>c</ListItem>
      </List>,
    )
    expect(markersOf(view)).toHaveLength(3)
    const bodies = Array.from(view.container.querySelectorAll('.ou-list-body')).map((body) => body.textContent)
    expect(bodies).toEqual(['a', 'b', 'c'])
  })

  it('numbers items when ordered', () => {
    const view = render(
      <List ordered>
        <ListItem>a</ListItem>
        <ListItem>b</ListItem>
      </List>,
    )
    expect(markersOf(view)).toEqual(['1.', '2.'])
  })

  it('uses the bullet style', () => {
    const disc = render(
      <List>
        <ListItem>a</ListItem>
      </List>,
    )
    const square = render(
      <List bullet="square">
        <ListItem>a</ListItem>
      </List>,
    )
    const none = render(
      <List bullet="none">
        <ListItem>a</ListItem>
      </List>,
    )
    expect(markersOf(disc)[0]).toBe('•')
    expect(markersOf(square)[0]).toBe('▪')
    expect(markersOf(none)[0]).toBe('')
  })

  it('numbers with bullet number', () => {
    const view = render(
      <List bullet="number">
        <ListItem>a</ListItem>
      </List>,
    )
    expect(markersOf(view)).toEqual(['1.'])
  })

  it('nests a List inside an item', () => {
    const view = render(
      <List>
        <ListItem>
          a
          <List>
            <ListItem>a1</ListItem>
          </List>
        </ListItem>
      </List>,
    )
    expect(markersOf(view)).toHaveLength(2)
  })
})
