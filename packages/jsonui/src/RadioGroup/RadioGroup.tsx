import { useFacetCallback, useFacetMap, useFacetWrap } from '@react-facet/core'
import { isPrimaryPress } from '@ore-ui-react/core/src/pointer'
import type { RadioGroupProps, RadioOption, RadioProps } from '@ore-ui-react/core/src/radiogroup'
import './radiogroup.css'

export const Radio = ({ value, label, selected, disabled, onPress }: RadioProps) => {
  const selectedFacet = useFacetWrap(selected)
  const disabledFacet = useFacetWrap(disabled ?? false)

  const rootClass = useFacetMap(
    (isDisabled) => (isDisabled ? 'jui-radio disabled' : 'jui-radio'),
    [],
    [disabledFacet],
  )
  const boxClass = useFacetMap(
    (isSelected) => (isSelected ? 'jui-radio-box on' : 'jui-radio-box off'),
    [],
    [selectedFacet],
  )

  const press = useFacetCallback(
    (isDisabled: boolean) => (event: MouseEvent) => {
      if (isDisabled || !isPrimaryPress(event)) return
      onPress?.(value)
    },
    [onPress, value],
    [disabledFacet],
  )

  return (
    <fast-div className={rootClass} onMouseDown={press}>
      <fast-div className={boxClass}>
        <fast-div className="jui-radio-fill" />
      </fast-div>
      {label !== undefined && <fast-div className="jui-radio-label">{label}</fast-div>}
    </fast-div>
  )
}

type RadioItemProps = {
  option: RadioOption
  value: ReturnType<typeof useFacetWrap<string | undefined>>
  disabled: ReturnType<typeof useFacetWrap<boolean>>
  onPress?: (value: string) => void
}

const RadioItem = ({ option, value, disabled, onPress }: RadioItemProps) => {
  const selected = useFacetMap((current) => current === option.value, [option.value], [value])
  const optionDisabled = useFacetMap((isDisabled) => isDisabled || !!option.disabled, [option.disabled], [disabled])
  return (
    <Radio value={option.value} label={option.label} selected={selected} disabled={optionDisabled} onPress={onPress} />
  )
}

export const RadioGroup = ({ options, value, disabled, onChange }: RadioGroupProps) => {
  const valueFacet = useFacetWrap<string | undefined>(value)
  const disabledFacet = useFacetWrap(disabled ?? false)

  return (
    <fast-div className="jui-radiogroup">
      {options.map((option) => (
        <RadioItem key={option.value} option={option} value={valueFacet} disabled={disabledFacet} onPress={onChange} />
      ))}
    </fast-div>
  )
}
