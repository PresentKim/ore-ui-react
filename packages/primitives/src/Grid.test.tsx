import { describe, expect, it } from 'vitest'
import { render } from '@react-facet/dom-fiber-testing-library'
import { Grid, GridTile } from './Grid'

const rowsOf = (view: { container: HTMLElement }) =>
  Array.from((view.container.firstElementChild as HTMLElement).children) as HTMLElement[]

const tiles = (count: number) =>
  Array.from({ length: count }, (_, index) => <GridTile key={index}>{index}</GridTile>)

describe('Grid', () => {
  it('lays 7 tiles out as rows of 3, 3 and 1', () => {
    const rows = rowsOf(render(<Grid cols={3}>{tiles(7)}</Grid>))
    expect(rows.map((row) => row.children.length)).toEqual([3, 3, 1])
  })

  it('builds rows from flex, not CSS grid', () => {
    const view = render(<Grid cols={3}>{tiles(4)}</Grid>)
    const root = view.container.firstElementChild as HTMLElement
    expect(root.style.display).toBe('flex')
    expect(root.style.flexDirection).toBe('column')
    rowsOf(view).forEach((row) => {
      expect(row.style.display).toBe('flex')
      expect(row.style.flexDirection).toBe('row')
    })
  })

  it('sizes cells as a percent of the row', () => {
    const rows = rowsOf(render(<Grid cols={4}>{tiles(4)}</Grid>))
    Array.from(rows[0].children).forEach((cell) => expect((cell as HTMLElement).style.width).toBe('25%'))
  })

  it('colSpan takes columns and wraps the row', () => {
    const rows = rowsOf(
      render(
        <Grid cols={4}>
          <GridTile colSpan={2}>a</GridTile>
          <GridTile>b</GridTile>
          <GridTile colSpan={2}>c</GridTile>
          <GridTile>d</GridTile>
        </Grid>,
      ),
    )
    expect(rows.map((row) => row.children.length)).toEqual([2, 2])
    const widths = Array.from(rows[0].children).map((cell) => (cell as HTMLElement).style.width)
    expect(widths).toEqual(['50%', '25%'])
  })

  it('clamps colSpan to cols', () => {
    const rows = rowsOf(
      render(
        <Grid cols={2}>
          <GridTile colSpan={5}>a</GridTile>
        </Grid>,
      ),
    )
    expect((rows[0].children[0] as HTMLElement).style.width).toBe('100%')
  })

  it('renders tile content', () => {
    const rows = rowsOf(render(<Grid cols={2}>{tiles(2)}</Grid>))
    expect(rows[0].textContent).toBe('01')
  })
})
