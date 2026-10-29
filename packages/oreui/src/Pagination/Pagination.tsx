import { useFacetCallback, useFacetMap, useFacetWrap } from '@react-facet/core'
import { pageWindow, stepPage, type PaginationProps } from '@ore-ui-react/core/src/pagination'
import './pagination.css'

type PageFacet = ReturnType<typeof useFacetWrap<number>>
type DisabledFacet = PageFacet

export const Pagination = ({
  pageCount,
  page,
  windowSize = 5,
  loop = false,
  disabled,
  onChange,
}: PaginationProps) => {
  const pageFacet = useFacetWrap(page ?? 1)
  const disabledProp = useFacetWrap(disabled ?? false)
  const disabledFacet = useFacetMap((isDisabled) => (isDisabled ? 1 : 0), [], [disabledProp])
  const slots = Array.from({ length: Math.min(windowSize, pageCount) }, (_, index) => index)

  return (
    <fast-div className="oui-pagination">
      <Step direction={-1} pageCount={pageCount} loop={loop} page={pageFacet} disabled={disabledFacet} onChange={onChange} />
      {slots.map((slot) => (
        <Slot
          key={slot}
          slot={slot}
          pageCount={pageCount}
          windowSize={windowSize}
          page={pageFacet}
          disabled={disabledFacet}
          onChange={onChange}
        />
      ))}
      <Step direction={1} pageCount={pageCount} loop={loop} page={pageFacet} disabled={disabledFacet} onChange={onChange} />
    </fast-div>
  )
}

type StepProps = {
  direction: 1 | -1
  pageCount: number
  loop: boolean
  page: PageFacet
  disabled: DisabledFacet
  onChange?: (page: number) => void
}

const Step = ({ direction, pageCount, loop, page, disabled, onChange }: StepProps) => {
  const name = direction === 1 ? 'next' : 'prev'
  const className = useFacetMap(
    (current, isDisabled) =>
      `oui-pagination-${name}${isDisabled || stepPage(current, pageCount, direction, loop) === undefined ? ' disabled' : ''}`,
    [name, pageCount, direction, loop],
    [page, disabled],
  )
  const press = useFacetCallback(
    (current: number, isDisabled: number) => (event: MouseEvent) => {
      if (isDisabled || event.button !== 0) return
      const target = stepPage(current, pageCount, direction, loop)
      if (target !== undefined) onChange?.(target)
    },
    [pageCount, direction, loop, onChange],
    [page, disabled],
  )
  return (
    <fast-div className={className} onMouseDown={press}>
      <fast-div className="oui-pagination-arrow" />
    </fast-div>
  )
}

type SlotProps = {
  slot: number
  pageCount: number
  windowSize: number
  page: PageFacet
  disabled: DisabledFacet
  onChange?: (page: number) => void
}

const Slot = ({ slot, pageCount, windowSize, page, disabled, onChange }: SlotProps) => {
  const number = useFacetMap(
    (current) => pageWindow(current, pageCount, windowSize)[slot] ?? 0,
    [slot, pageCount, windowSize],
    [page],
  )
  const text = useFacetMap((value) => String(value), [], [number])
  const className = useFacetMap(
    (value, current) => `oui-pagination-page${value === current ? ' on' : ''}`,
    [],
    [number, page],
  )
  const press = useFacetCallback(
    (value: number, current: number, isDisabled: number) => (event: MouseEvent) => {
      if (isDisabled || event.button !== 0 || value === current) return
      onChange?.(value)
    },
    [onChange],
    [number, page, disabled],
  )
  return (
    <fast-div className={className} onMouseDown={press}>
      <fast-text text={text} />
    </fast-div>
  )
}
