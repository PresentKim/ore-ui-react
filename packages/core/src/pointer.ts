export type PointerPoint = { clientX: number; clientY: number }

export type PressEvent = MouseEvent | TouchEvent

const TOUCH_WINDOW = 700

let touchAt = -Infinity

if (typeof document !== 'undefined') {
  document.addEventListener(
    'touchstart',
    () => {
      touchAt = Date.now()
    },
    true,
  )
}

const isTouch = (event: PressEvent): event is TouchEvent => 'touches' in event || 'changedTouches' in event

// Matches SkyGear oui-ddui.js onPress, which also takes a mousedown that carries no button value.
export const isPrimaryPress = (event: PressEvent) =>
  isTouch(event) || event.button === undefined || event.button === 0

// Gameface sends a mousedown for a tap as well as the touch events, in either order.
export const isMouseFromTouch = (event: PressEvent) =>
  !isTouch(event) && Date.now() - touchAt < TOUCH_WINDOW

export const pointOf = (event: PressEvent): PointerPoint => {
  if (!isTouch(event)) return event
  return event.touches?.[0] ?? event.changedTouches?.[0] ?? { clientX: 0, clientY: 0 }
}

// Gameface sends no mousemove while a finger moves, so a drag also follows the touch events.
export const trackDrag = (onMove: (point: PointerPoint) => void, onEnd?: () => void) => {
  const move = (event: PressEvent) => onMove(pointOf(event))
  const detach = () => {
    document.removeEventListener('mousemove', move)
    document.removeEventListener('touchmove', move)
    document.removeEventListener('mouseup', end)
    document.removeEventListener('touchend', end)
    document.removeEventListener('touchcancel', end)
  }
  const end = () => {
    detach()
    onEnd?.()
  }
  document.addEventListener('mousemove', move)
  document.addEventListener('touchmove', move)
  document.addEventListener('mouseup', end)
  document.addEventListener('touchend', end)
  document.addEventListener('touchcancel', end)
  return detach
}
