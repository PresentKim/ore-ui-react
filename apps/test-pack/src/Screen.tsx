import { useEffect, useMemo, useState } from 'react'
import { useFacetMap, useFacetState } from '@react-facet/core'
import { createToasts } from '@ore-ui-react/core'
import { SizedBox } from '@ore-ui-react/primitives'
import { Controls } from './Controls'
import { Media } from './Media'
import { Stats } from './Stats'
import { createProbe } from './probe'
import { SKINS, SKIN_OPTIONS } from './skins'
import type { SkinName } from './skins'
import './test-pack.css'

export const TestScreen = () => {
  const probe = useMemo(createProbe, [])
  const toasts = useMemo(createToasts, [])
  const [skinName, setSkinName] = useState<SkinName>('oreui')
  const [modalOpen, setModalOpen] = useFacetState(false)
  const skin = SKINS[skinName]
  const { Segment, Scroll, Modal, ToastHost, Button } = skin

  useEffect(() => probe.attach(), [probe])

  const display = useFacetMap((shown) => (shown ? 'flex' : 'none'), [], [probe.shown])
  const badge = useFacetMap(
    (shown, route) => `debug ${shown ? 'on' : 'off'} | route ${route} | press to ${shown ? 'hide' : 'show'}`,
    [],
    [probe.shown, probe.route],
  )
  const closeModal = () => setModalOpen(false)

  return (
    <div className="tp-root">
      <fast-div className="tp-overlay" style={{ display }}>
        <SizedBox className="tp-panel" width={140} height={210} fixed>
          <div className="tp-title">ore-ui-react test</div>
          <Segment
            options={SKIN_OPTIONS}
            value={skinName}
            onChange={probe.guard('skin', (value: string) => {
              setSkinName(value as SkinName)
              probe.log('skin', value)
            })}
          />
          <Scroll>
            <Controls skin={skin} probe={probe} toasts={toasts} setModalOpen={setModalOpen} />
            <Media skin={skin} probe={probe} />
          </Scroll>
        </SizedBox>
        <SizedBox className="tp-panel" width={120} height={210} fixed>
          <Stats skin={skin} probe={probe} />
        </SizedBox>
        <fast-div className="tp-cursor" style={{ left: probe.cursorLeft, top: probe.cursorTop }} />
      </fast-div>
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title="Probe modal"
        actions={<Button onPress={closeModal}>close</Button>}
      >
        Modal body
      </Modal>
      <ToastHost toasts={toasts} />
      <div className="tp-badge-row">
        <fast-div className="tp-badge" onMouseDown={probe.guard('badge', (ev: MouseEvent) => {
            ev.stopPropagation()
            probe.toggleShown()
          })}>
          <fast-text text={badge} />
        </fast-div>
      </div>
    </div>
  )
}
