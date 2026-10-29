import type { ReactNode } from 'react'
import { useFacetEffect, useFacetWrap } from '@react-facet/core'
import type { FacetProp } from './props'
import { isPrimaryPress } from './pointer'

export type ModalProps = {
  open: FacetProp<boolean>
  onClose?: () => void
  title?: ReactNode
  children?: ReactNode
  actions?: ReactNode
}

export const useModalDismiss = (open: FacetProp<boolean>, onClose?: () => void) => {
  const openFacet = useFacetWrap(open)

  useFacetEffect(
    (isOpen) => {
      if (!isOpen) return
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') onClose?.()
      }
      document.addEventListener('keydown', onKeyDown)
      return () => document.removeEventListener('keydown', onKeyDown)
    },
    [onClose],
    [openFacet],
  )

  const onOverlayPress = (event: MouseEvent) => {
    if (!isPrimaryPress(event) || event.target !== event.currentTarget) return
    onClose?.()
  }

  return { openFacet, onOverlayPress }
}
