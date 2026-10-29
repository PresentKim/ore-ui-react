export const LOG_LINES = 16

export const pushLog = (lines: string[], line: string) => [line, ...lines].slice(0, LOG_LINES)

type Modifiers = { ctrlKey?: boolean; shiftKey?: boolean; altKey?: boolean; metaKey?: boolean }

export const modifiers = (ev: Modifiers) => {
  const flags = `${ev.ctrlKey ? 'C' : ''}${ev.shiftKey ? 'S' : ''}${ev.altKey ? 'A' : ''}${ev.metaKey ? 'M' : ''}`
  return flags ? ` [${flags}]` : ''
}

type KeyLike = { key?: string; code?: string; keyCode: number }

export const keyName = (ev: KeyLike) => `${ev.key || '?'} code=${ev.code || '?'} keyCode=${ev.keyCode}`

export const seconds = (started: number, now: number) => ((now - started) / 1000).toFixed(1)

export const countsText = (counts: Record<string, number>) => {
  const keys = Object.keys(counts).sort()
  return keys.length ? keys.map((key) => `${key}=${counts[key]}`).join('  ') : '-'
}

export const route = (location: { pathname: string; hash: string }) => location.pathname + location.hash

export const padsText = (pads: ArrayLike<Gamepad | null> | undefined) => {
  if (!pads) return 'navigator.getGamepads missing'
  const out: string[] = []
  for (let i = 0; i < pads.length; i++) {
    const pad = pads[i]
    if (!pad) continue
    const pressed: number[] = []
    for (let b = 0; b < pad.buttons.length; b++) {
      if (pad.buttons[b].pressed) pressed.push(b)
    }
    const axes = Array.prototype.map.call(pad.axes, (axis: number) => axis.toFixed(2)).join(',')
    out.push(`${i}: ${pad.id.slice(0, 30)} buttons=[${pressed.join(',')}] axes=${axes}`)
  }
  return out.length ? out.join('\n') : 'none'
}
