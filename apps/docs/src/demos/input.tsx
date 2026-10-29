import type { ReactElement } from 'react'
import { useFacetMap, useFacetState } from '@react-facet/core'
import type { NumberInputProps, PasswordInputProps, TextInputProps } from '@ore-ui-react/core/src/input'
import * as oreui from '@ore-ui-react/oreui/src/Input/Input'
import * as jsonui from '@ore-ui-react/jsonui/src/Input/Input'
import type { Demo } from '../catalog'

type Skin = {
  TextInput: (props: TextInputProps) => ReactElement
  NumberInput: (props: NumberInputProps) => ReactElement
  PasswordInput: (props: PasswordInputProps) => ReactElement
}

const Field = ({ children }: { children: ReactElement }) => (
  <div style={{ width: '20rem', maxWidth: '100%', marginBottom: '0.75rem' }}>{children}</div>
)

const InputDemo = ({ skin: { TextInput, NumberInput, PasswordInput } }: { skin: Skin }) => {
  const [text, setText] = useFacetState('')
  const [count, setCount] = useFacetState(10)
  const [secret, setSecret] = useFacetState('hunter2')
  const status = useFacetMap(
    (typed, number) => `Text "${typed}", number ${number}`,
    [],
    [text, count],
  )

  return (
    <div>
      <Field>
        <TextInput value={text} placeholder="Name" maxLength={16} onChange={setText} />
      </Field>
      <Field>
        <NumberInput value={count} min={0} max={100} step={5} onChange={setCount} />
      </Field>
      <Field>
        <PasswordInput value={secret} onChange={setSecret} />
      </Field>
      <Field>
        <TextInput value="Read only" readOnly />
      </Field>
      <Field>
        <TextInput value="Disabled" disabled />
      </Field>
      <fast-text text={status} />
    </div>
  )
}

const demo = (code: string): Demo => ({
  oreui: () => <InputDemo skin={oreui} />,
  jsonui: () => <InputDemo skin={jsonui} />,
  code,
})

const demos: Record<string, Demo> = {
  input: demo(`const [text, setText] = useFacetState('')
const [count, setCount] = useFacetState(10)

<TextInput value={text} placeholder="Name" maxLength={16} onChange={setText} />
<NumberInput value={count} min={0} max={100} step={5} onChange={setCount} />
<PasswordInput value="hunter2" />
<TextInput value="Disabled" disabled />`),
}

export default demos
