import { Block, Column, Flex, Row } from '@ore-ui-react/primitives/src/Box'
import type { Demo } from '../catalog'

const cell = { background: '#3a3a3a', color: '#fff', padding: '0.4rem', margin: '0.2rem' } as const

const Cells = () => (
  <>
    <div style={cell}>A</div>
    <div style={cell}>B</div>
    <div style={cell}>C</div>
  </>
)

const BlockDemo = () => (
  <Block>
    <Cells />
  </Block>
)

const FlexDemo = () => (
  <Flex direction="row" wrap="wrap" align="center" justify="space-between" style={{ width: '14rem' }}>
    <Cells />
  </Flex>
)

const RowDemo = () => (
  <Row>
    <Cells />
  </Row>
)

const ColumnDemo = () => (
  <Column>
    <Cells />
  </Column>
)

const both = (Component: () => JSX.Element, code: string): Demo => ({
  oreui: () => <Component />,
  jsonui: () => <Component />,
  code,
})

const demos: Record<string, Demo> = {
  block: both(
    BlockDemo,
    `import { Block } from '@ore-ui-react/primitives'

<Block>...</Block>`,
  ),
  flex: both(
    FlexDemo,
    `import { Flex } from '@ore-ui-react/primitives'

<Flex direction="row" wrap="wrap" align="center" justify="space-between">...</Flex>`,
  ),
  row: both(
    RowDemo,
    `import { Row } from '@ore-ui-react/primitives'

<Row>...</Row>`,
  ),
  column: both(
    ColumnDemo,
    `import { Column } from '@ore-ui-react/primitives'

<Column>...</Column>`,
  ),
}

export default demos
