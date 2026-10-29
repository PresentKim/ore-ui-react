import { afterEach, describe, expect, it } from 'vitest'
import { render } from '@react-facet/dom-fiber-testing-library'
import { App } from './App'
import { CATALOG } from './catalog'
import type { Demo } from './App'

const demos: Record<string, Demo> = {
  button: {
    oreui: () => <div className="fake-ore">ore body</div>,
    jsonui: () => <div className="fake-json">json body</div>,
    code: '<Button>Play</Button>',
  },
}

afterEach(() => {
  window.location.hash = ''
})

describe('App', () => {
  it('shows both panels and the code for a ready entry', () => {
    window.location.hash = '#/basic/button'
    const { container } = render(<App catalog={CATALOG} demos={demos} />)
    const text = container.textContent ?? ''
    expect(text).toContain('Ore UI')
    expect(text).toContain('JSON UI')
    expect(text).toContain('ore body')
    expect(text).toContain('json body')
    expect(text).toContain('<Button>Play</Button>')
  })

  it('renders code as text', () => {
    window.location.hash = '#/basic/button'
    const { container } = render(<App catalog={CATALOG} demos={demos} />)
    const pre = container.querySelector('pre')!
    expect(pre.textContent).toBe('<Button>Play</Button>')
    expect(pre.children.length).toBe(0)
  })

  it('shows Planned and the source link for a planned entry', () => {
    window.location.hash = '#/basic/accordion'
    const { container } = render(<App catalog={CATALOG} demos={demos} />)
    expect(container.textContent).toContain('Planned')
    const link = Array.from(container.querySelectorAll('a')).find(
      (a) => a.getAttribute('href') === CATALOG[0].entries[0].source,
    )
    expect(link).toBeTruthy()
  })

  it('shows the index for an unknown hash', () => {
    window.location.hash = '#/nope'
    const { container } = render(<App catalog={CATALOG} demos={demos} />)
    expect(container.querySelector('.docs-index')).toBeTruthy()
    expect(container.querySelector('pre')).toBeNull()
  })
})
