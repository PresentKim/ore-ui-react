import { describe, expect, it } from 'vitest'
import { LOG_LINES, countsText, keyName, modifiers, padsText, pushLog, seconds } from './helpers'

describe('pushLog', () => {
  it('keeps the 16 newest lines, newest first', () => {
    let lines: string[] = []
    for (let i = 0; i < 20; i++) lines = pushLog(lines, `l${i}`)
    expect(lines).toHaveLength(LOG_LINES)
    expect(lines[0]).toBe('l19')
    expect(lines[15]).toBe('l4')
  })

  it('does not mutate the input', () => {
    const lines = ['a']
    pushLog(lines, 'b')
    expect(lines).toEqual(['a'])
  })
})

describe('keyName', () => {
  it('formats key, code and keyCode', () => {
    expect(keyName({ key: 'a', code: 'KeyA', keyCode: 65 })).toBe('a code=KeyA keyCode=65')
  })

  it('falls back to ? for missing fields', () => {
    expect(keyName({ keyCode: 0 })).toBe('? code=? keyCode=0')
  })
})

describe('modifiers', () => {
  it('lists pressed modifiers', () => {
    expect(modifiers({ ctrlKey: true, shiftKey: true, altKey: false, metaKey: false })).toBe(' [CS]')
    expect(modifiers({ ctrlKey: true, shiftKey: true, altKey: true, metaKey: true })).toBe(' [CSAM]')
  })

  it('is empty without modifiers', () => {
    expect(modifiers({})).toBe('')
  })
})

describe('padsText', () => {
  it('reports a missing API', () => {
    expect(padsText(undefined)).toBe('navigator.getGamepads missing')
  })

  it('reports none', () => {
    expect(padsText([null, null])).toBe('none')
  })

  it('lists pressed buttons and axes', () => {
    const pad = {
      id: 'Pad',
      buttons: [{ pressed: false }, { pressed: true }, { pressed: true }],
      axes: [0, -1.234],
    } as unknown as Gamepad
    expect(padsText([null, pad])).toBe('1: Pad buttons=[1,2] axes=0.00,-1.23')
  })
})

describe('formatting', () => {
  it('formats elapsed seconds', () => {
    expect(seconds(1000, 3450)).toBe('2.5')
  })

  it('sorts counts by name', () => {
    expect(countsText({ b: 2, a: 1 })).toBe('a=1  b=2')
    expect(countsText({})).toBe('-')
  })
})
