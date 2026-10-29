import { useFacetCallback, useFacetMap, useFacetWrap } from '@react-facet/core'
import { CheckboxProps } from '@ore-ui-react/core'
import './checkbox.css'

export const Checkbox = ({ checked, label, disabled, onChange }: CheckboxProps) => {
  const checkedFacet = useFacetWrap(checked)
  const disabledFacet = useFacetWrap(disabled ?? false)

  const onMouseDown = useFacetCallback(
    (isChecked: boolean, isDisabled: boolean) => (event: MouseEvent) => {
      if (isDisabled || event.button !== 0) return
      onChange?.(!isChecked)
    },
    [onChange],
    [checkedFacet, disabledFacet],
  )

  const rootClass = useFacetMap(
    (isDisabled) => (isDisabled ? 'jui-checkbox disabled' : 'jui-checkbox'),
    [],
    [disabledFacet],
  )
  const boxClass = useFacetMap(
    (isChecked) => (isChecked ? 'jui-checkbox-box on' : 'jui-checkbox-box off'),
    [],
    [checkedFacet],
  )

  return (
    <fast-div className={rootClass} onMouseDown={onMouseDown}>
      <fast-div className={boxClass}>
        <fast-div className="jui-checkbox-mark" />
      </fast-div>
      {label !== undefined && <span className="jui-checkbox-label">{label}</span>}
    </fast-div>
  )
}
