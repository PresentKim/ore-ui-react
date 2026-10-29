import type { ReactElement } from 'react'
import { useFacetMap, useFacetState } from '@react-facet/core'
import type { CarouselProps } from '@ore-ui-react/core/src/carousel'
import { Carousel as OreCarousel } from '@ore-ui-react/oreui/src/Carousel/Carousel'
import { Carousel as JsonCarousel } from '@ore-ui-react/jsonui/src/Carousel/Carousel'
import type { Demo } from '../catalog'

const tile = (label: string) => (
  <div key={label} style={{ height: '8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {label}
  </div>
)

const CarouselDemo = ({ Carousel }: { Carousel: (props: CarouselProps) => ReactElement }) => {
  const [page, setPage] = useFacetState(1)
  const status = useFacetMap((current) => `Page ${current} of 4`, [], [page])

  return (
    <div>
      <div style={{ width: '32rem', marginBottom: '0.75rem' }}>
        <Carousel page={page} loop onChange={setPage}>
          {['One', 'Two', 'Three', 'Four'].map(tile)}
        </Carousel>
      </div>
      <div style={{ width: '32rem', marginBottom: '0.75rem' }}>
        <Carousel itemsPerPage={2}>{['A', 'B', 'C', 'D', 'E'].map(tile)}</Carousel>
      </div>
      <fast-text text={status} />
    </div>
  )
}

const demos: Record<string, Demo> = {
  carousel: {
    oreui: () => <CarouselDemo Carousel={OreCarousel} />,
    jsonui: () => <CarouselDemo Carousel={JsonCarousel} />,
    code: `const [page, setPage] = useFacetState(1)

<Carousel page={page} loop onChange={setPage}>
  <Slide>One</Slide>
  <Slide>Two</Slide>
</Carousel>
<Carousel itemsPerPage={2}>...</Carousel>`,
  },
}

export default demos
