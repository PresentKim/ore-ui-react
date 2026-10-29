import type { ReactElement } from 'react'
import { useFacetMap, useFacetState } from '@react-facet/core'
import type { RoundedButtonProps } from '@ore-ui-react/core/src/roundedbutton'
import { RoundedButton as OreRoundedButton } from '@ore-ui-react/oreui/src/RoundedButton/RoundedButton'
import { RoundedButton as JsonRoundedButton } from '@ore-ui-react/jsonui/src/RoundedButton/RoundedButton'
import type { Demo } from '../catalog'

const RoundedButtonDemo = ({ RoundedButton }: { RoundedButton: (props: RoundedButtonProps) => ReactElement }) => {
  const [count, setCount] = useFacetState(0)
  const status = useFacetMap((current) => `Pressed ${current} times`, [], [count])
  const press = () => setCount((current) => (typeof current === 'number' ? current + 1 : 1))

  return (
    <div style={{ width: '24rem', maxWidth: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
        <RoundedButton size="small" onPress={press}>
          Small
        </RoundedButton>
        <RoundedButton size="medium" onPress={press}>
          Medium
        </RoundedButton>
        <RoundedButton size="large" onPress={press}>
          Large
        </RoundedButton>
      </div>
      <div style={{ marginBottom: '0.75rem' }}>
        <RoundedButton disabled>Disabled</RoundedButton>
      </div>
      <fast-text text={status} />
    </div>
  )
}

const demos: Record<string, Demo> = {
  roundedbutton: {
    oreui: () => <RoundedButtonDemo RoundedButton={OreRoundedButton} />,
    jsonui: () => <RoundedButtonDemo RoundedButton={JsonRoundedButton} />,
    code: `import { RoundedButton } from '@ore-ui-react/oreui'

<RoundedButton size="small" onPress={press}>Small</RoundedButton>
<RoundedButton size="large" onPress={press}>Large</RoundedButton>
<RoundedButton disabled>Disabled</RoundedButton>`,
  },
}

export default demos
