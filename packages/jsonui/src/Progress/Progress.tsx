import { useFacetMap, useFacetWrap } from '@react-facet/core'
import { clampPercent, halfDiscAngles, percentLabel } from '@ore-ui-react/core/src/progress'
import type { ProgressProps } from '@ore-ui-react/core/src/progress'
import './progress.css'

export const ProgressBar = ({ value }: ProgressProps) => {
  const valueFacet = useFacetWrap(value)
  const width = useFacetMap((current) => `${clampPercent(current)}%`, [], [valueFacet])

  return (
    <fast-div className="jui-progress-bar">
      <fast-div className="jui-progress-fill" style={{ width }} />
    </fast-div>
  )
}

export const ProgressCircle = ({ value }: ProgressProps) => {
  const valueFacet = useFacetWrap(value)
  const first = useFacetMap((current) => `rotate(${halfDiscAngles(current).first}deg)`, [], [valueFacet])
  const second = useFacetMap((current) => `rotate(${halfDiscAngles(current).second}deg)`, [], [valueFacet])
  const label = useFacetMap(percentLabel, [], [valueFacet])

  return (
    <fast-div className="jui-progress-circle">
      <fast-div className="jui-progress-clip jui-progress-clip-right">
        <fast-div className="jui-progress-half jui-progress-half-right" style={{ transform: first }} />
      </fast-div>
      <fast-div className="jui-progress-clip jui-progress-clip-left">
        <fast-div className="jui-progress-half jui-progress-half-left" style={{ transform: second }} />
      </fast-div>
      <fast-div className="jui-progress-hole">
        <fast-text text={label} />
      </fast-div>
    </fast-div>
  )
}
