import type { ReactElement } from 'react'
import { useFacetMap, useFacetState } from '@react-facet/core'
import type { SegmentProps } from '@ore-ui-react/core/src/segment'
import { Segment as OreSegment } from '@ore-ui-react/oreui/src/Segment/Segment'
import { Segment as JsonSegment } from '@ore-ui-react/jsonui/src/Segment/Segment'
import type { Demo } from '../catalog'

const options = [
  { value: 'day', label: 'Day' },
  { value: 'night', label: 'Night' },
  { value: 'storm', label: 'Storm', disabled: true },
  { value: 'dawn', label: 'Dawn' },
]

const SegmentDemo = ({ Segment }: { Segment: (props: SegmentProps) => ReactElement }) => {
  const [value, setValue] = useFacetState<string | undefined>('day')
  const status = useFacetMap((current) => `Selected ${current ?? 'nothing'}`, [], [value])

  return (
    <div style={{ width: '32rem', maxWidth: '100%' }}>
      <div style={{ marginBottom: '0.75rem' }}>
        <Segment options={options} value={value} onChange={setValue} />
      </div>
      <div style={{ marginBottom: '0.75rem' }}>
        <Segment options={options} value="night" disabled />
      </div>
      <fast-text text={status} />
    </div>
  )
}

const demos: Record<string, Demo> = {
  segment: {
    oreui: () => <SegmentDemo Segment={OreSegment} />,
    jsonui: () => <SegmentDemo Segment={JsonSegment} />,
    code: `const [value, setValue] = useFacetState<string | undefined>('day')

<Segment
  options={[
    { value: 'day', label: 'Day' },
    { value: 'storm', label: 'Storm', disabled: true },
  ]}
  value={value}
  onChange={setValue}
/>
<Segment options={options} value="night" disabled />`,
  },
}

export default demos
