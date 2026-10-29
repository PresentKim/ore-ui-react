import type { FacetProp } from './props'

export type RadialMenuProps = {
  items: string[]
  disabled?: FacetProp<boolean>
  onChange?: (index: number) => void
}

export const RADIAL_SIZE = 24
export const RADIAL_INNER = 4
export const RADIAL_ORBIT = 8.5

export const sectorOf = (dx: number, dy: number, count: number): number => {
  const angle = Math.atan2(dx, -dy)
  const turns = (angle + Math.PI * 2) % (Math.PI * 2)
  return Math.round((turns / (Math.PI * 2)) * count) % count
}

export const sectorAtPointer = (clientX: number, clientY: number, rect: { left: number; top: number; width: number }, count: number): number => {
  const dx = clientX - (rect.left + rect.width / 2)
  const dy = clientY - (rect.top + rect.width / 2)
  const inner = (rect.width * RADIAL_INNER) / RADIAL_SIZE
  if (count <= 0 || Math.hypot(dx, dy) < inner) return -1
  return sectorOf(dx, dy, count)
}

export const sectorPlacement = (index: number, count: number) => {
  const angle = (index / count) * Math.PI * 2
  return {
    left: `${RADIAL_SIZE / 2 + RADIAL_ORBIT * Math.sin(angle)}rem`,
    top: `${RADIAL_SIZE / 2 - RADIAL_ORBIT * Math.cos(angle)}rem`,
  }
}
