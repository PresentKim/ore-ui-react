import { describe, expect, it } from 'vitest'
import { ratioOf, snapToStep, valueFromPointer } from './range'

describe('snapToStep', () => {
  it('snaps to nearest step', () => {
    expect(snapToStep(47, 0, 100, 10)).toBe(50)
  })
  it('returns the value for zero step', () => {
    expect(snapToStep(5, 0, 10, 0)).toBe(5)
  })
  it('removes float noise', () => {
    expect(snapToStep(0.1 + 0.2, 0, 1, 0.1)).toBe(0.3)
  })
  it('clamps below min', () => {
    expect(snapToStep(-5, 0, 100, 1)).toBe(0)
  })
  it('snaps fractional steps', () => {
    expect(snapToStep(0.3, 0, 1, 0.25)).toBe(0.25)
  })
})

describe('ratioOf', () => {
  it('returns the fraction', () => {
    expect(ratioOf(25, 0, 100)).toBe(0.25)
  })
  it('clamps above max', () => {
    expect(ratioOf(150, 0, 100)).toBe(1)
  })
  it('returns 0 for empty range', () => {
    expect(ratioOf(5, 5, 5)).toBe(0)
  })
})

describe('valueFromPointer', () => {
  it('maps pointer to value', () => {
    expect(valueFromPointer(150, 100, 200, 0, 100, 1)).toBe(25)
  })
  it('clamps left of track', () => {
    expect(valueFromPointer(50, 100, 200, 0, 100, 1)).toBe(0)
  })
  it('clamps right of track', () => {
    expect(valueFromPointer(400, 100, 200, 0, 100, 1)).toBe(100)
  })
  it('returns 0 for zero width', () => {
    expect(valueFromPointer(10, 0, 0, 0, 100, 1)).toBe(0)
  })
})
