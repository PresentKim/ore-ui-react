import { useRef } from 'react'
import { useFacetCallback, useFacetEffect, useFacetMap, useFacetWrap } from '@react-facet/core'
import type { StepperItem, StepperProps } from '@ore-ui-react/core/src/stepper'
import './stepper.css'

export const Stepper = ({ items, value, loop = false, disabled, onChange }: StepperProps) => {
  const valueFacet = useFacetWrap<string | undefined>(value)
  const disabledFacet = useFacetWrap(disabled ?? false)

  const index = useRef(-1)
  useFacetEffect(
    (current) => {
      index.current = items.findIndex((item) => item.value === current)
    },
    [items],
    [valueFacet],
  )

  const atStart = useFacetMap(
    (current) => !loop && items.findIndex((item) => item.value === current) <= 0,
    [items, loop],
    [valueFacet],
  )
  const atEnd = useFacetMap(
    (current) => !loop && items.findIndex((item) => item.value === current) >= items.length - 1,
    [items, loop],
    [valueFacet],
  )
  const prevBlocked = useFacetMap((end, off) => end || off, [], [atStart, disabledFacet])
  const nextBlocked = useFacetMap((end, off) => end || off, [], [atEnd, disabledFacet])

  const rootClass = useFacetMap((off) => `jui-stepper${off ? ' disabled' : ''}`, [], [disabledFacet])
  const prevClass = useFacetMap((blocked) => `jui-stepper-arrow jui-stepper-prev${blocked ? ' disabled' : ''}`, [], [prevBlocked])
  const nextClass = useFacetMap((blocked) => `jui-stepper-arrow jui-stepper-next${blocked ? ' disabled' : ''}`, [], [nextBlocked])

  const step = (direction: number) => {
    const count = items.length
    const target = loop ? (index.current + direction + count) % count : index.current + direction
    const item = items[target]
    if (item) onChange?.(item.value)
  }
  const pressPrev = useFacetCallback(
    (blocked: boolean) => (event: MouseEvent) => {
      if (blocked || event.button !== 0) return
      step(-1)
    },
    [items, loop, onChange],
    [prevBlocked],
  )
  const pressNext = useFacetCallback(
    (blocked: boolean) => (event: MouseEvent) => {
      if (blocked || event.button !== 0) return
      step(1)
    },
    [items, loop, onChange],
    [nextBlocked],
  )

  return (
    <fast-div className={rootClass}>
      <fast-div className={prevClass} onMouseDown={pressPrev}>
        <fast-div className="jui-stepper-glyph" />
      </fast-div>
      <fast-div className="jui-stepper-current">
        {items.map((item) => (
          <CurrentLabel key={item.value} item={item} value={valueFacet} />
        ))}
      </fast-div>
      <fast-div className={nextClass} onMouseDown={pressNext}>
        <fast-div className="jui-stepper-glyph" />
      </fast-div>
    </fast-div>
  )
}

type CurrentLabelProps = {
  item: StepperItem
  value: ReturnType<typeof useFacetWrap<string | undefined>>
}

const CurrentLabel = ({ item, value }: CurrentLabelProps) => {
  const display = useFacetMap((current) => (current === item.value ? 'block' : 'none'), [item.value], [value])
  return <fast-div style={{ display }}>{item.label}</fast-div>
}
