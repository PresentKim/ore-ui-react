import * as oreui from '@ore-ui-react/oreui'
import * as jsonui from '@ore-ui-react/jsonui'

export type Skin = typeof oreui
export type SkinName = 'oreui' | 'jsonui'

export const SKINS: Record<SkinName, Skin> = { oreui, jsonui }

export const SKIN_OPTIONS = [
  { value: 'oreui', label: 'Ore UI' },
  { value: 'jsonui', label: 'JSON UI' },
]
