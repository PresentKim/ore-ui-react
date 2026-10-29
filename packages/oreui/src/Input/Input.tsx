import { useCallback, useRef } from 'react'
import { useFacetCallback, useFacetMap, useFacetState, useFacetWrap } from '@react-facet/core'
import { clampNumber, stepNumber, useNativeInput } from '@ore-ui-react/core/src/input'
import type { FacetProp } from '@ore-ui-react/core'
import type { NumberInputProps, PasswordInputProps, TextInputProps } from '@ore-ui-react/core/src/input'
import './input.css'

const useRootClass = (disabled: FacetProp<boolean>) => {
  const disabledFacet = useFacetWrap(disabled)
  const className = useFacetMap((isDisabled) => `oui-input${isDisabled ? ' disabled' : ''}`, [], [disabledFacet])
  return { disabledFacet, className }
}

export const TextInput = ({ value, placeholder, maxLength, disabled, readOnly, onChange }: TextInputProps) => {
  const ref = useRef<HTMLInputElement>(null)
  const valueFacet = useFacetWrap(value)
  const { disabledFacet, className } = useRootClass(disabled ?? false)
  const onText = useCallback((text: string) => onChange?.(text), [onChange])
  useNativeInput(ref, { placeholder, readOnly, maxLength, onText })

  return (
    <fast-div className={className}>
      <fast-input className="oui-input-field" ref={ref} type="text" value={valueFacet} disabled={disabledFacet} />
    </fast-div>
  )
}

export const PasswordInput = ({ value, placeholder, maxLength, disabled, readOnly, onChange }: PasswordInputProps) => {
  const ref = useRef<HTMLInputElement>(null)
  const valueFacet = useFacetWrap(value)
  const { disabledFacet, className } = useRootClass(disabled ?? false)
  const [visible, setVisible] = useFacetState(false)
  const onText = useCallback((text: string) => onChange?.(text), [onChange])
  useNativeInput(ref, { placeholder, readOnly, maxLength, onText })

  const inputType = useFacetMap((isVisible) => (isVisible ? 'text' : 'password'), [], [visible])
  const toggleClass = useFacetMap(
    (isVisible) => (isVisible ? 'oui-input-toggle on' : 'oui-input-toggle off'),
    [],
    [visible],
  )
  const toggle = useFacetCallback(
    (isVisible: boolean, isDisabled: boolean) => (event: MouseEvent) => {
      if (isDisabled || event.button !== 0) return
      setVisible(!isVisible)
    },
    [setVisible],
    [visible, disabledFacet],
  )

  return (
    <fast-div className={className}>
      <fast-input className="oui-input-field" ref={ref} type={inputType} value={valueFacet} disabled={disabledFacet} />
      <fast-div className={toggleClass} onMouseDown={toggle} />
    </fast-div>
  )
}

export const NumberInput = ({
  value,
  min,
  max,
  step = 1,
  placeholder,
  disabled,
  readOnly,
  onChange,
}: NumberInputProps) => {
  const ref = useRef<HTMLInputElement>(null)
  const valueFacet = useFacetWrap(value)
  const text = useFacetMap((current) => String(current), [], [valueFacet])
  const { disabledFacet, className } = useRootClass(disabled ?? false)

  const onText = useCallback(
    (typed: string) => {
      const parsed = Number(typed)
      if (typed.trim() === '' || Number.isNaN(parsed)) return
      const clamped = clampNumber(parsed, min, max)
      if (clamped !== parsed && ref.current) ref.current.value = String(clamped)
      onChange?.(clamped)
    },
    [min, max, onChange],
  )
  useNativeInput(ref, { placeholder, readOnly, onText })

  const stepState = useFacetMap(
    (current, isDisabled) => ({ current: current as number, locked: (isDisabled as boolean) || (readOnly ?? false) }),
    [readOnly],
    [valueFacet, disabledFacet],
  )
  const stepBy = (direction: 1 | -1) =>
    useFacetCallback(
      ({ current, locked }: { current: number; locked: boolean }) =>
        (event: MouseEvent) => {
          if (locked || event.button !== 0) return
          onChange?.(stepNumber(current, direction * step, min, max))
        },
      [direction, step, min, max, onChange],
      [stepState],
    )
  const decrease = stepBy(-1)
  const increase = stepBy(1)

  return (
    <fast-div className={className}>
      <fast-div className="oui-input-step oui-input-decrease" onMouseDown={decrease} />
      <fast-input className="oui-input-field" ref={ref} type="text" value={text} disabled={disabledFacet} />
      <fast-div className="oui-input-step oui-input-increase" onMouseDown={increase} />
    </fast-div>
  )
}
