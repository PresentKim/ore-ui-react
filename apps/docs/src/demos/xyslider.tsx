import type { ReactElement } from 'react'
import { useFacetMap, useFacetState } from '@react-facet/core'
import type { XYSliderProps, XYValue } from '@ore-ui-react/core/src/xyslider'
import { XYSlider as OreXYSlider } from '@ore-ui-react/oreui/src/XYSlider/XYSlider'
import { XYSlider as JsonXYSlider } from '@ore-ui-react/jsonui/src/XYSlider/XYSlider'
import type { Demo } from '../catalog'

const XYSliderDemo = ({ XYSlider }: { XYSlider: (props: XYSliderProps) => ReactElement }) => {
  const [value, setValue] = useFacetState<XYValue>({ x: 50, y: 50 })
  const status = useFacetMap((current) => `x ${current.x}, y ${current.y}`, [], [value])

  return (
    <div style={{ width: '20rem', maxWidth: '100%' }}>
      <div style={{ marginBottom: '0.75rem' }}>
        <XYSlider value={value} onChange={setValue} />
      </div>
      <fast-text text={status} />
    </div>
  )
}

const demos: Record<string, Demo> = {
  xyslider: {
    oreui: () => <XYSliderDemo XYSlider={OreXYSlider} />,
    jsonui: () => <XYSliderDemo XYSlider={JsonXYSlider} />,
    code: `const [value, setValue] = useFacetState({ x: 50, y: 50 })

<XYSlider value={value} minX={0} maxX={100} minY={0} maxY={100} onChange={setValue} />`,
  },
}

export default demos
