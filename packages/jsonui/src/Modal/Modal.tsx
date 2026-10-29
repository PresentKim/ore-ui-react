import { Mount } from '@react-facet/core'
import { Layer } from '@ore-ui-react/core/src/layer'
import { useModalDismiss } from '@ore-ui-react/core/src/modal'
import type { ModalProps } from '@ore-ui-react/core/src/modal'
import './modal.css'

export const Modal = ({ open, onClose, title, children, actions }: ModalProps) => {
  const { openFacet, onOverlayPress } = useModalDismiss(open, onClose)

  return (
    <Mount when={openFacet}>
      <Layer>
        <fast-div className="jui-modal" onMouseDown={onOverlayPress}>
          <div className="jui-modal-window">
            {title != null && <div className="jui-modal-title">{title}</div>}
            <div className="jui-modal-content">{children}</div>
            {actions != null && <div className="jui-modal-actions">{actions}</div>}
          </div>
        </fast-div>
      </Layer>
    </Mount>
  )
}
