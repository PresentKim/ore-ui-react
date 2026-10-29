import { useFacetState } from '@react-facet/core'
import { Button as OreButton } from '@ore-ui-react/oreui/src/Button/Button'
import { Modal as OreModal } from '@ore-ui-react/oreui/src/Modal/Modal'
import { Button as JsonButton } from '@ore-ui-react/jsonui/src/Button/Button'
import { Modal as JsonModal } from '@ore-ui-react/jsonui/src/Modal/Modal'
import type { Demo } from '../catalog'

const ModalDemo = ({ Button, Modal }: { Button: typeof OreButton; Modal: typeof OreModal }) => {
  const [open, setOpen] = useFacetState(false)
  const close = () => setOpen(false)

  return (
    <div>
      <Button onPress={() => setOpen(true)}>Open modal</Button>
      <Modal
        open={open}
        onClose={close}
        title="Leave world"
        actions={
          <>
            <Button onPress={close}>Cancel</Button>
            <Button variant="danger" onPress={close}>
              Leave
            </Button>
          </>
        }
      >
        Unsaved changes will be lost.
      </Modal>
    </div>
  )
}

const demos: Record<string, Demo> = {
  modal: {
    oreui: () => <ModalDemo Button={OreButton} Modal={OreModal} />,
    jsonui: () => <ModalDemo Button={JsonButton} Modal={JsonModal} />,
    code: `const [open, setOpen] = useFacetState(false)

<Button onPress={() => setOpen(true)}>Open modal</Button>
<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Leave world"
  actions={<Button onPress={() => setOpen(false)}>Cancel</Button>}
>
  Unsaved changes will be lost.
</Modal>`,
  },
}

export default demos
