import { createRoot } from '@react-facet/dom-fiber'
import { App } from './App'
import { CATALOG } from './catalog'
import { DEMOS } from './demos'

createRoot(document.getElementById('root') as HTMLElement).render(<App catalog={CATALOG} demos={DEMOS} />)
