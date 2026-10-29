import { useFacetCallback, useFacetMap, useFacetWrap } from '@react-facet/core'
import type { ToggleButtonProps } from '@ore-ui-react/core'
import './toggle-button.css'

export function ToggleButton({ value, disabled = false, onChange }: ToggleButtonProps) {
  const on = useFacetWrap(value)
  const isDisabled = useFacetWrap(disabled)
  const rootClass = useFacetMap(
    (isOn, off) => 'jui-toggle-button ' + (isOn ? 'on' : 'off') + (off ? ' disabled' : ''),
    [],
    [on, isDisabled],
  )
  const press = useFacetCallback(
    (isOn, off) => (event: MouseEvent) => {
      if (off || event.button !== 0) return
      onChange?.(!isOn)
    },
    [onChange],
    [on, isDisabled],
  )

  return (
    <fast-div className={rootClass} onMouseDown={press}>
      <fast-div className="jui-toggle-button-track">
        <fast-div className="jui-toggle-button-marker" />
      </fast-div>
      <fast-div className="jui-toggle-button-knob">
        <fast-div className="jui-toggle-button-knob-face" />
        <fast-div className="jui-toggle-button-knob-shade" />
      </fast-div>
    </fast-div>
  )
}
