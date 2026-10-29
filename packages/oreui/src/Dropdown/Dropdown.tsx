import { useEffect, useRef } from 'react'
import { useFacetCallback, useFacetMap, useFacetState, useFacetWrap } from '@react-facet/core'
import type { DropdownOption, DropdownProps } from '@ore-ui-react/core/src/dropdown'
import './dropdown.css'

export const Dropdown = ({ options, value, placeholder, disabled, onChange }: DropdownProps) => {
  const valueFacet = useFacetWrap<string | undefined>(value)
  const disabledFacet = useFacetWrap(disabled ?? false)
  const [open, setOpen] = useFacetState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onOutside = (event: MouseEvent) => {
      const root = rootRef.current
      if (root && event.target instanceof Node && root.contains(event.target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [setOpen])

  const rootClass = useFacetMap(
    (isOpen, isDisabled) => `oui-dropdown${isOpen ? ' open' : ''}${isDisabled ? ' disabled' : ''}`,
    [],
    [open, disabledFacet],
  )
  const listDisplay = useFacetMap((isOpen) => (isOpen ? 'block' : 'none'), [], [open])
  const placeholderDisplay = useFacetMap(
    (current) => (options.some((option) => option.value === current) ? 'none' : 'block'),
    [options],
    [valueFacet],
  )

  const toggle = useFacetCallback(
    (isOpen: boolean, isDisabled: boolean) => (event: MouseEvent) => {
      if (isDisabled || event.button !== 0) return
      setOpen(!isOpen)
    },
    [setOpen],
    [open, disabledFacet],
  )

  return (
    <fast-div className={rootClass} ref={rootRef}>
      <fast-div className="oui-dropdown-trigger" onMouseDown={toggle}>
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
      <fast-div className="oui-dropdown-list" style={{ display: listDisplay }}>
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
      if (isDisabled || option.disabled || event.button !== 0) return
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
