import type { ReactElement } from 'react'
import type { ChartProps } from '@ore-ui-react/core/src/chart'
import {
  BarChart as OreBarChart,
  LineChart as OreLineChart,
} from '@ore-ui-react/oreui/src/Chart/Chart'
import {
  BarChart as JsonBarChart,
  LineChart as JsonLineChart,
} from '@ore-ui-react/jsonui/src/Chart/Chart'
import type { Demo } from '../catalog'

const data = [4, 8, -3, 6, 10, 2]

const ChartDemo = ({
  BarChart,
  LineChart,
}: {
  BarChart: (props: ChartProps) => ReactElement
  LineChart: (props: ChartProps) => ReactElement
}) => (
  <div>
    <div style={{ marginBottom: '0.75rem' }}>
      <BarChart data={data} />
    </div>
    <LineChart data={data} />
  </div>
)

const demos: Record<string, Demo> = {
  chart: {
    oreui: () => <ChartDemo BarChart={OreBarChart} LineChart={OreLineChart} />,
    jsonui: () => <ChartDemo BarChart={JsonBarChart} LineChart={JsonLineChart} />,
    code: `<BarChart data={[4, 8, -3, 6, 10, 2]} />
<LineChart data={[4, 8, -3, 6, 10, 2]} width={30} height={16} />`,
  },
}

export default demos
