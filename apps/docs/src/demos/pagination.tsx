import type { ReactElement } from 'react'
import { useFacetMap, useFacetState } from '@react-facet/core'
import type { PaginationProps } from '@ore-ui-react/core/src/pagination'
import { Pagination as OrePagination } from '@ore-ui-react/oreui/src/Pagination/Pagination'
import { Pagination as JsonPagination } from '@ore-ui-react/jsonui/src/Pagination/Pagination'
import type { Demo } from '../catalog'

const PaginationDemo = ({ Pagination }: { Pagination: (props: PaginationProps) => ReactElement }) => {
  const [page, setPage] = useFacetState(1)
  const status = useFacetMap((current) => `Page ${current} of 10`, [], [page])

  return (
    <div>
      <div style={{ marginBottom: '0.75rem' }}>
        <Pagination pageCount={10} page={page} loop onChange={setPage} />
      </div>
      <div style={{ marginBottom: '0.75rem' }}>
        <Pagination pageCount={3} page={2} disabled />
      </div>
      <fast-text text={status} />
    </div>
  )
}

const demos: Record<string, Demo> = {
  pagination: {
    oreui: () => <PaginationDemo Pagination={OrePagination} />,
    jsonui: () => <PaginationDemo Pagination={JsonPagination} />,
    code: `const [page, setPage] = useFacetState(1)

<Pagination pageCount={10} page={page} loop onChange={setPage} />
<Pagination pageCount={3} page={2} disabled />`,
  },
}

export default demos
