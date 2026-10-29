import { useFacetCallback, useFacetMap, useFacetState, useFacetWrap } from '@react-facet/core'
import { Layer } from '@ore-ui-react/core/src/layer'
import { isPrimaryPress } from '@ore-ui-react/core/src/pointer'
import { useDropdownList } from '@ore-ui-react/core/src/dropdown'
import type { DropdownOption, DropdownProps } from '@ore-ui-react/core/src/dropdown'
import './dropdown.css'

export const Dropdown = ({ options, value, placeholder, disabled, onChange }: DropdownProps) => {
  const valueFacet = useFacetWrap<string | undefined>(value)
  const disabledFacet = useFacetWrap(disabled ?? false)
  const [open, setOpen] = useFacetState(false)
  const list = useDropdownList(open, setOpen)

  const rootClass = useFacetMap(
    (isOpen, isDisabled) => `oui-dropdown${isOpen ? ' open' : ''}${isDisabled ? ' disabled' : ''}`,
    [],
    [open, disabledFacet],
  )
  const placeholderDisplay = useFacetMap(
    (current) => (options.some((option) => option.value === current) ? 'none' : 'block'),
    [options],
    [valueFacet],
  )

  const toggle = useFacetCallback(
    (isOpen: boolean, isDisabled: boolean) => (event: MouseEvent) => {
      if (isDisabled || !isPrimaryPress(event)) return
      setOpen(!isOpen)
    },
    [setOpen],
    [open, disabledFacet],
  )

  return (
    <fast-div className={rootClass} ref={list.rootRef}>
      <fast-div className="oui-dropdown-trigger" ref={list.triggerRef} onMouseDown={toggle}>
        <fast-div className="oui-dropdown-current">
          <fast-div className="oui-dropdown-placeholder" style={{ display: placeholderDisplay }}>
            {placeholder}
          </fast-div>
          {options.map((option) => (
            <CurrentLabel key={option.value} option={option} value={valueFacet} />
          ))}
        </fast-div>
        <fast-div className="oui-dropdown-chevron" />
      </fast-div>
      <Layer>
        <fast-div
          className="oui-dropdown-list"
          ref={list.listRef}
          style={{
            display: list.display,
            left: list.left,
            top: list.top,
            width: list.width,
            maxHeight: list.maxHeight,
          }}
        >
          {options.map((option) => (
            <Option
              key={option.value}
              option={option}
              value={valueFacet}
              disabled={disabledFacet}
              onChoose={(chosen) => {
                onChange?.(chosen)
                setOpen(false)
              }}
            />
          ))}
        </fast-div>
      </Layer>
    </fast-div>
  )
}

type CurrentLabelProps = {
  option: DropdownOption
  value: ReturnType<typeof useFacetWrap<string | undefined>>
}

const CurrentLabel = ({ option, value }: CurrentLabelProps) => {
  const display = useFacetMap((current) => (current === option.value ? 'block' : 'none'), [option.value], [value])
  return <fast-div style={{ display }}>{option.label}</fast-div>
}

type OptionProps = CurrentLabelProps & {
  disabled: ReturnType<typeof useFacetWrap<boolean>>
  onChoose: (value: string) => void
}

const Option = ({ option, value, disabled, onChoose }: OptionProps) => {
  const className = useFacetMap(
    (current, isDisabled) =>
      `oui-dropdown-option${current === option.value ? ' on' : ''}${option.disabled || isDisabled ? ' disabled' : ''}`,
    [option.value, option.disabled],
    [value, disabled],
  )
  const press = useFacetCallback(
    (isDisabled: boolean) => (event: MouseEvent) => {
      if (isDisabled || option.disabled || !isPrimaryPress(event)) return
      onChoose(option.value)
    },
    [option.value, option.disabled, onChoose],
    [disabled],
  )
  return (
    <fast-div className={className} onMouseDown={press}>
      {option.label}
    </fast-div>
  )
}
