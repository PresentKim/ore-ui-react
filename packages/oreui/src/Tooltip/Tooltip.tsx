import { useFacetMap } from '@react-facet/core'
import { Layer } from '@ore-ui-react/core/src/layer'
import { useTooltip } from '@ore-ui-react/core/src/tooltip'
import type { TooltipProps } from '@ore-ui-react/core/src/tooltip'
import './tooltip.css'

export const Tooltip = ({ content, children, side = 'right', open }: TooltipProps) => {
  const tooltip = useTooltip(side, open)
  const tipClass = useFacetMap((placed) => `oui-tooltip-tip ${placed}`, [], [tooltip.side])

  return (
    <fast-div
      ref={tooltip.rootRef}
      className="oui-tooltip"
      onMouseEnter={tooltip.onMouseEnter}
      onMouseLeave={tooltip.onMouseLeave}
      onTouchStart={tooltip.onTouchStart}
    >
      {children}
      <Layer>
        <fast-div
          ref={tooltip.tipRef}
          className={tipClass}
          style={{ visibility: tooltip.visibility, left: tooltip.left, top: tooltip.top }}
        >
          {content}
        </fast-div>
      </Layer>
    </fast-div>
  )
}
