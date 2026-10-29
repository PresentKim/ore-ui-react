import { Scroll as OreScroll } from '@ore-ui-react/oreui/src/Scroll/Scroll'
import { Scroll as JsonScroll } from '@ore-ui-react/jsonui/src/Scroll/Scroll'
import type { Demo } from '../catalog'

const rows = Array.from({ length: 20 }, (_, index) => `Row ${index + 1}`)

const frame = { display: 'flex', flexDirection: 'column', height: '16rem', width: '20rem' } as const

const code = `<Scroll>
  {rows.map((row) => (
    <div>{row}</div>
  ))}
</Scroll>`

const demos: Record<string, Demo> = {
  scroll: {
    oreui: () => (
      <div style={frame}>
        <OreScroll>
          {rows.map((row) => (
            <div key={row}>{row}</div>
          ))}
        </OreScroll>
      </div>
    ),
    jsonui: () => (
      <div style={frame}>
        <JsonScroll>
          {rows.map((row) => (
            <div key={row}>{row}</div>
          ))}
        </JsonScroll>
      </div>
    ),
    code,
  },
}

export default demos
