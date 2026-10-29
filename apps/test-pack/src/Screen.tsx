import { useEffect, useState } from 'react'
import { Scroll as OreScroll } from '@ore-ui-react/oreui'
import { Scroll as JsonScroll } from '@ore-ui-react/jsonui'
import { SizedBox } from '@ore-ui-react/primitives'
import { CATALOG } from '../../docs/src/catalog'
import type { CatalogEntry } from '../../docs/src/catalog'
import { DEMOS } from '../../docs/src/demos/index'
import './test-pack.css'

const READY: CatalogEntry[] = CATALOG.reduce<CatalogEntry[]>(
  (all, category) => all.concat(category.entries.filter((entry) => entry.id in DEMOS)),
  [],
)

type EntryLinkProps = {
  entry: CatalogEntry
  active: boolean
  onSelect: (id: string) => void
}

const EntryLink = ({ entry, active, onSelect }: EntryLinkProps) => (
  <div
    className={active ? 'tp-link active' : 'tp-link'}
    onMouseDown={(ev) => {
      if (ev.button !== 0) return
      onSelect(entry.id)
    }}
  >
    {entry.name}
  </div>
)

export const TestScreen = () => {
  const [shown, setShown] = useState(true)
  const [selected, setSelected] = useState(READY[0].id)
  const entry = READY.find((e) => e.id === selected) ?? READY[0]
  const demo = DEMOS[entry.id]

  useEffect(() => {
    document.body.classList.toggle('tp-active', shown)
  }, [shown])

  return (
    <>
      {shown && (
        <SizedBox className="tp-window" fixed>
          <div className="tp-sidebar">
            <div className="tp-title">ore-ui-react</div>
            <OreScroll>
              {CATALOG.map((category) => (
                <div key={category.id} className="tp-category">
                  <div className="tp-category-title">{category.title}</div>
                  {category.entries
                    .filter((e) => e.id in DEMOS)
                    .map((e) => (
                      <EntryLink key={e.id} entry={e} active={e.id === entry.id} onSelect={setSelected} />
                    ))}
                </div>
              ))}
            </OreScroll>
          </div>
          <div className="tp-main">
            <div className="tp-heading">{entry.name}</div>
            <div className="tp-panels">
              <div className="tp-panel">
                <div className="tp-panel-title">Ore UI</div>
                <OreScroll key={`ore-${entry.id}`}>
                  <div className="tp-stage">{demo.oreui()}</div>
                </OreScroll>
              </div>
              <div className="tp-panel">
                <div className="tp-panel-title">JSON UI</div>
                <JsonScroll key={`json-${entry.id}`}>
                  <div className="tp-stage">{demo.jsonui()}</div>
                </JsonScroll>
              </div>
            </div>
          </div>
        </SizedBox>
      )}
      <div className="tp-badge-row">
        <div
          className="tp-badge"
          onMouseDown={(ev) => {
            if (ev.button !== 0) return
            setShown(!shown)
          }}
        >
          {shown ? 'ore-ui-react gallery: press to hide' : 'ore-ui-react gallery: press to show'}
        </div>
      </div>
    </>
  )
}
