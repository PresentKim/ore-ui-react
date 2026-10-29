import { createRoot } from '@react-facet/dom-fiber'
import { TestScreen } from './Screen'

const container = document.createElement('div')
container.id = 'oui-react-test'
document.body.appendChild(container)

createRoot(container).render(<TestScreen />)
