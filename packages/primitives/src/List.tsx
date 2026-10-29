import { Children, ReactNode } from 'react'
import type { BoxProps } from './Box'
import { Flex } from './Box'

export type ListBullet = 'disc' | 'circle' | 'square' | 'number' | 'none'

export type ListProps = BoxProps & { ordered?: boolean; bullet?: ListBullet }

const SYMBOLS: Record<Exclude<ListBullet, 'number'>, string> = {
  disc: '•',
  circle: '◦',
  square: '▪',
  none: '',
}

const markerOf = (bullet: ListBullet, index: number) =>
  bullet === 'number' ? `${index + 1}.` : SYMBOLS[bullet]

export const ListItem = ({ className, style, children }: BoxProps) => (
  <fast-div className={className ? `ou-list-item ${className}` : 'ou-list-item'} style={{ ...style }}>
    {children}
  </fast-div>
)

export const List = ({ ordered, bullet, className, style, children }: ListProps): JSX.Element => {
  const kind = bullet ?? (ordered ? 'number' : 'disc')

  return (
    <Flex direction="column" className={className ? `ou-list ${className}` : 'ou-list'} style={style}>
      {Children.toArray(children).map((child: ReactNode, index) => (
        <Flex key={index} direction="row" className="ou-list-row">
          <fast-div className="ou-list-marker" style={{ flexShrink: 0, marginRight: '0.5rem' }}>
            {markerOf(kind, index)}
          </fast-div>
          <fast-div className="ou-list-body" style={{ flexGrow: 1 }}>
            {child}
          </fast-div>
        </Flex>
      ))}
    </Flex>
  )
}
