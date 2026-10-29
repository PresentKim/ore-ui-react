import { useFacetCallback, useFacetMap, useFacetState, useFacetWrap } from '@react-facet/core'
import type { Facet } from '@react-facet/core'
import { isMouseFromTouch, isPrimaryPress, pointOf } from '@ore-ui-react/core/src/pointer'
import type { PressEvent } from '@ore-ui-react/core/src/pointer'
import { RADIAL_SIZE, sectorAtPointer, sectorPlacement } from '@ore-ui-react/core/src/radialmenu'
import type { RadialMenuProps } from '@ore-ui-react/core/src/radialmenu'
import './radialmenu.css'

type ItemProps = { label: string; index: number; count: number; highlight: Facet<number> }

const RadialItem = ({ label, index, count, highlight }: ItemProps) => {
  const className = useFacetMap(
    (current) => (current === index ? 'jui-radialmenu-item active' : 'jui-radialmenu-item'),
    [index],
    [highlight],
  )
  return (
    <fast-div className={className} style={sectorPlacement(index, count)}>
      <fast-text text={label} />
    </fast-div>
  )
}

export const RadialMenu = ({ items, disabled, onChange }: RadialMenuProps) => {
  const disabledFacet = useFacetWrap(disabled ?? false)
  const [highlight, setHighlight] = useFacetState<number>(-1)
  const count = items.length

  const rootClass = useFacetMap(
    (isDisabled) => (isDisabled ? 'jui-radialmenu disabled' : 'jui-radialmenu'),
    [],
    [disabledFacet],
  )

  const sectorOfEvent = (event: PressEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    const { clientX, clientY } = pointOf(event)
    return sectorAtPointer(clientX, clientY, rect, count)
  }

  const onMouseMove = useFacetCallback(
    (isDisabled: boolean) => (event: MouseEvent) => {
      setHighlight(isDisabled ? -1 : sectorOfEvent(event))
    },
    [count, setHighlight],
    [disabledFacet],
  )

  const onPress = useFacetCallback(
    (isDisabled: boolean) => (event: PressEvent) => {
      if (isDisabled || !isPrimaryPress(event) || isMouseFromTouch(event)) return
      const index = sectorOfEvent(event)
      if (index >= 0) onChange?.(index)
    },
    [count, onChange],
    [disabledFacet],
  )

  return (
    <fast-div
      className={rootClass}
      style={{ width: `${RADIAL_SIZE}rem`, height: `${RADIAL_SIZE}rem` }}
      onMouseMove={onMouseMove}
      onMouseDown={onPress}
      onTouchStart={onPress}
      onMouseLeave={() => setHighlight(-1)}
    >
      {items.map((label, index) => (
        <RadialItem key={index} label={label} index={index} count={count} highlight={highlight} />
      ))}
    </fast-div>
  )
}
