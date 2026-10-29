import type { ReactElement } from 'react'
import { useFacetState } from '@react-facet/core'
import type { Bindings, KeybindProps, KeybindsProps } from '@ore-ui-react/core/src/keybinds'
import { Keybind as OreKeybind, Keybinds as OreKeybinds } from '@ore-ui-react/oreui/src/Keybinds/Keybinds'
import { Keybind as JsonKeybind, Keybinds as JsonKeybinds } from '@ore-ui-react/jsonui/src/Keybinds/Keybinds'
import type { Demo } from '../catalog'

type Parts = {
  Keybinds: (props: KeybindsProps) => ReactElement
  Keybind: (props: KeybindProps) => ReactElement
}

const KeybindsDemo = ({ Keybinds, Keybind }: Parts) => {
  const [bindings, setBindings] = useFacetState<Bindings>({ jump: 'Space', crouch: 'C', sprint: null })

  return (
    <div style={{ width: '28rem', maxWidth: '100%' }}>
      <Keybinds bindings={bindings} placeholder="Unbound" listeningText="Press a key" onChange={setBindings}>
        <Keybind action="jump" label="Jump" />
        <Keybind action="crouch" label="Crouch" />
        <Keybind action="sprint" label="Sprint" />
      </Keybinds>
    </div>
  )
}

const demos: Record<string, Demo> = {
  keybinds: {
    oreui: () => <KeybindsDemo Keybinds={OreKeybinds} Keybind={OreKeybind} />,
    jsonui: () => <KeybindsDemo Keybinds={JsonKeybinds} Keybind={JsonKeybind} />,
    code: `const [bindings, setBindings] = useFacetState({ jump: 'Space', crouch: 'C', sprint: null })

<Keybinds bindings={bindings} conflict="swap" placeholder="Unbound" onChange={setBindings}>
  <Keybind action="jump" label="Jump" />
  <Keybind action="crouch" label="Crouch" />
  <Keybind action="sprint" label="Sprint" />
</Keybinds>`,
  },
}

export default demos
