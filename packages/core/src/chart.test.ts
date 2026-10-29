import { describe, expect, it } from 'vitest'
import { barBoxes, chartDomain, lineSegments, segmentBetween } from './chart'

describe('segmentBetween', () => {
  it('measures a 3-4-5 segment', () => {
    expect(segmentBetween(0, 0, 3, 4)).toEqual({ left: 0, top: 0, length: 5, angle: 53.13 })
  })
  it('starts at the first point', () => {
    expect(segmentBetween(2, 8, 2, 3)).toEqual({ left: 2, top: 8, length: 5, angle: -90 })
  })
  it('rounds to 2 decimals', () => {
    expect(segmentBetween(0, 0, 1, 1)).toEqual({ left: 0, top: 0, length: 1.41, angle: 45 })
  })
})

describe('chartDomain', () => {
  it('includes zero', () => {
    expect(chartDomain([2, 4, 8])).toEqual([0, 8])
    expect(chartDomain([-4, 4])).toEqual([-4, 4])
    expect(chartDomain([-4, -2])).toEqual([-4, 0])
  })
  it('falls back for empty and all-zero data', () => {
    expect(chartDomain([])).toEqual([0, 1])
    expect(chartDomain([0, 0])).toEqual([0, 1])
  })
  it('honors a fixed domain', () => {
    expect(chartDomain([2], [0, 10])).toEqual([0, 10])
  })
})

describe('barBoxes', () => {
  it('scales heights to the max', () => {
    expect(barBoxes([2, 4, 8], [0, 8])).toEqual({
      baseline: 0,
      bars: [
        { bottom: 0, height: 0.25 },
        { bottom: 0, height: 0.5 },
        { bottom: 0, height: 1 },
      ],
    })
  })
  it('puts negative bars below the baseline', () => {
    expect(barBoxes([-4, 4], [-4, 4])).toEqual({
      baseline: 0.5,
      bars: [
        { bottom: 0, height: 0.5 },
        { bottom: 0.5, height: 0.5 },
      ],
    })
  })
})

describe('lineSegments', () => {
  it('returns n-1 segments', () => {
    expect(lineSegments([1, 2, 3, 4], [0, 4], 30, 16)).toHaveLength(3)
    expect(lineSegments([1], [0, 4], 30, 16)).toHaveLength(0)
    expect(lineSegments([], [0, 4], 30, 16)).toHaveLength(0)
  })
  it('measures in the plot box', () => {
    expect(lineSegments([0, 8], [0, 8], 30, 16)).toEqual([{ left: 0, top: 16, length: 34, angle: -28.07 }])
  })
})
