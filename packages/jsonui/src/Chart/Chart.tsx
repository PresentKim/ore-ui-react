import { useFacetUnwrap, useFacetWrap } from '@react-facet/core'
import { barBoxes, chartDomain, linePoints, lineSegments, round2, type ChartProps } from '@ore-ui-react/core/src/chart'
import './chart.css'

const percent = (ratio: number) => `${round2(ratio * 100)}%`

const useValues = (data: ChartProps['data']) => {
  const unwrapped = useFacetUnwrap(useFacetWrap(data))
  return Array.isArray(unwrapped) ? (unwrapped as number[]) : []
}

export const BarChart = ({ data, domain, width = 30, height = 16 }: ChartProps) => {
  const values = useValues(data)
  const { baseline, bars } = barBoxes(values, chartDomain(values, domain))
  const band = 100 / Math.max(1, values.length)

  return (
    <fast-div className="jui-chart" style={{ width: `${width}rem`, height: `${height}rem` }}>
      <fast-div className="jui-chart-baseline" style={{ bottom: percent(baseline) }} />
      {bars.map((bar, index) => (
        <fast-div
          key={index}
          className={values[index] < 0 ? 'jui-chart-bar negative' : 'jui-chart-bar'}
          style={{
            left: `${round2((index + 0.2) * band)}%`,
            width: `${round2(band * 0.6)}%`,
            bottom: percent(bar.bottom),
            height: percent(bar.height),
          }}
        />
      ))}
    </fast-div>
  )
}

export const LineChart = ({ data, domain, width = 30, height = 16 }: ChartProps) => {
  const values = useValues(data)
  const range = chartDomain(values, domain)
  const points = linePoints(values, range, width, height)
  const segments = lineSegments(values, range, width, height)

  return (
    <fast-div className="jui-chart" style={{ width: `${width}rem`, height: `${height}rem` }}>
      {segments.map((segment, index) => (
        <fast-div
          key={index}
          className="jui-chart-segment"
          style={{
            left: `${segment.left}rem`,
            top: `${segment.top}rem`,
            width: `${segment.length}rem`,
            transform: `rotate(${segment.angle}deg)`,
          }}
        />
      ))}
      {points.map((point, index) => (
        <fast-div
          key={index}
          className="jui-chart-point"
          style={{ left: `${point.left}rem`, top: `${point.top}rem` }}
        />
      ))}
    </fast-div>
  )
}
