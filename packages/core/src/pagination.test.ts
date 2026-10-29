import { describe, expect, it } from 'vitest'
import { pageWindow, stepPage } from './pagination'

describe('pageWindow', () => {
  it('centers on the page', () => expect(pageWindow(5, 10, 5)).toEqual([3, 4, 5, 6, 7]))
  it('clamps at the start', () => expect(pageWindow(1, 10, 5)).toEqual([1, 2, 3, 4, 5]))
  it('clamps at the end', () => expect(pageWindow(10, 10, 5)).toEqual([6, 7, 8, 9, 10]))
  it('shrinks to the page count', () => expect(pageWindow(2, 3, 5)).toEqual([1, 2, 3]))
  it('is empty without pages', () => expect(pageWindow(1, 0, 5)).toEqual([]))
})

describe('stepPage', () => {
  it('stops at the bounds', () => {
    expect(stepPage(1, 5, -1, false)).toBeUndefined()
    expect(stepPage(5, 5, 1, false)).toBeUndefined()
  })
  it('wraps with loop', () => {
    expect(stepPage(1, 5, -1, true)).toBe(5)
    expect(stepPage(5, 5, 1, true)).toBe(1)
  })
  it('moves inside the bounds', () => expect(stepPage(2, 5, 1, false)).toBe(3))
})
