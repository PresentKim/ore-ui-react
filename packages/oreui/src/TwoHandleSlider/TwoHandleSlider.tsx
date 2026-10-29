import { useEffect, useRef } from 'react'
import { useFacetCallback, useFacetEffect, useFacetMap, useFacetWrap } from '@react-facet/core'
import { isMouseFromTouch, isPrimaryPress, pointOf, ratioOf, trackDrag, valueFromPointer } from '@ore-ui-react/core'
import type { PressEvent } from '@ore-ui-react/core'
import type { TwoHandleSliderProps } from '@ore-ui-react/core/src/twohandleslider'
import './twohandleslider.css'

export const TwoHandleSlider = ({ value, min = 0, max = 100, step = 1, disabled, onChange }: TwoHandleSliderProps) => {
  const valueFacet = useFacetWrap(value)
  const disabledFacet = useFacetWrap(disabled ?? false)
  const trackRef = useRef<HTMLDivElement>(null)
  const detachRef = useRef<(() => void) | null>(null)
  const rangeRef = useRef<[number, number]>([min, max])

  useEffect(() => () => detachRef.current?.(), [])

  useFacetEffect(
    (current) => {
      rangeRef.current = current
    },
    [],
    [valueFacet],
  )

  const rootClass = useFacetMap(
    (isDisabled) => (isDisabled ? 'oui-twohandleslider disabled' : 'oui-twohandleslider'),
    [],
    [disabledFacet],
  )
  const lowPercent = useFacetMap(([low]) => `${ratioOf(low, min, max) * 100}%`, [min, max], [valueFacet])
  const highPercent = useFacetMap(([, high]) => `${ratioOf(high, min, max) * 100}%`, [min, max], [valueFacet])
  const fillWidth = useFacetMap(
    ([low, high]) => `${ratioOf(min + high - low, min, max) * 100}%`,
    [min, max],
    [valueFacet],
  )

  const onPress = useFacetCallback(
    (isDisabled: boolean) => (event: PressEvent) => {
      const track = trackRef.current
      if (isDisabled || !isPrimaryPress(event) || isMouseFromTouch(event) || !track) return
      detachRef.current?.()

      const pointerValue = (clientX: number) => {
        const rect = track.getBoundingClientRect()
        return valueFromPointer(clientX, rect.left, rect.width, min, max, step)
      }

      const [startLow, startHigh] = rangeRef.current
      const start = pointOf(event)
      const pressed = pointerValue(start.clientX)
      const lowDistance = Math.abs(pressed - startLow)
      const highDistance = Math.abs(pressed - startHigh)
      const movesLow = lowDistance < highDistance || (lowDistance === highDistance && pressed < startLow)

      const report = ({ clientX }: { clientX: number }) => {
        const [low, high] = rangeRef.current
        const next = pointerValue(clientX)
        onChange?.(movesLow ? [Math.min(next, high), high] : [low, Math.max(next, low)])
      }

      detachRef.current = trackDrag(report, () => {
        detachRef.current = null
      })
      report(start)
    },
    [onChange, min, max, step],
    [disabledFacet],
  )

  useFacetEffect(
    (isDisabled) => {
      if (isDisabled) detachRef.current?.()
    },
    [],
    [disabledFacet],
  )

  return (
    <fast-div className={rootClass} onMouseDown={onPress} onTouchStart={onPress}>
      <fast-div ref={trackRef} className="oui-twohandleslider-track">
        <fast-div className="oui-twohandleslider-fill" style={{ left: lowPercent, width: fillWidth }} />
        <fast-div className="oui-twohandleslider-thumb" style={{ left: lowPercent }} />
        <fast-div className="oui-twohandleslider-thumb" style={{ left: highPercent }} />
      </fast-div>
    </fast-div>
  )
}
