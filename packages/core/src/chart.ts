import type { FacetProp } from './props'

export type ChartProps = {
  data: FacetProp<number[]>
  domain?: [number, number]
  width?: number
  height?: number
}

export type Segment = { left: number; top: number; length: number; angle: number }
export type Point = { left: number; top: number }

export const round2 = (n: number): number => Number(n.toFixed(2)) + 0

export const segmentBetween = (x1: number, y1: number, x2: number, y2: number): Segment => ({
  left: round2(x1),
  top: round2(y1),
  length: round2(Math.hypot(x2 - x1, y2 - y1)),
  angle: round2((Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI),
})

export const chartDomain = (values: number[], domain?: [number, number]): [number, number] => {
  if (domain) return domain
  const min = Math.min(0, ...values)
  const max = Math.max(0, ...values)
  return max > min ? [min, max] : [0, 1]
}

const ratioIn = (value: number, [min, max]: [number, number]) => (value - min) / (max - min)

export const barBoxes = (values: number[], domain: [number, number]) => {
  const baseline = Math.min(1, Math.max(0, ratioIn(0, domain)))
  const bars = values.map((value) => {
    const ratio = Math.min(1, Math.max(0, ratioIn(value, domain)))
    return { bottom: Math.min(baseline, ratio), height: Math.abs(ratio - baseline) }
  })
  return { baseline, bars }
}

export const linePoints = (values: number[], domain: [number, number], width: number, height: number): Point[] =>
  values.map((value, index) => ({
    left: round2(values.length > 1 ? (index / (values.length - 1)) * width : width / 2),
    top: round2(height * (1 - Math.min(1, Math.max(0, ratioIn(value, domain))))),
  }))

export const lineSegments = (values: number[], domain: [number, number], width: number, height: number): Segment[] => {
  const points = linePoints(values, domain, width, height)
  return points.slice(1).map((point, index) => segmentBetween(points[index].left, points[index].top, point.left, point.top))
}
