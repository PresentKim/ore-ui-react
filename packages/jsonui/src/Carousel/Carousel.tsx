import { Children } from 'react'
import { useFacetCallback, useFacetMap, useFacetWrap } from '@react-facet/core'
import { carouselPageCount, trackOffset, type CarouselProps } from '@ore-ui-react/core/src/carousel'
import { stepPage } from '@ore-ui-react/core/src/pagination'
import { isPrimaryPress } from '@ore-ui-react/core/src/pointer'
import './carousel.css'

type PageFacet = ReturnType<typeof useFacetWrap<number>>

export const Carousel = ({ children, page, itemsPerPage: requestedPerPage = 1, loop = false, onChange }: CarouselProps) => {
  const itemsPerPage = Math.max(1, requestedPerPage)
  const pageFacet = useFacetWrap(page ?? 1)
  const items = Children.toArray(children)
  const pageCount = carouselPageCount(items.length, itemsPerPage)
  const transform = useFacetMap((current) => trackOffset(current, pageCount), [pageCount], [pageFacet])
  const dots = Array.from({ length: pageCount }, (_, index) => index + 1)

  return (
    <fast-div className="jui-carousel">
      <fast-div className="jui-carousel-stage">
        <Step direction={-1} pageCount={pageCount} loop={loop} page={pageFacet} onChange={onChange} />
        <fast-div className="jui-carousel-viewport">
          <fast-div className="jui-carousel-track" style={{ transform }}>
            {items.map((item, index) => (
              <fast-div key={index} className="jui-carousel-slide" style={{ flexBasis: `${100 / itemsPerPage}%` }}>
                {item}
              </fast-div>
            ))}
          </fast-div>
        </fast-div>
        <Step direction={1} pageCount={pageCount} loop={loop} page={pageFacet} onChange={onChange} />
      </fast-div>
      <fast-div className="jui-carousel-dots">
        {dots.map((number) => (
          <Dot key={number} number={number} page={pageFacet} onChange={onChange} />
        ))}
      </fast-div>
    </fast-div>
  )
}

type StepProps = {
  direction: 1 | -1
  pageCount: number
  loop: boolean
  page: PageFacet
  onChange?: (page: number) => void
}

const Step = ({ direction, pageCount, loop, page, onChange }: StepProps) => {
  const name = direction === 1 ? 'next' : 'prev'
  const className = useFacetMap(
    (current) =>
      `jui-carousel-${name}${stepPage(current, pageCount, direction, loop) === undefined ? ' disabled' : ''}`,
    [name, pageCount, direction, loop],
    [page],
  )
  const press = useFacetCallback(
    (current: number) => (event: MouseEvent) => {
      if (!isPrimaryPress(event)) return
      const target = stepPage(current, pageCount, direction, loop)
      if (target !== undefined) onChange?.(target)
    },
    [pageCount, direction, loop, onChange],
    [page],
  )
  return (
    <fast-div className={className} onMouseDown={press}>
      <fast-div className="jui-carousel-arrow" />
    </fast-div>
  )
}

type DotProps = {
  number: number
  page: PageFacet
  onChange?: (page: number) => void
}

const Dot = ({ number, page, onChange }: DotProps) => {
  const className = useFacetMap(
    (current) => `jui-carousel-dot${current === number ? ' on' : ''}`,
    [number],
    [page],
  )
  const press = useFacetCallback(
    (current: number) => (event: MouseEvent) => {
      if (!isPrimaryPress(event) || current === number) return
      onChange?.(number)
    },
    [number, onChange],
    [page],
  )
  return <fast-div className={className} onMouseDown={press} />
}
