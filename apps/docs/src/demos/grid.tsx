import type { ReactElement } from 'react'
import { Grid, GridTile } from '@ore-ui-react/primitives/src/Grid'
import { List, ListItem } from '@ore-ui-react/primitives/src/List'
import type { Demo } from '../catalog'

const tile = { background: '#3a3a3a', color: '#fff', padding: '0.4rem', margin: '0.1rem', boxSizing: 'border-box' } as const

const both = (render: () => ReactElement, code: string): Demo => ({
  oreui: render,
  jsonui: render,
  code,
})

const demos: Record<string, Demo> = {
  grid: both(
    () => (
      <Grid cols={3} style={{ width: '24rem' }}>
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <GridTile key={n} style={tile}>
            {n}
          </GridTile>
        ))}
      </Grid>
    ),
    `import { Grid, GridTile } from '@ore-ui-react/primitives'

<Grid cols={3}>
  <GridTile>1</GridTile>
  <GridTile>2</GridTile>
  <GridTile>3</GridTile>
  <GridTile>4</GridTile>
</Grid>`,
  ),
  gridtile: both(
    () => (
      <Grid cols={4} style={{ width: '24rem' }}>
        <GridTile colSpan={2} style={tile}>
          span 2
        </GridTile>
        <GridTile style={tile}>1</GridTile>
        <GridTile style={tile}>2</GridTile>
        <GridTile colSpan={4} style={tile}>
          span 4
        </GridTile>
      </Grid>
    ),
    `import { Grid, GridTile } from '@ore-ui-react/primitives'

<Grid cols={4}>
  <GridTile colSpan={2}>span 2</GridTile>
  <GridTile>1</GridTile>
  <GridTile>2</GridTile>
  <GridTile colSpan={4}>span 4</GridTile>
</Grid>`,
  ),
  list: both(
    () => (
      <div style={{ width: '16rem' }}>
        <List>
          <ListItem>Start the game</ListItem>
          <ListItem>
            Adjust settings
            <List bullet="square">
              <ListItem>Graphics</ListItem>
              <ListItem>Sound</ListItem>
            </List>
          </ListItem>
        </List>
        <List ordered>
          <ListItem>First</ListItem>
          <ListItem>Second</ListItem>
        </List>
      </div>
    ),
    `import { List, ListItem } from '@ore-ui-react/primitives'

<List>
  <ListItem>Start the game</ListItem>
  <ListItem>
    Adjust settings
    <List bullet="square">
      <ListItem>Graphics</ListItem>
    </List>
  </ListItem>
</List>
<List ordered>
  <ListItem>First</ListItem>
</List>`,
  ),
}

export default demos
