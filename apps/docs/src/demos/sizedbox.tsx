import { SizedBox } from '@ore-ui-react/primitives/src/SizedBox'
import { Row } from '@ore-ui-react/primitives/src/Box'
import type { Demo } from '../catalog'

const tile = { background: '#3a3a3a', color: '#fff', padding: '0.4rem', boxSizing: 'border-box' } as const

const SizedBoxDemo = () => (
  <div>
    <SizedBox width={100} height={30} style={tile}>
      100 x 30 GUI px
    </SizedBox>
    <div style={{ height: '0.5rem' }} />
    <SizedBox width={300} height={30} maxWidth="20rem" style={tile}>
      300 GUI px wide, capped at 20rem
    </SizedBox>
    <div style={{ height: '0.5rem' }} />
    <Row style={{ width: '24rem' }}>
      <SizedBox fixed width={80} height={30} style={tile}>
        fixed
      </SizedBox>
      <SizedBox width={200} height={30} style={{ ...tile, background: '#555' }}>
        shrinks
      </SizedBox>
    </Row>
  </div>
)

const demos: Record<string, Demo> = {
  sizedbox: {
    oreui: () => <SizedBoxDemo />,
    jsonui: () => <SizedBoxDemo />,
    code: `import { SizedBox } from '@ore-ui-react/primitives'

<SizedBox width={326} height={166}>window</SizedBox>
<SizedBox width={300} maxWidth="20rem">capped</SizedBox>
<SizedBox className="screen-box">vw/vh sizes go in a CSS class</SizedBox>
<SizedBox fixed width={80}>no shrink</SizedBox>`,
  },
}

export default demos
