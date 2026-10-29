import type { ReactElement } from 'react'
import { useFacetMap, useFacetState } from '@react-facet/core'
import type { RadialMenuProps } from '@ore-ui-react/core/src/radialmenu'
import { RadialMenu as OreRadialMenu } from '@ore-ui-react/oreui/src/RadialMenu/RadialMenu'
import { RadialMenu as JsonRadialMenu } from '@ore-ui-react/jsonui/src/RadialMenu/RadialMenu'
import type { Demo } from '../catalog'

const items = ['Attack', 'Defend', 'Item', 'Run']

const RadialMenuDemo = ({ RadialMenu }: { RadialMenu: (props: RadialMenuProps) => ReactElement }) => {
  const [picked, setPicked] = useFacetState<number>(-1)
  const status = useFacetMap((index) => (index < 0 ? 'none' : items[index]), [], [picked])

  return (
    <div style={{ maxWidth: '100%' }}>
      <div style={{ marginBottom: '0.75rem' }}>
        <RadialMenu items={items} onChange={setPicked} />
      </div>
      <fast-text text={status} />
    </div>
  )
}

const demos: Record<string, Demo> = {
  radialmenu: {
    oreui: () => <RadialMenuDemo RadialMenu={OreRadialMenu} />,
    jsonui: () => <RadialMenuDemo RadialMenu={JsonRadialMenu} />,
    code: `<RadialMenu items={['Attack', 'Defend', 'Item', 'Run']} onChange={(index) => console.log(index)} />`,
  },
}

export default demos
