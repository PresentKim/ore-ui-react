import { Mount, useFacetState } from '@react-facet/core'
import { Button as OreButton } from '@ore-ui-react/oreui/src/Button/Button'
import { Button as JsonButton } from '@ore-ui-react/jsonui/src/Button/Button'
import { Tutorial as OreTutorial } from '@ore-ui-react/oreui/src/Tutorial/Tutorial'
import { Tutorial as JsonTutorial } from '@ore-ui-react/jsonui/src/Tutorial/Tutorial'
import type { Demo } from '../catalog'

const code = `const steps = [
  { target: '[data-tutorial="play"]', title: 'Play', content: 'Starts the game.' },
  { target: '[data-tutorial="settings"]', title: 'Settings', content: 'Changes options.' },
  { target: '[data-tutorial="missing"]', title: 'Done', content: 'No target, shown centered.' },
]
<Tutorial steps={steps} step={step} onChange={setStep} onFinish={() => setOpen(false)} />`

const steps = [
  { target: '[data-tutorial="play"]', title: 'Play', content: 'Starts the game.' },
  { target: '[data-tutorial="settings"]', title: 'Settings', content: 'Changes options.' },
  { target: '[data-tutorial="missing"]', title: 'Done', content: 'No target, shown centered.' },
]

const row = { display: 'flex', gap: '3rem', padding: '1rem 0' } as const

const OreDemo = () => {
  const [step, setStep] = useFacetState(0)
  const [open, setOpen] = useFacetState(true)
  return (
    <div style={row}>
      <span data-tutorial="play">
        <OreButton onPress={() => setOpen(true)}>Play</OreButton>
      </span>
      <span data-tutorial="settings">
        <OreButton>Settings</OreButton>
      </span>
      <Mount when={open}>
        <OreTutorial steps={steps} step={step} onChange={setStep} onFinish={() => setOpen(false)} />
      </Mount>
    </div>
  )
}

const JsonDemo = () => {
  const [step, setStep] = useFacetState(0)
  const [open, setOpen] = useFacetState(true)
  return (
    <div style={row}>
      <span data-tutorial="play">
        <JsonButton onPress={() => setOpen(true)}>Play</JsonButton>
      </span>
      <span data-tutorial="settings">
        <JsonButton>Settings</JsonButton>
      </span>
      <Mount when={open}>
        <JsonTutorial steps={steps} step={step} onChange={setStep} onFinish={() => setOpen(false)} />
      </Mount>
    </div>
  )
}

const demos: Record<string, Demo> = {
  tutorial: { oreui: () => <OreDemo />, jsonui: () => <JsonDemo />, code },
}

export default demos
