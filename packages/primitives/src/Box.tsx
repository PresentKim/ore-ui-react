import type { CSSProperties, ReactNode } from 'react'
import './primitives.css'

export type BoxProps = {
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

export type FlexProps = BoxProps & {
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  align?: string
  justify?: string
}

const classOf = (base: string, className?: string) => (className ? `${base} ${className}` : base)

export const Block = ({ className, style, children }: BoxProps) => (
  <fast-div className={classOf('ou-block', className)} style={{ display: 'block', ...style }}>
    {children}
  </fast-div>
)

export const Flex = ({ direction = 'row', wrap, align, justify, className, style, children }: FlexProps) => {
  const flex: CSSProperties = { display: 'flex', flexDirection: direction }
  if (wrap) flex.flexWrap = wrap
  if (align) flex.alignItems = align
  if (justify) flex.justifyContent = justify

  return (
    <fast-div className={classOf('ou-flex', className)} style={{ ...flex, ...style }}>
      {children}
    </fast-div>
  )
}

export const Row = (props: BoxProps) => <Flex {...props} direction="row" />

export const Column = (props: BoxProps) => <Flex {...props} direction="column" />
