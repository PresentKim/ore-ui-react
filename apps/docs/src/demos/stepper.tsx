import type { ReactElement } from 'react'
import { useFacetState } from '@react-facet/core'
import type { StepperProps } from '@ore-ui-react/core/src/stepper'
import { Stepper as OreStepper } from '@ore-ui-react/oreui/src/Stepper/Stepper'
import { Stepper as JsonStepper } from '@ore-ui-react/jsonui/src/Stepper/Stepper'
import type { Demo } from '../catalog'

const items = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

const StepperDemo = ({ Stepper }: { Stepper: (props: StepperProps) => ReactElement }) => {
  const [quality, setQuality] = useFacetState<string | undefined>('medium')
  const [looped, setLooped] = useFacetState<string | undefined>('low')

  return (
    <div style={{ width: '20rem', maxWidth: '100%' }}>
      <div style={{ marginBottom: '0.75rem' }}>
        <Stepper items={items} value={quality} onChange={setQuality} />
      </div>
      <div style={{ marginBottom: '0.75rem' }}>
        <Stepper items={items} value={looped} loop onChange={setLooped} />
      </div>
      <Stepper items={items} value="high" disabled />
    </div>
  )
}

const demos: Record<string, Demo> = {
  stepper: {
    oreui: () => <StepperDemo Stepper={OreStepper} />,
    jsonui: () => <StepperDemo Stepper={JsonStepper} />,
    code: `const [quality, setQuality] = useFacetState<string | undefined>('medium')

<Stepper
  items={[
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ]}
  value={quality}
  loop
  onChange={setQuality}
/>`,
  },
}

export default demos
