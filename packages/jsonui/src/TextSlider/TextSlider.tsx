import { useFacetMap, useFacetWrap } from '@react-facet/core'
import { indexOfValue, type TextSliderProps } from '@ore-ui-react/core/src/textslider'
import { Slider } from '../Slider/Slider'
import './textslider.css'

export const TextSlider = ({ values, value, disabled, onChange }: TextSliderProps) => {
  const valueFacet = useFacetWrap<string | undefined>(value)
  const index = useFacetMap((current) => indexOfValue(values, current), [values], [valueFacet])
  const text = useFacetMap((current) => values[current] ?? '', [values], [index])

  return (
    <fast-div className="jui-textslider">
      <fast-div className="jui-textslider-label">
        <fast-text text={text} />
      </fast-div>
      <Slider
        value={index}
        min={0}
        max={Math.max(0, values.length - 1)}
        step={1}
        disabled={disabled}
        onChange={(position) => onChange?.(values[position])}
      />
    </fast-div>
  )
}
