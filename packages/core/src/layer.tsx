import { createPortal } from '@react-facet/dom-fiber'
import type { ReactNode, ReactPortal } from 'react'
import './layer.css'

export const LAYER_ID = 'ou-layer'

const layerElement = () => {
  const found = document.getElementById(LAYER_ID)
  if (found) return found
  const layer = document.createElement('div')
  layer.id = LAYER_ID
  document.body.appendChild(layer)
  return layer
}

type LayerPortal = ReactPortal & { containerInfo: unknown }

const containers = new WeakMap<HTMLElement, unknown>()

// React remounts a portal whose containerInfo object changes, and dom-fiber createPortal builds a new one per call.
export const Layer = ({ children }: { children?: ReactNode }): LayerPortal => {
  const element = layerElement()
  const portal = createPortal(children, element) as LayerPortal
  const container = containers.get(element)
  if (container) return { ...portal, containerInfo: container }
  containers.set(element, portal.containerInfo)
  return portal
}
