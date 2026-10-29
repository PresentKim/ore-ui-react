import { createToasts } from '@ore-ui-react/core/src/toast'
import type { Toasts, ToastHostProps } from '@ore-ui-react/core/src/toast'
import { Button as OreButton } from '@ore-ui-react/oreui/src/Button/Button'
import { ToastHost as OreHost } from '@ore-ui-react/oreui/src/Toast/Toast'
import { Button as JsonButton } from '@ore-ui-react/jsonui/src/Button/Button'
import { ToastHost as JsonHost } from '@ore-ui-react/jsonui/src/Toast/Toast'
import { useMemo } from 'react'
import type { Demo } from '../catalog'

type Skin = {
  Button: typeof OreButton
  ToastHost: (props: ToastHostProps) => JSX.Element
}

const ToastDemo = ({ skin: { Button, ToastHost } }: { skin: Skin }) => {
  const toasts: Toasts = useMemo(createToasts, [])

  return (
    <div>
      <Button onPress={() => toasts.show({ text: 'Settings saved', timeout: 3000 })}>Show toast</Button>
      <ToastHost toasts={toasts} />
    </div>
  )
}

const demos: Record<string, Demo> = {
  toast: {
    oreui: () => <ToastDemo skin={{ Button: OreButton, ToastHost: OreHost }} />,
    jsonui: () => <ToastDemo skin={{ Button: JsonButton, ToastHost: JsonHost }} />,
    code: `const toasts = createToasts()

<Button onPress={() => toasts.show({ text: 'Settings saved', timeout: 3000 })}>Show toast</Button>
<ToastHost toasts={toasts} position="top-right" maxVisible={3} />`,
  },
}

export default demos
