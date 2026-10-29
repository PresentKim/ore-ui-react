import { useEffect, useState } from 'react'
import type { CatalogCategory, CatalogEntry, Demo } from './catalog'
import './docs.css'

export type { Demo } from './catalog'

type AppProps = {
  catalog: CatalogCategory[]
  demos: Record<string, Demo>
}

const readHash = () => window.location.hash

const useHash = () => {
  const [hash, setHash] = useState(readHash)
  useEffect(() => {
    const onChange = () => setHash(readHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash
}

const findRoute = (catalog: CatalogCategory[], hash: string) => {
  const [, categoryId, entryId] = hash.split('/')
  const category = catalog.find((c) => c.id === categoryId)
  const entry = category?.entries.find((e) => e.id === entryId)
  return category && entry ? { category, entry } : undefined
}

const Planned = ({ entry }: { entry: CatalogEntry }) => (
  <div className="docs-planned">
    <span className="docs-badge">Planned</span>
    {entry.source && <a href={entry.source}>{entry.source}</a>}
  </div>
)

const Showcase = ({ entry, demo }: { entry: CatalogEntry; demo: Demo }) => (
  <div>
    <div className="docs-panels">
      <section className="docs-panel">
        <h3>Ore UI</h3>
        <div className="docs-stage">{demo.oreui()}</div>
      </section>
      <section className="docs-panel">
        <h3>JSON UI</h3>
        <div className="docs-stage">{demo.jsonui()}</div>
      </section>
    </div>
    <pre className="docs-code">{demo.code}</pre>
    {entry.source && <a href={entry.source}>{entry.source}</a>}
  </div>
)

export const App = ({ catalog, demos }: AppProps) => {
  const hash = useHash()
  const route = findRoute(catalog, hash)
  const demo = route && route.entry.status === 'ready' ? demos[route.entry.id] : undefined

  return (
    <div className="docs">
      <nav className="docs-sidebar">
        <a className="docs-home" href="#/">
          Ore UI React
        </a>
        {catalog.map((category) => (
          <div key={category.id} className="docs-category">
            <h2>{category.title}</h2>
            {category.entries.map((entry) => (
              <a
                key={entry.id}
                className={`docs-link ${entry.status}`}
                href={`#/${category.id}/${entry.id}`}
              >
                {entry.name}
              </a>
            ))}
          </div>
        ))}
      </nav>
      <main className="docs-content">
        {route ? (
          <div>
            <h1>{route.entry.name}</h1>
            {demo ? <Showcase entry={route.entry} demo={demo} /> : <Planned entry={route.entry} />}
          </div>
        ) : (
          <div className="docs-index">
            <h1>Components</h1>
            <p>Pick a component from the sidebar.</p>
          </div>
        )}
      </main>
    </div>
  )
}
