import type { ReactElement } from 'react'
import { useFacetMap, useFacetState } from '@react-facet/core'
import type { ColorPickerProps } from '@ore-ui-react/core/src/colorpicker'
import { ColorPicker as OreColorPicker } from '@ore-ui-react/oreui/src/ColorPicker/ColorPicker'
import { ColorPicker as JsonColorPicker } from '@ore-ui-react/jsonui/src/ColorPicker/ColorPicker'
import type { Demo } from '../catalog'

const ColorPickerDemo = ({ ColorPicker }: { ColorPicker: (props: ColorPickerProps) => ReactElement }) => {
  const [value, setValue] = useFacetState('#3a7bd5')
  const status = useFacetMap((current) => `Color ${current}`, [], [value])

  return (
    <div style={{ width: '24rem', maxWidth: '100%' }}>
      <div style={{ marginBottom: '0.75rem' }}>
        <ColorPicker value={value} onChange={setValue} />
      </div>
      <fast-text text={status} />
    </div>
  )
}

const demos: Record<string, Demo> = {
  colorpicker: {
    oreui: () => <ColorPickerDemo ColorPicker={OreColorPicker} />,
    jsonui: () => <ColorPickerDemo ColorPicker={JsonColorPicker} />,
    code: `const [value, setValue] = useFacetState('#3a7bd5')

<ColorPicker value={value} onChange={setValue} />`,
  },
}

export default demos
