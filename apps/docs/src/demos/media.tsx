import { useState } from 'react'
import { Image, MaskImage } from '@ore-ui-react/primitives/src/Image'
import { Match, State } from '@ore-ui-react/primitives/src/State'
import type { Demo } from '../catalog'

const svgUri = (body: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${body}</svg>`)}`

const gem = svgUri('<polygon points="32,4 60,24 48,60 16,60 4,24" fill="#4aa3df" stroke="#1b4f72" stroke-width="3"/>')
const disc = svgUri('<circle cx="32" cy="32" r="28" fill="#000"/>')

const box = { width: '8rem', height: '8rem', background: '#3a3a3a' } as const
const stateButton = { background: '#555', color: '#fff', padding: '0.3rem', margin: '0.2rem' } as const

const StateDemo = () => {
  const [value, setValue] = useState('one')

  return (
    <div>
      {['one', 'two', 'other'].map((name) => (
        <span key={name} style={stateButton} onMouseDown={() => setValue(name)}>
          {name}
        </span>
      ))}
      <State value={value}>
        <Match name="">
          <div style={{ color: '#fff' }}>Fallback</div>
        </Match>
        <Match name="one">
          <div style={{ color: '#fff' }}>State one</div>
        </Match>
        <Match name="two">
          <div style={{ color: '#fff' }}>State two</div>
        </Match>
      </State>
    </div>
  )
}

const ImageDemo = () => (
  <div style={{ display: 'flex' }}>
    <Image src={gem} />
    <div style={box}>
      <Image src={gem} fill />
    </div>
    <Image src={gem} options={{ size: 'cover', position: 'center' }} style={box} />
  </div>
)

const MaskImageDemo = () => (
  <MaskImage src={disc} options={{ size: 'contain' }} style={{ width: '8rem', height: '8rem' }}>
    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(#e67e22, #8e44ad)' }} />
  </MaskImage>
)

const both = (Component: () => JSX.Element, code: string): Demo => ({
  oreui: () => <Component />,
  jsonui: () => <Component />,
  code,
})

const demos: Record<string, Demo> = {
  state: both(
    StateDemo,
    `import { Match, State } from '@ore-ui-react/primitives'

<State value={value}>
  <Match name="">Fallback</Match>
  <Match name="one">State one</Match>
  <Match name="two">State two</Match>
</State>`,
  ),
  image: both(
    ImageDemo,
    `import { Image } from '@ore-ui-react/primitives'

<Image src={url} />
<Image src={url} fill />
<Image src={url} options={{ size: 'cover', position: 'center' }} />`,
  ),
  maskimage: both(
    MaskImageDemo,
    `import { MaskImage } from '@ore-ui-react/primitives'

<MaskImage src={maskUrl} options={{ size: 'contain' }}>...</MaskImage>`,
  ),
}

export default demos
