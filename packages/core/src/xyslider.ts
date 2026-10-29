import type { FacetProp } from './props'
import { ratioOf, valueFromPointer } from './range'

export type XYValue = { x: number; y: number }

export type XYSliderProps = {
  value: FacetProp<XYValue>
  minX?: number
  maxX?: number
  minY?: number
  maxY?: number
  step?: number
  disabled?: FacetProp<boolean>
  onChange?: (value: XYValue) => void
}

export type XYArea = { left: number; top: number; width: number; height: number }

export type XYRange = { minX: number; maxX: number; minY: number; maxY: number; step: number }

export const xyFromPointer = (clientX: number, clientY: number, area: XYArea, range: XYRange): XYValue => ({
  x: valueFromPointer(clientX, area.left, area.width, range.minX, range.maxX, range.step),
  y: valueFromPointer(clientY, area.top, area.height, range.minY, range.maxY, range.step),
})

export const xyRatios = (value: XYValue, range: XYRange): XYValue => ({
  x: ratioOf(value.x, range.minX, range.maxX),
  y: ratioOf(value.y, range.minY, range.maxY),
})
