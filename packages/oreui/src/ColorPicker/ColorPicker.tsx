import { useCallback, useEffect, useRef } from 'react'
import { useFacetCallback, useFacetEffect, useFacetMap, useFacetState, useFacetWrap } from '@react-facet/core'
import { isMouseFromTouch, isPrimaryPress, pointOf, trackDrag, valueFromPointer } from '@ore-ui-react/core'
import type { PointerPoint, PressEvent } from '@ore-ui-react/core'
import { adoptHex, hexToHsv, hsvToHex, normalizeHex } from '@ore-ui-react/core/src/colorpicker'
import type { ColorPickerProps, HSV } from '@ore-ui-react/core/src/colorpicker'
import { useNativeInput } from '@ore-ui-react/core/src/input'
import { xyFromPointer } from '@ore-ui-react/core/src/xyslider'
import './colorpicker.css'

const UNIT = { minX: 0, maxX: 1, minY: 0, maxY: 1, step: 0 }

export const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  const valueFacet = useFacetWrap(value)
  const [hsv, setHsv] = useFacetState<HSV>(hexToHsv('#ff0000'))
  const areaRef = useRef<HTMLDivElement>(null)
  const hueRef = useRef<HTMLDivElement>(null)
  const fieldRef = useRef<HTMLInputElement>(null)
  const detachRef = useRef<(() => void) | null>(null)

  useEffect(() => () => detachRef.current?.(), [])

  useFacetEffect(
    (hex) => {
      setHsv((current) => adoptHex(current, hex))
    },
    [setHsv],
    [valueFacet],
  )

  const hex = useFacetMap((current) => hsvToHex(current.h, current.s, current.v), [], [hsv])
  const hueHex = useFacetMap((current) => hsvToHex(current.h, 1, 1), [], [hsv])
  const handleLeft = useFacetMap((current) => `${current.s * 100}%`, [], [hsv])
  const handleTop = useFacetMap((current) => `${(1 - current.v) * 100}%`, [], [hsv])
  const hueLeft = useFacetMap((current) => `${(current.h / 360) * 100}%`, [], [hsv])

  const publish = useCallback(
    (next: HSV) => {
      setHsv(next)
      onChange?.(hsvToHex(next.h, next.s, next.v))
    },
    [setHsv, onChange],
  )

  const startDrag = useCallback(
    (event: PressEvent, report: (point: PointerPoint) => void) => {
      detachRef.current?.()
      detachRef.current = trackDrag(report, () => {
        detachRef.current = null
      })
      report(pointOf(event))
    },
    [],
  )

  const onAreaDown = useFacetCallback(
    (current: HSV) => (event: PressEvent) => {
      const area = areaRef.current
      if (!isPrimaryPress(event) || isMouseFromTouch(event) || !area) return
      startDrag(event, ({ clientX, clientY }) => {
        const point = xyFromPointer(clientX, clientY, area.getBoundingClientRect(), UNIT)
        publish({ h: current.h, s: point.x, v: 1 - point.y })
      })
    },
    [startDrag, publish],
    [hsv],
  )

  const onHueDown = useFacetCallback(
    (current: HSV) => (event: PressEvent) => {
      const strip = hueRef.current
      if (!isPrimaryPress(event) || isMouseFromTouch(event) || !strip) return
      startDrag(event, ({ clientX }) => {
        const rect = strip.getBoundingClientRect()
        publish({ h: valueFromPointer(clientX, rect.left, rect.width, 0, 360, 0), s: current.s, v: current.v })
      })
    },
    [startDrag, publish],
    [hsv],
  )

  const onText = useCallback(
    (text: string) => {
      const normalized = normalizeHex(text)
      if (!normalized) return
      setHsv((current) => adoptHex(current, normalized))
      onChange?.(normalized)
    },
    [setHsv, onChange],
  )
  useNativeInput(fieldRef, { placeholder: '#rrggbb', maxLength: 7, onText })

  return (
    <fast-div className="oui-colorpicker">
      <fast-div ref={areaRef} className="oui-colorpicker-area" style={{ backgroundColor: hueHex }} onMouseDown={onAreaDown} onTouchStart={onAreaDown}>
        <fast-div className="oui-colorpicker-handle" style={{ left: handleLeft, top: handleTop }} />
      </fast-div>
      <fast-div ref={hueRef} className="oui-colorpicker-hue" onMouseDown={onHueDown} onTouchStart={onHueDown}>
        <fast-div className="oui-colorpicker-hue-handle" style={{ left: hueLeft }} />
      </fast-div>
      <fast-div className="oui-colorpicker-preview">
        <fast-div className="oui-colorpicker-swatch" style={{ backgroundColor: hex }} />
        <fast-input className="oui-colorpicker-hex" ref={fieldRef} type="text" value={hex} />
      </fast-div>
    </fast-div>
  )
}
