import { Map, useFacetCallback, useFacetMap } from '@react-facet/core'
import type { Facet } from '@react-facet/core'
import { Layer } from '@ore-ui-react/core/src/layer'
import { isPrimaryPress } from '@ore-ui-react/core/src/pointer'
import type { Toast, ToastHostProps, Toasts } from '@ore-ui-react/core/src/toast'
import './toast.css'

const ToastItem = ({ item, toasts }: { item: Facet<Toast>; toasts: Toasts }) => {
  const text = useFacetMap((toast) => toast.text, [], [item])
  const onMouseDown = useFacetCallback(
    (toast: Toast) => (event: MouseEvent) => {
      if (isPrimaryPress(event)) toasts.dismiss(toast.id)
    },
    [toasts],
    [item],
  )

  return (
    <fast-div className="oui-toast" onMouseDown={onMouseDown}>
      <fast-text text={text} />
    </fast-div>
  )
}

export const ToastHost = ({ toasts, position = 'top-right', maxVisible = 3 }: ToastHostProps) => {
  const visible = useFacetMap((list) => list.slice(Math.max(0, list.length - maxVisible)), [maxVisible], [toasts.items])

  return (
    <Layer>
      <fast-div className={`oui-toast-host ${position}`}>
        <Map array={visible}>{(item) => <ToastItem item={item} toasts={toasts} />}</Map>
      </fast-div>
    </Layer>
  )
}
