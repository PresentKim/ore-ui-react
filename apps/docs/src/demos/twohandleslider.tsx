import type { ReactElement } from 'react'
import { useFacetMap, useFacetState } from '@react-facet/core'
import type { TwoHandleSliderProps } from '@ore-ui-react/core/src/twohandleslider'
import { TwoHandleSlider as OreTwoHandleSlider } from '@ore-ui-react/oreui/src/TwoHandleSlider/TwoHandleSlider'
import { TwoHandleSlider as JsonTwoHandleSlider } from '@ore-ui-react/jsonui/src/TwoHandleSlider/TwoHandleSlider'
import type { Demo } from '../catalog'

const TwoHandleSliderDemo = ({ TwoHandleSlider }: { TwoHandleSlider: (props: TwoHandleSliderProps) => ReactElement }) => {
  const [range, setRange] = useFacetState<[number, number]>([20, 70])
  const status = useFacetMap(([low, high]) => `Range ${low} to ${high}`, [], [range])

  return (
    <div style={{ width: '24rem', maxWidth: '100%', padding: '0.5rem 0' }}>
      <div style={{ marginBottom: '1rem' }}>
        <TwoHandleSlider value={range} min={0} max={100} step={5} onChange={setRange} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <TwoHandleSlider value={[30, 60]} disabled />
      </div>
      <fast-text text={status} />
    </div>
  )
}

const demos: Record<string, Demo> = {
  twohandleslider: {
    oreui: () => <TwoHandleSliderDemo TwoHandleSlider={OreTwoHandleSlider} />,
    jsonui: () => <TwoHandleSliderDemo TwoHandleSlider={JsonTwoHandleSlider} />,
    code: `const [range, setRange] = useFacetState<[number, number]>([20, 70])

<TwoHandleSlider value={range} min={0} max={100} step={5} onChange={setRange} />
<TwoHandleSlider value={[30, 60]} disabled />`,
  },
}

export default demos
