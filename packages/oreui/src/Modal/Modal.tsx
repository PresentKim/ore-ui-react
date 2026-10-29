import { Mount } from '@react-facet/core'
import { useModalDismiss } from '@ore-ui-react/core/src/modal'
import type { ModalProps } from '@ore-ui-react/core/src/modal'
import './modal.css'

export const Modal = ({ open, onClose, title, children, actions }: ModalProps) => {
  const { openFacet, onOverlayPress } = useModalDismiss(open, onClose)

  return (
    <Mount when={openFacet}>
      <fast-div className="oui-modal" onMouseDown={onOverlayPress}>
        <div className="oui-modal-window">
          {title != null && <div className="oui-modal-title">{title}</div>}
          <div className="oui-modal-content">{children}</div>
          {actions != null && <div className="oui-modal-actions">{actions}</div>}
        </div>
      </fast-div>
    </Mount>
  )
}
