import { useFacetCallback, useFacetWrap } from '@react-facet/core'
import { isPrimaryPress } from './pointer'
import type { FacetProp } from './props'

export const usePress = (onPress?: () => void, disabled?: FacetProp<boolean>) => {
  const disabledFacet = useFacetWrap(disabled ?? false)
  return useFacetCallback(
    (isDisabled: boolean) => (event: MouseEvent) => {
      if (isDisabled || !isPrimaryPress(event)) return
      onPress?.()
    },
    [onPress],
    [disabledFacet],
  )
}
