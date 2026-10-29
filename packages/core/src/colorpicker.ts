import { NO_VALUE } from '@react-facet/core'
import type { Option } from '@react-facet/core'
import type { FacetProp } from './props'

export type ColorPickerProps = {
  value: FacetProp<string>
  onChange?: (hex: string) => void
}

export type HSV = { h: number; s: number; v: number }

const HEX_PATTERN = /^#?([0-9a-f]{6})$/i

export const normalizeHex = (text: string): string | null => {
  const match = HEX_PATTERN.exec(text.trim())
  return match ? `#${match[1].toLowerCase()}` : null
}

const channelHex = (channel: number) =>
  Math.round(Math.min(1, Math.max(0, channel)) * 255)
    .toString(16)
    .padStart(2, '0')

export const hsvToHex = (h: number, s: number, v: number): string => {
  const hue = ((h % 360) + 360) % 360
  const sector = Math.floor(hue / 60)
  const fraction = hue / 60 - sector
  const p = v * (1 - s)
  const q = v * (1 - s * fraction)
  const t = v * (1 - s * (1 - fraction))
  const [r, g, b] = [
    [v, t, p],
    [q, v, p],
    [p, v, t],
    [p, q, v],
    [t, p, v],
    [v, p, q],
  ][sector]
  return `#${channelHex(r)}${channelHex(g)}${channelHex(b)}`
}

export const adoptHex = (current: Option<HSV>, hex: string): HSV => {
  if (current !== NO_VALUE && hsvToHex(current.h, current.s, current.v) === normalizeHex(hex)) return current
  const next = hexToHsv(hex)
  return current !== NO_VALUE && (next.s === 0 || next.v === 0) ? { ...next, h: current.h } : next
}

export const hexToHsv =(hex: string): HSV => {
  const normalized = normalizeHex(hex)
  if (!normalized) return { h: 0, s: 0, v: 0 }
  const r = parseInt(normalized.slice(1, 3), 16) / 255
  const g = parseInt(normalized.slice(3, 5), 16) / 255
  const b = parseInt(normalized.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const delta = max - Math.min(r, g, b)
  let h = 0
  if (delta > 0) {
    if (max === r) h = ((g - b) / delta) % 6
    else if (max === g) h = (b - r) / delta + 2
    else h = (r - g) / delta + 4
    h = (h * 60 + 360) % 360
  }
  return { h, s: max === 0 ? 0 : delta / max, v: max }
}
