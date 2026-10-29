import { createFacet } from '@react-facet/core'
import type { Facet } from '@react-facet/core'

export type Toast = {
  id: string
  text: string
  timeout?: number
}

export type ToastPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export type Toasts = {
  items: Facet<Toast[]>
  show: (toast: Omit<Toast, 'id'>) => string
  dismiss: (id: string) => void
}

export type ToastHostProps = {
  toasts: Toasts
  position?: ToastPosition
  maxVisible?: number
}

export const createToasts = (): Toasts => {
  const items = createFacet<Toast[]>({ initialValue: [] })
  const timers = new Map<string, ReturnType<typeof setTimeout>>()
  let current: Toast[] = []
  let counter = 0

  const dismiss = (id: string) => {
    const timer = timers.get(id)
    if (timer !== undefined) clearTimeout(timer)
    timers.delete(id)
    current = current.filter((toast) => toast.id !== id)
    items.set(current)
  }

  const show = (toast: Omit<Toast, 'id'>) => {
    counter += 1
    const id = `t${counter}`
    current = [...current, { ...toast, id }]
    items.set(current)
    if (toast.timeout !== undefined && toast.timeout > 0) {
      timers.set(
        id,
        setTimeout(() => dismiss(id), toast.timeout),
      )
    }
    return id
  }

  return { items, show, dismiss }
}
