import { Block, BoxProps, Flex } from './Box'

export type SectionProps = BoxProps & { basis?: number }

export const Layout = ({ className, style, children }: BoxProps) => (
  <Flex direction="column" className={className} style={{ width: '100%', height: '100%', ...style }}>
    {children}
  </Flex>
)

export const Top = ({ basis = 15, className, style, children }: SectionProps) => (
  <Block className={className} style={{ flexGrow: 0, flexShrink: 0, flexBasis: `${basis}%`, ...style }}>
    {children}
  </Block>
)

export const Content = ({ basis, className, style, children }: SectionProps) => (
  <Block
    className={className}
    style={{ flexGrow: 1, flexShrink: 1, flexBasis: basis === undefined ? 'auto' : `${basis}%`, ...style }}
  >
    {children}
  </Block>
)

export const Bottom = ({ basis = 15, className, style, children }: SectionProps) => (
  <Block className={className} style={{ flexGrow: 0, flexShrink: 0, flexBasis: `${basis}%`, ...style }}>
    {children}
  </Block>
)
