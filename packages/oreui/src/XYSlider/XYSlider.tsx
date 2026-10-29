import { useEffect, useRef } from 'react'
import { useFacetCallback, useFacetEffect, useFacetMap, useFacetWrap } from '@react-facet/core'
import { isMouseFromTouch, isPrimaryPress, pointOf, trackDrag } from '@ore-ui-react/core/src/pointer'
import type { PointerPoint, PressEvent } from '@ore-ui-react/core/src/pointer'
import { xyFromPointer, xyRatios } from '@ore-ui-react/core/src/xyslider'
import type { XYSliderProps } from '@ore-ui-react/core/src/xyslider'
import './xyslider.css'

export const XYSlider = ({
  value,
  minX = 0,
  maxX = 100,
  minY = 0,
  maxY = 100,
  step = 1,
  disabled,
  onChange,
}: XYSliderProps) => {
  const valueFacet = useFacetWrap(value)
  const disabledFacet = useFacetWrap(disabled ?? false)
  const areaRef = useRef<HTMLDivElement>(null)
  const detachRef = useRef<(() => void) | null>(null)

  useEffect(() => () => detachRef.current?.(), [])

  const rootClass = useFacetMap(
    (isDisabled) => (isDisabled ? 'oui-xyslider disabled' : 'oui-xyslider'),
    [],
    [disabledFacet],
  )
  const left = useFacetMap(
    (current) => `${xyRatios(current, { minX, maxX, minY, maxY, step }).x * 100}%`,
    [minX, maxX, minY, maxY, step],
    [valueFacet],
  )
  const top = useFacetMap(
    (current) => `${xyRatios(current, { minX, maxX, minY, maxY, step }).y * 100}%`,
    [minX, maxX, minY, maxY, step],
    [valueFacet],
  )

  const onPress = useFacetCallback(
    (isDisabled: boolean) => (event: PressEvent) => {
      const area = areaRef.current
      if (isDisabled || !isPrimaryPress(event) || isMouseFromTouch(event) || !area) return
      detachRef.current?.()

      const report = ({ clientX, clientY }: PointerPoint) => {
        const rect = area.getBoundingClientRect()
        onChange?.(xyFromPointer(clientX, clientY, rect, { minX, maxX, minY, maxY, step }))
      }

      detachRef.current = trackDrag(report, () => {
        detachRef.current = null
      })
      report(pointOf(event))
    },
    [onChange, minX, maxX, minY, maxY, step],
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
      <fast-div ref={areaRef} className="oui-xyslider-area">
        <fast-div className="oui-xyslider-handle" style={{ left, top }} />
      </fast-div>
    </fast-div>
  )
}
