import type { ReactElement } from 'react'
import { useFacetMap, useFacetState } from '@react-facet/core'
import type { DropdownProps } from '@ore-ui-react/core/src/dropdown'
import { Dropdown as OreDropdown } from '@ore-ui-react/oreui/src/Dropdown/Dropdown'
import { Dropdown as JsonDropdown } from '@ore-ui-react/jsonui/src/Dropdown/Dropdown'
import type { Demo } from '../catalog'

const options = [
  { value: 'survival', label: 'Survival' },
  { value: 'creative', label: 'Creative' },
  { value: 'adventure', label: 'Adventure', disabled: true },
  { value: 'spectator', label: 'Spectator' },
]

const DropdownDemo = ({ Dropdown }: { Dropdown: (props: DropdownProps) => ReactElement }) => {
  const [value, setValue] = useFacetState<string | undefined>(undefined)
  const status = useFacetMap((current) => `Selected ${current ?? 'nothing'}`, [], [value])

  return (
    <div style={{ width: '20rem', maxWidth: '100%', minHeight: '22rem' }}>
      <div style={{ marginBottom: '0.75rem' }}>
        <Dropdown options={options} value={value} placeholder="Game mode" onChange={setValue} />
      </div>
      <div style={{ marginBottom: '0.75rem' }}>
        <Dropdown options={options} value="creative" disabled />
      </div>
      <fast-text text={status} />
    </div>
  )
}

const demos: Record<string, Demo> = {
  dropdown: {
    oreui: () => <DropdownDemo Dropdown={OreDropdown} />,
    jsonui: () => <DropdownDemo Dropdown={JsonDropdown} />,
    code: `const [value, setValue] = useFacetState<string | undefined>(undefined)

<Dropdown
  options={[
    { value: 'survival', label: 'Survival' },
    { value: 'adventure', label: 'Adventure', disabled: true },
  ]}
  value={value}
  placeholder="Game mode"
  onChange={setValue}
/>
<Dropdown options={options} value="creative" disabled />`,
  },
}

export default demos
