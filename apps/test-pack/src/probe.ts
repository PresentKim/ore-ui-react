import { createFacet } from '@react-facet/core'
import { countsText, keyName, modifiers, padsText, pushLog, route, seconds } from './helpers'

type Last = { x: number; y: number; buttons: number; moves: number; wheel: number }

const text = (initialValue: string) => createFacet<string>({ initialValue })

export const createProbe = () => {
  const started = Date.now()
  let lines: string[] = []
  let counts: Record<string, number> = {}
  const held: Record<string, string> = {}
  const last: Last = { x: 0, y: 0, buttons: 0, moves: 0, wheel: 0 }
  let holdStart = 0
  let shownValue = true
  let pendingRelease: (() => string) | null = null
  let frames = 0
  let fps = 0

  const shown = createFacet<boolean>({ initialValue: true })
  const currentRoute = text(route(window.location))
  const logText = text('')
  const stats = text('')
  const mouse = text('move the mouse')
  const keys = text('-')
  const pads = text('-')
  const countsFacet = text('-')
  const holdText = text('hold: -')
  const cursorLeft = text('0px')
  const cursorTop = text('0px')

  const log = (kind: string, line: string) => {
    counts[kind] = (counts[kind] || 0) + 1
    lines = pushLog(lines, `${seconds(started, Date.now())} ${kind} ${line}`)
    logText.set(lines.join('\n'))
  }

  const guard =
    <A extends unknown[]>(name: string, fn: (...args: A) => void) =>
    (...args: A) => {
      try {
        fn(...args)
      } catch (err) {
        log('throw', `${name}: ${err}`)
      }
    }

  const clear = () => {
    lines = []
    counts = {}
    logText.set('')
  }

  const toggleShown = () => {
    shownValue = !shownValue
    shown.set(shownValue)
    log('badge', `shown ${shownValue}`)
  }

  const startHold = () => {
    holdStart = Date.now()
  }

  const armRelease = (describe: () => string) => {
    pendingRelease = describe
  }

  const release = () => {
    if (holdStart) {
      log('button', `held ${Date.now() - holdStart}ms`)
      holdStart = 0
    }
    if (pendingRelease) {
      log('slider', pendingRelease())
      pendingRelease = null
    }
  }

  const moveCursor = (ev: MouseEvent) => {
    last.x = ev.clientX
    last.y = ev.clientY
    last.buttons = ev.buttons
    cursorLeft.set(`${ev.clientX}px`)
    cursorTop.set(`${ev.clientY}px`)
  }

  const tick = () => {
    const now = new Date()
    currentRoute.set(route(window.location))
    holdText.set(holdStart ? `hold: ${Date.now() - holdStart}ms` : 'hold: -')
    if (!shownValue) return
    stats.set(
      [
        `uptime ${seconds(started, Date.now())}s  fps ${fps}`,
        `time ${now.toLocaleTimeString()}`,
        `route ${route(window.location)}`,
        `url ${window.location.href}`,
        `window ${window.innerWidth}x${window.innerHeight}  dpr ${window.devicePixelRatio}`,
        `rem ${getComputedStyle(document.documentElement).fontSize}`,
        `ua ${navigator.userAgent.slice(0, 60)}`,
        `lang ${navigator.language}`,
      ].join('\n'),
    )
    mouse.set(`x ${last.x}  y ${last.y}  buttons ${last.buttons}\nmoves ${last.moves}  wheel sum ${last.wheel}`)
    const heldNames = Object.keys(held).map((key) => held[key])
    keys.set(heldNames.length ? heldNames.join('\n') : '-')
    pads.set(padsText(navigator.getGamepads ? navigator.getGamepads() : undefined))
    countsFacet.set(countsText(counts))
  }

  const attach = () => {
    const teardown: Array<() => void> = []
    const listen = (
      target: EventTarget,
      type: string,
      listener: (ev: any) => void,
      capture?: boolean,
    ) => {
      target.addEventListener(type, listener, capture)
      teardown.push(() => target.removeEventListener(type, listener, capture))
    }

    listen(
      document,
      'mousemove',
      (ev: MouseEvent) => {
        last.moves++
        counts.mousemove = (counts.mousemove || 0) + 1
        moveCursor(ev)
      },
      true,
    )
    for (const type of ['mousedown', 'mouseup', 'click', 'dblclick', 'contextmenu']) {
      listen(
        document,
        type,
        (ev: MouseEvent) => {
          moveCursor(ev)
          const target = ev.target as HTMLElement | null
          const name = target && (typeof target.className === 'string' && target.className ? target.className : target.tagName)
          log(type, `button=${ev.button} at ${ev.clientX},${ev.clientY} target=${name}${modifiers(ev)}`)
        },
        true,
      )
    }
    listen(
      document,
      'wheel',
      (ev: WheelEvent) => {
        last.wheel += ev.deltaY
        log('wheel', `dx=${ev.deltaX} dy=${ev.deltaY} mode=${ev.deltaMode}`)
      },
      true,
    )
    listen(
      document,
      'keydown',
      (ev: KeyboardEvent) => {
        held[ev.code || ev.key || String(ev.keyCode)] = keyName(ev)
        log('keydown', `${keyName(ev)}${ev.repeat ? ' repeat' : ''}${modifiers(ev)}`)
      },
      true,
    )
    listen(
      document,
      'keyup',
      (ev: KeyboardEvent) => {
        delete held[ev.code || ev.key || String(ev.keyCode)]
        log('keyup', `${keyName(ev)}${modifiers(ev)}`)
      },
      true,
    )
    for (const type of ['touchstart', 'touchend']) {
      listen(
        document,
        type,
        (ev: TouchEvent) => {
          const touch = ev.changedTouches && ev.changedTouches[0]
          log(type, touch ? `${touch.clientX},${touch.clientY}` : '')
        },
        true,
      )
    }
    listen(document, 'mouseup', guard('release', release))
    listen(window, 'focus', () => log('window', 'focus'))
    listen(window, 'blur', () => log('window', 'blur'))
    listen(window, 'resize', () => log('window', `resize ${window.innerWidth}x${window.innerHeight}`))
    listen(window, 'hashchange', () => log('route', route(window.location)))
    listen(window, 'unhandledrejection', (ev: PromiseRejectionEvent) => log('rejection', String(ev.reason)))

    const previousOnError = window.onerror
    window.onerror = (msg, _src, line, col) => {
      log('onerror', `${msg} @${line}:${col}`)
    }
    teardown.push(() => {
      window.onerror = previousOnError
    })

    const originalError = console.error
    console.error = (...args: unknown[]) => {
      log('console.error', args.join(' ').slice(0, 120))
      if (originalError) originalError.apply(console, args)
    }
    teardown.push(() => {
      console.error = originalError
    })

    let frameId = 0
    const frame = () => {
      frames++
      frameId = requestAnimationFrame(frame)
    }
    if (typeof requestAnimationFrame === 'function') {
      frameId = requestAnimationFrame(frame)
      teardown.push(() => cancelAnimationFrame(frameId))
    }
    const fpsTimer = setInterval(() => {
      fps = frames
      frames = 0
    }, 1000)
    const tickTimer = setInterval(guard('tick', tick), 100)
    teardown.push(() => {
      clearInterval(fpsTimer)
      clearInterval(tickTimer)
    })

    log('start', `route ${route(window.location)}`)
    tick()
    return () => teardown.forEach((undo) => undo())
  }

  return {
    attach,
    log,
    guard,
    clear,
    toggleShown,
    startHold,
    armRelease,
    shown,
    route: currentRoute,
    logText,
    stats,
    mouse,
    keys,
    pads,
    counts: countsFacet,
    holdText,
    cursorLeft,
    cursorTop,
  }
}

export type Probe = ReturnType<typeof createProbe>
