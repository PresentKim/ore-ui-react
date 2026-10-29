import { useFacetState } from '@react-facet/core'
import { Button as OreButton } from '@ore-ui-react/oreui/src/Button/Button'
import { Button as JsonButton } from '@ore-ui-react/jsonui/src/Button/Button'
import { Tooltip as OreTooltip } from '@ore-ui-react/oreui/src/Tooltip/Tooltip'
import { Tooltip as JsonTooltip } from '@ore-ui-react/jsonui/src/Tooltip/Tooltip'
import type { Demo } from '../catalog'

const code = `<Tooltip content="Opens the settings">
  <Button>Settings</Button>
</Tooltip>
<Tooltip content="Pinned open" side="bottom" open={open}>
  <Button onPress={() => setOpen(!open.get())}>Toggle</Button>
</Tooltip>`

const row = { display: 'flex', flexWrap: 'wrap', gap: '3rem', padding: '1rem 0' } as const

const OreDemo = () => {
  const [open, setOpen] = useFacetState(false)
  return (
    <div style={row}>
      <OreTooltip content="Opens the settings">
        <OreButton>Settings</OreButton>
      </OreTooltip>
      <OreTooltip content="Pinned open" side="bottom" open={open}>
        <OreButton onPress={() => setOpen(!(open.get() as boolean))}>Toggle</OreButton>
      </OreTooltip>
    </div>
  )
}

const JsonDemo = () => {
  const [open, setOpen] = useFacetState(false)
  return (
    <div style={row}>
      <JsonTooltip content="Opens the settings">
        <JsonButton>Settings</JsonButton>
      </JsonTooltip>
      <JsonTooltip content="Pinned open" side="bottom" open={open}>
        <JsonButton onPress={() => setOpen(!(open.get() as boolean))}>Toggle</JsonButton>
      </JsonTooltip>
    </div>
  )
}

const demos: Record<string, Demo> = {
  tooltip: { oreui: () => <OreDemo />, jsonui: () => <JsonDemo />, code },
}

export default demos
