import { useFacetCallback, useFacetWrap } from '@react-facet/core'
import type { FacetProp } from './props'

export const usePress = (onPress?: () => void, disabled?: FacetProp<boolean>) => {
  const disabledFacet = useFacetWrap(disabled ?? false)
  return useFacetCallback(
    (isDisabled: boolean) => (event: MouseEvent) => {
      if (isDisabled || event.button !== 0) return
      onPress?.()
    },
    [onPress],
    [disabledFacet],
  )
}
