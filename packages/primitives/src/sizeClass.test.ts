import { describe, expect, it } from 'vitest'
import { guiSize, sizeClassOf } from './sizeClass'

describe('guiSize', () => {
  it('converts GUI px to rem', () => {
    expect(guiSize(326)).toBe('65.2rem')
    expect(guiSize(166)).toBe('33.2rem')
    expect(guiSize(0)).toBe('0rem')
  })

  it('passes strings through', () => {
    expect(guiSize('50vw')).toBe('50vw')
  })
})

describe('sizeClassOf', () => {
  it('splits at 64rem and 100rem', () => {
    expect(sizeClassOf(63.9)).toBe('s')
    expect(sizeClassOf(64)).toBe('m')
    expect(sizeClassOf(99.9)).toBe('m')
    expect(sizeClassOf(100)).toBe('l')
  })
})
