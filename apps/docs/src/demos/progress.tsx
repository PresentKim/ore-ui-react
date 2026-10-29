import { useFacetCallback, useFacetState } from '@react-facet/core'
import type { ProgressProps } from '@ore-ui-react/core/src/progress'
import { Button as OreButton } from '@ore-ui-react/oreui/src/Button/Button'
import { ProgressBar as OreBar, ProgressCircle as OreCircle } from '@ore-ui-react/oreui/src/Progress/Progress'
import { Button as JsonButton } from '@ore-ui-react/jsonui/src/Button/Button'
import { ProgressBar as JsonBar, ProgressCircle as JsonCircle } from '@ore-ui-react/jsonui/src/Progress/Progress'
import type { Demo } from '../catalog'

type Skin = {
  Button: typeof OreButton
  ProgressBar: (props: ProgressProps) => JSX.Element
  ProgressCircle: (props: ProgressProps) => JSX.Element
}

const ProgressDemo = ({ skin: { Button, ProgressBar, ProgressCircle } }: { skin: Skin }) => {
  const [value, setValue] = useFacetState(30)
  const step = useFacetCallback((current: number) => () => setValue((current + 20) % 120), [setValue], [value])

  return (
    <div style={{ width: '20rem', maxWidth: '100%' }}>
      <div style={{ marginBottom: '0.75rem' }}>
        <ProgressBar value={value} />
      </div>
      <div style={{ marginBottom: '0.75rem' }}>
        <ProgressCircle value={value} />
      </div>
      <Button onPress={step}>Advance</Button>
    </div>
  )
}

const demos: Record<string, Demo> = {
  progress: {
    oreui: () => <ProgressDemo skin={{ Button: OreButton, ProgressBar: OreBar, ProgressCircle: OreCircle }} />,
    jsonui: () => <ProgressDemo skin={{ Button: JsonButton, ProgressBar: JsonBar, ProgressCircle: JsonCircle }} />,
    code: `const [value, setValue] = useFacetState(30)
const advance = useFacetCallback((current: number) => () => setValue((current + 20) % 120), [setValue], [value])

<ProgressBar value={value} />
<ProgressCircle value={value} />
<Button onPress={advance}>Advance</Button>`,
  },
}

export default demos
