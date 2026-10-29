import type { ReactElement } from 'react'
import { useFacetMap, useFacetState } from '@react-facet/core'
import type { ButtonProps, CheckboxProps, SliderProps, ToggleButtonProps } from '@ore-ui-react/core'
import * as oreui from '@ore-ui-react/oreui'
import * as jsonui from '@ore-ui-react/jsonui'
import type { Demo } from './App'

type Skin = {
  Button: (props: ButtonProps) => ReactElement
  Checkbox: (props: CheckboxProps) => ReactElement
  ToggleButton: (props: ToggleButtonProps) => ReactElement
  Slider: (props: SliderProps) => ReactElement
}

type DemoProps = { skin: Skin }

const Row = ({ children }: { children: ReactElement | ReactElement[] }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem 0.75rem', marginBottom: '0.75rem' }}>
    {children}
  </div>
)

const ButtonDemo = ({ skin: { Button } }: DemoProps) => {
  const [presses, setPresses] = useFacetState(0)
  const label = useFacetMap((count) => `Pressed ${count}`, [], [presses])
  const press = () => setPresses((presses.get() as number) + 1)

  return (
    <div>
      <Row>
        <Button variant="primary" onPress={press}>
          Primary
        </Button>
        <Button onPress={press}>Secondary</Button>
        <Button variant="danger" onPress={press}>
          Danger
        </Button>
        <Button disabled onPress={press}>
          Disabled
        </Button>
      </Row>
      <fast-text text={label} />
    </div>
  )
}

const CheckboxDemo = ({ skin: { Checkbox } }: DemoProps) => {
  const [checked, setChecked] = useFacetState(false)
  const status = useFacetMap((isChecked) => (isChecked ? 'Checked' : 'Unchecked'), [], [checked])

  return (
    <div>
      <Row>
        <Checkbox checked={checked} label="Show hints" onChange={setChecked} />
      </Row>
      <Row>
        <Checkbox checked={true} label="Disabled" disabled />
      </Row>
      <fast-text text={status} />
    </div>
  )
}

const ToggleButtonDemo = ({ skin: { ToggleButton } }: DemoProps) => {
  const [on, setOn] = useFacetState(false)
  const status = useFacetMap((isOn) => (isOn ? 'On' : 'Off'), [], [on])

  return (
    <div>
      <Row>
        <ToggleButton value={on} onChange={setOn} />
        <ToggleButton value={true} disabled />
        <ToggleButton value={false} disabled />
      </Row>
      <fast-text text={status} />
    </div>
  )
}

const SliderDemo = ({ skin: { Slider } }: DemoProps) => {
  const [value, setValue] = useFacetState(40)
  const status = useFacetMap((current) => `Value ${current}`, [], [value])

  return (
    <div style={{ width: '16rem', maxWidth: '100%' }}>
      <Row>
        <Slider value={value} min={0} max={100} step={1} onChange={setValue} />
      </Row>
      <Row>
        <Slider value={60} disabled />
      </Row>
      <fast-text text={status} />
    </div>
  )
}

const demo = (Component: (props: DemoProps) => ReactElement, code: string): Demo => ({
  oreui: () => <Component skin={oreui} />,
  jsonui: () => <Component skin={jsonui} />,
  code,
})

export const DEMOS: Record<string, Demo> = {
  button: demo(
    ButtonDemo,
    `const [presses, setPresses] = useFacetState(0)

<Button variant="primary" onPress={() => setPresses(presses.get() + 1)}>
  Primary
</Button>
<Button disabled>Disabled</Button>`,
  ),
  checkbox: demo(
    CheckboxDemo,
    `const [checked, setChecked] = useFacetState(false)

<Checkbox checked={checked} label="Show hints" onChange={setChecked} />
<Checkbox checked={true} label="Disabled" disabled />`,
  ),
  togglebutton: demo(
    ToggleButtonDemo,
    `const [on, setOn] = useFacetState(false)

<ToggleButton value={on} onChange={setOn} />
<ToggleButton value={true} disabled />`,
  ),
  slider: demo(
    SliderDemo,
    `const [value, setValue] = useFacetState(40)

<Slider value={value} min={0} max={100} step={1} onChange={setValue} />
<Slider value={60} disabled />`,
  ),
}
