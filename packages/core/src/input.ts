import { useEffect } from 'react'
import type { RefObject } from 'react'
import type { FacetProp } from './props'

export type TextInputProps = {
  value: FacetProp<string>
  placeholder?: string
  maxLength?: number
  disabled?: FacetProp<boolean>
  readOnly?: boolean
  onChange?: (value: string) => void
}

export type PasswordInputProps = TextInputProps

export type NumberInputProps = {
  value: FacetProp<number>
  min?: number
  max?: number
  step?: number
  placeholder?: string
  disabled?: FacetProp<boolean>
  readOnly?: boolean
  onChange?: (value: number) => void
}

export const clampNumber = (value: number, min?: number, max?: number) => {
  const floored = min === undefined ? value : Math.max(min, value)
  return max === undefined ? floored : Math.min(max, floored)
}

export const stepNumber = (value: number, delta: number, min?: number, max?: number) =>
  clampNumber(Number((value + delta).toFixed(10)), min, max)

type NativeInputOptions = {
  placeholder?: string
  readOnly?: boolean
  maxLength?: number
  onText: (text: string) => void
}

export const useNativeInput = (
  ref: RefObject<HTMLInputElement>,
  { placeholder, readOnly, maxLength, onText }: NativeInputOptions,
) => {
  useEffect(() => {
    const element = ref.current
    if (!element) return
    element.placeholder = placeholder ?? ''
    element.readOnly = readOnly ?? false
  }, [ref, placeholder, readOnly])

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const onInput = () => {
      let text = element.value
      if (maxLength !== undefined && text.length > maxLength) {
        text = text.slice(0, maxLength)
        element.value = text
      }
      onText(text)
    }
    element.addEventListener('input', onInput)
    return () => element.removeEventListener('input', onInput)
  }, [ref, maxLength, onText])
}
