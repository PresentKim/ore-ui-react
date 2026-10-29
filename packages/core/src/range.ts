const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const decimalsOf = (n: number) => {
  const text = String(n)
  const exponent = text.indexOf('e-')
  if (exponent >= 0) return Number(text.slice(exponent + 2))
  const dot = text.indexOf('.')
  return dot < 0 ? 0 : text.length - dot - 1
}

export const snapToStep = (value: number, min: number, max: number, step: number): number => {
  const clamped = clamp(value, min, max)
  if (!(step > 0)) return clamped
  const snapped = min + Math.round((clamped - min) / step) * step
  const digits = Math.max(decimalsOf(step), decimalsOf(min))
  return clamp(Number(snapped.toFixed(digits)), min, max)
}

export const ratioOf = (value: number, min: number, max: number): number => {
  if (!(max > min)) return 0
  return clamp((value - min) / (max - min), 0, 1)
}

export const valueFromPointer = (
  x: number,
  left: number,
  width: number,
  min: number,
  max: number,
  step: number,
): number => {
  if (!(width > 0)) return 0
  const ratio = clamp((x - left) / width, 0, 1)
  return snapToStep(min + ratio * (max - min), min, max, step)
}
