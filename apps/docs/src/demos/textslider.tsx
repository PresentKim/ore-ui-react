import type { ReactElement } from 'react'
import { useFacetMap, useFacetState } from '@react-facet/core'
import type { TextSliderProps } from '@ore-ui-react/core/src/textslider'
import { TextSlider as OreTextSlider } from '@ore-ui-react/oreui/src/TextSlider/TextSlider'
import { TextSlider as JsonTextSlider } from '@ore-ui-react/jsonui/src/TextSlider/TextSlider'
import type { Demo } from '../catalog'

const values = ['Easy', 'Medium', 'Hard']

const TextSliderDemo = ({ TextSlider }: { TextSlider: (props: TextSliderProps) => ReactElement }) => {
  const [value, setValue] = useFacetState<string | undefined>('Medium')
  const status = useFacetMap((current) => `Difficulty ${current ?? 'none'}`, [], [value])

  return (
    <div style={{ width: '24rem', maxWidth: '100%' }}>
      <div style={{ marginBottom: '0.75rem' }}>
        <TextSlider values={values} value={value} onChange={setValue} />
      </div>
      <div style={{ marginBottom: '0.75rem' }}>
        <TextSlider values={values} value="Hard" disabled />
      </div>
      <fast-text text={status} />
    </div>
  )
}

const demos: Record<string, Demo> = {
  textslider: {
    oreui: () => <TextSliderDemo TextSlider={OreTextSlider} />,
    jsonui: () => <TextSliderDemo TextSlider={JsonTextSlider} />,
    code: `const [value, setValue] = useFacetState<string | undefined>('Medium')

<TextSlider values={['Easy', 'Medium', 'Hard']} value={value} onChange={setValue} />
<TextSlider values={values} value="Hard" disabled />`,
  },
}

export default demos
