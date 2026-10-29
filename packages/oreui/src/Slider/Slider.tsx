import { useEffect, useRef } from 'react'
import { useFacetCallback, useFacetEffect, useFacetMap, useFacetWrap } from '@react-facet/core'
import {
  PressEvent,
  SliderProps,
  isMouseFromTouch,
  isPrimaryPress,
  pointOf,
  ratioOf,
  trackDrag,
  valueFromPointer,
} from '@ore-ui-react/core'
import './slider.css'

export const Slider = ({ value, min = 0, max = 100, step = 1, disabled, onChange }: SliderProps) => {
  const valueFacet = useFacetWrap(value)
  const disabledFacet = useFacetWrap(disabled ?? false)
  const trackRef = useRef<HTMLDivElement>(null)
  const detachRef = useRef<(() => void) | null>(null)

  useEffect(() => () => detachRef.current?.(), [])

  const rootClass = useFacetMap(
    (isDisabled) => (isDisabled ? 'oui-slider disabled' : 'oui-slider'),
    [],
    [disabledFacet],
  )
  const percent = useFacetMap((current) => `${ratioOf(current, min, max) * 100}%`, [min, max], [valueFacet])

  const onPress = useFacetCallback(
    (isDisabled: boolean) => (event: PressEvent) => {
      const track = trackRef.current
      if (isDisabled || !isPrimaryPress(event) || isMouseFromTouch(event) || !track) return
      detachRef.current?.()

      const report = ({ clientX }: { clientX: number }) => {
        const rect = track.getBoundingClientRect()
        onChange?.(valueFromPointer(clientX, rect.left, rect.width, min, max, step))
      }

      detachRef.current = trackDrag(report, () => {
        detachRef.current = null
      })
      report(pointOf(event))
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
      <fast-div ref={trackRef} className="oui-slider-track">
        <fast-div className="oui-slider-fill" style={{ width: percent }} />
        <fast-div className="oui-slider-thumb" style={{ left: percent }} />
      </fast-div>
    </fast-div>
  )
}
