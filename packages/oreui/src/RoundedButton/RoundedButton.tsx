import { useFacetMap, useFacetWrap } from '@react-facet/core'
import { usePress } from '@ore-ui-react/core'
import type { RoundedButtonProps } from '@ore-ui-react/core/src/roundedbutton'
import './roundedbutton.css'

export const RoundedButton = ({ children, size = 'medium', disabled, onPress }: RoundedButtonProps) => {
  const onMouseDown = usePress(onPress, disabled)
  const disabledFacet = useFacetWrap(disabled ?? false)
  const className = useFacetMap(
    (isDisabled) => `oui-roundedbutton oui-roundedbutton-${size}${isDisabled ? ' disabled' : ''}`,
    [size],
    [disabledFacet],
  )

  return (
    <fast-div className={className} onMouseDown={onMouseDown}>
      <div className="oui-roundedbutton-label">{children}</div>
    </fast-div>
  )
}
