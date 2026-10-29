import type { ReactElement } from 'react'
import { useFacetMap, useFacetState } from '@react-facet/core'
import type { RadioGroupProps } from '@ore-ui-react/core/src/radiogroup'
import { RadioGroup as OreRadioGroup } from '@ore-ui-react/oreui/src/RadioGroup/RadioGroup'
import { RadioGroup as JsonRadioGroup } from '@ore-ui-react/jsonui/src/RadioGroup/RadioGroup'
import type { Demo } from '../catalog'

const options = [
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue', disabled: true },
  { value: 'gold', label: 'Gold' },
]

const RadioGroupDemo = ({ RadioGroup }: { RadioGroup: (props: RadioGroupProps) => ReactElement }) => {
  const [value, setValue] = useFacetState<string | undefined>('red')
  const status = useFacetMap((current) => `Selected ${current ?? 'nothing'}`, [], [value])

  return (
    <div style={{ width: '20rem', maxWidth: '100%' }}>
      <RadioGroup options={options} value={value} onChange={setValue} />
      <div style={{ margin: '0.75rem 0' }}>
        <RadioGroup options={options} value="green" disabled />
      </div>
      <fast-text text={status} />
    </div>
  )
}

const demos: Record<string, Demo> = {
  radiogroup: {
    oreui: () => <RadioGroupDemo RadioGroup={OreRadioGroup} />,
    jsonui: () => <RadioGroupDemo RadioGroup={JsonRadioGroup} />,
    code: `const [value, setValue] = useFacetState<string | undefined>('red')

<RadioGroup
  options={[
    { value: 'red', label: 'Red' },
    { value: 'blue', label: 'Blue', disabled: true },
  ]}
  value={value}
  onChange={setValue}
/>
<RadioGroup options={options} value="green" disabled />`,
  },
}

export default demos
