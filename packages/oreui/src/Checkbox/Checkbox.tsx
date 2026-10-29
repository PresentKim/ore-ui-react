import { useFacetCallback, useFacetMap, useFacetWrap } from '@react-facet/core'
import { isPrimaryPress } from '@ore-ui-react/core'
import type { CheckboxProps } from '@ore-ui-react/core'
import './checkbox.css'

export const Checkbox = ({ checked, label, disabled, onChange }: CheckboxProps) => {
  const checkedFacet = useFacetWrap(checked)
  const disabledFacet = useFacetWrap(disabled ?? false)

  const rootClass = useFacetMap(
    (isDisabled) => (isDisabled ? 'oui-checkbox disabled' : 'oui-checkbox'),
    [],
    [disabledFacet],
  )
  const boxClass = useFacetMap(
    (isChecked) => (isChecked ? 'oui-checkbox-box on' : 'oui-checkbox-box off'),
    [],
    [checkedFacet],
  )
  const markDisplay = useFacetMap((isChecked) => (isChecked ? 'block' : 'none'), [], [checkedFacet])

  const press = useFacetCallback(
    (isChecked: boolean, isDisabled: boolean) => (event: MouseEvent) => {
      if (isDisabled || !isPrimaryPress(event)) return
      onChange?.(!isChecked)
    },
    [onChange],
    [checkedFacet, disabledFacet],
  )

  return (
    <fast-div className={rootClass} onMouseDown={press}>
      <fast-div className={boxClass}>
        <fast-div className="oui-checkbox-mark" style={{ display: markDisplay }} />
      </fast-div>
      {label !== undefined && <fast-div className="oui-checkbox-label">{label}</fast-div>}
    </fast-div>
  )
}
