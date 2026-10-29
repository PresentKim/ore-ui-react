import { useEffect, useRef } from 'react'
import { useFacetCallback, useFacetEffect, useFacetMap, useFacetWrap } from '@react-facet/core'
import { SliderProps, ratioOf, valueFromPointer } from '@ore-ui-react/core'
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

  const onMouseDown = useFacetCallback(
    (isDisabled: boolean) => (event: MouseEvent) => {
      const track = trackRef.current
      if (isDisabled || event.button !== 0 || !track) return
      detachRef.current?.()

      const report = (clientX: number) => {
        const rect = track.getBoundingClientRect()
        onChange?.(valueFromPointer(clientX, rect.left, rect.width, min, max, step))
      }
      const onMove = (moveEvent: MouseEvent) => report(moveEvent.clientX)
      const detach = () => {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', detach)
        detachRef.current = null
      }

      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', detach)
      detachRef.current = detach
      report(event.clientX)
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
    <fast-div className={rootClass} onMouseDown={onMouseDown}>
      <fast-div ref={trackRef} className="oui-slider-track">
        <fast-div className="oui-slider-fill" style={{ width: percent }} />
        <fast-div className="oui-slider-thumb" style={{ left: percent }} />
      </fast-div>
    </fast-div>
  )
}
