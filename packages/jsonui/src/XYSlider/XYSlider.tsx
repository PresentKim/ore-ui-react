import { useEffect, useRef } from 'react'
import { useFacetCallback, useFacetEffect, useFacetMap, useFacetWrap } from '@react-facet/core'
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
    (isDisabled) => (isDisabled ? 'jui-xyslider disabled' : 'jui-xyslider'),
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

  const onMouseDown = useFacetCallback(
    (isDisabled: boolean) => (event: MouseEvent) => {
      const area = areaRef.current
      if (isDisabled || event.button !== 0 || !area) return
      detachRef.current?.()

      const report = (clientX: number, clientY: number) => {
        const rect = area.getBoundingClientRect()
        onChange?.(xyFromPointer(clientX, clientY, rect, { minX, maxX, minY, maxY, step }))
      }
      const onMove = (moveEvent: MouseEvent) => report(moveEvent.clientX, moveEvent.clientY)
      const detach = () => {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', detach)
        detachRef.current = null
      }

      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', detach)
      detachRef.current = detach
      report(event.clientX, event.clientY)
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
    <fast-div className={rootClass} onMouseDown={onMouseDown}>
      <fast-div ref={areaRef} className="jui-xyslider-area">
        <fast-div className="jui-xyslider-handle" style={{ left, top }} />
      </fast-div>
    </fast-div>
  )
}
