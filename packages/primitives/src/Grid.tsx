import { Children, ReactElement, ReactNode, isValidElement } from 'react'
import type { BoxProps } from './Box'
import { Flex } from './Box'

export type GridProps = BoxProps & { cols: number }

export type GridTileProps = BoxProps & { colSpan?: number }

const spanOf = (child: ReactNode, cols: number): number => {
  const span = isValidElement(child) ? (child as ReactElement<GridTileProps>).props.colSpan : undefined
  return Math.min(Math.max(span ?? 1, 1), cols)
}

const percentOf = (span: number, cols: number) => `${Number(((span / cols) * 100).toFixed(4))}%`

const rowsOf = (children: ReactNode, cols: number): ReactNode[][] => {
  const rows: ReactNode[][] = []
  let used = cols
  Children.toArray(children).forEach((child) => {
    const span = spanOf(child, cols)
    if (used + span > cols) {
      rows.push([])
      used = 0
    }
    rows[rows.length - 1].push(child)
    used += span
  })
  return rows
}

export const GridTile = ({ className, style, children }: GridTileProps) => (
  <fast-div className={className ? `ou-grid-tile ${className}` : 'ou-grid-tile'} style={{ ...style }}>
    {children}
  </fast-div>
)

export const Grid = ({ cols, className, style, children }: GridProps) => (
  <Flex direction="column" className={className ? `ou-grid ${className}` : 'ou-grid'} style={style}>
    {rowsOf(children, cols).map((row, rowIndex) => (
      <Flex key={rowIndex} direction="row" className="ou-grid-row">
        {row.map((child, cellIndex) => (
          <fast-div
            key={cellIndex}
            className="ou-grid-cell"
            style={{ width: percentOf(spanOf(child, cols), cols), boxSizing: 'border-box' }}
          >
            {child}
          </fast-div>
        ))}
      </Flex>
    ))}
  </Flex>
)
