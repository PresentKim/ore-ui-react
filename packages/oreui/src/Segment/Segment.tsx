import { useFacetCallback, useFacetMap, useFacetWrap } from '@react-facet/core'
import { isPrimaryPress } from '@ore-ui-react/core/src/pointer'
import type { SegmentButtonProps, SegmentOption, SegmentProps } from '@ore-ui-react/core/src/segment'
import './segment.css'

export const SegmentButton = ({ value, label, active, disabled, onPress }: SegmentButtonProps) => {
  const activeFacet = useFacetWrap(active)
  const disabledFacet = useFacetWrap(disabled ?? false)

  const className = useFacetMap(
    (isActive, isDisabled) =>
      `oui-segment-button${isActive ? ' active' : ''}${isDisabled ? ' disabled' : ''}`,
    [],
    [activeFacet, disabledFacet],
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
    <fast-div className={className} onMouseDown={press}>
      {label}
    </fast-div>
  )
}

type SegmentItemProps = {
  option: SegmentOption
  value: ReturnType<typeof useFacetWrap<string | undefined>>
  disabled: ReturnType<typeof useFacetWrap<boolean>>
  onPress?: (value: string) => void
}

const SegmentItem = ({ option, value, disabled, onPress }: SegmentItemProps) => {
  const active = useFacetMap((current) => current === option.value, [option.value], [value])
  const optionDisabled = useFacetMap((isDisabled) => isDisabled || !!option.disabled, [option.disabled], [disabled])
  return (
    <SegmentButton
      value={option.value}
      label={option.label}
      active={active}
      disabled={optionDisabled}
      onPress={onPress}
    />
  )
}

export const Segment = ({ options, value, disabled, onChange }: SegmentProps) => {
  const valueFacet = useFacetWrap<string | undefined>(value)
  const disabledFacet = useFacetWrap(disabled ?? false)

  return (
    <fast-div className="oui-segment">
      {options.map((option) => (
        <SegmentItem key={option.value} option={option} value={valueFacet} disabled={disabledFacet} onPress={onChange} />
      ))}
    </fast-div>
  )
}
