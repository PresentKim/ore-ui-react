import { useFacetMap, useFacetWrap } from '@react-facet/core'
import { clampPercent, halfDiscAngles, percentLabel } from '@ore-ui-react/core/src/progress'
import type { ProgressProps } from '@ore-ui-react/core/src/progress'
import './progress.css'

export const ProgressBar = ({ value }: ProgressProps) => {
  const valueFacet = useFacetWrap(value)
  const width = useFacetMap((current) => `${clampPercent(current)}%`, [], [valueFacet])

  return (
    <fast-div className="oui-progress-bar">
      <fast-div className="oui-progress-fill" style={{ width }} />
    </fast-div>
  )
}

export const ProgressCircle = ({ value }: ProgressProps) => {
  const valueFacet = useFacetWrap(value)
  const first = useFacetMap((current) => `rotate(${halfDiscAngles(current).first}deg)`, [], [valueFacet])
  const second = useFacetMap((current) => `rotate(${halfDiscAngles(current).second}deg)`, [], [valueFacet])
  const label = useFacetMap(percentLabel, [], [valueFacet])

  return (
    <fast-div className="oui-progress-circle">
      <fast-div className="oui-progress-clip oui-progress-clip-right">
        <fast-div className="oui-progress-half oui-progress-half-right" style={{ transform: first }} />
      </fast-div>
      <fast-div className="oui-progress-clip oui-progress-clip-left">
        <fast-div className="oui-progress-half oui-progress-half-left" style={{ transform: second }} />
      </fast-div>
      <fast-div className="oui-progress-hole">
        <fast-text text={label} />
      </fast-div>
    </fast-div>
  )
}
