import { useFacetMap, useFacetWrap } from '@react-facet/core'
import { usePress } from '@ore-ui-react/core'
import type { ButtonProps } from '@ore-ui-react/core'
import './button.css'

export const Button = ({ children, variant = 'secondary', disabled, onPress }: ButtonProps) => {
  const onMouseDown = usePress(onPress, disabled)
  const disabledFacet = useFacetWrap(disabled ?? false)
  const className = useFacetMap(
    (isDisabled) => `oui-button oui-button-${variant}${isDisabled ? ' disabled' : ''}`,
    [variant],
    [disabledFacet],
  )

  return (
    <fast-div className={className} onMouseDown={onMouseDown}>
      <div className="oui-button-label">{children}</div>
    </fast-div>
  )
}
