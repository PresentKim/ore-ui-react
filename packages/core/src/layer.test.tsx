import { afterEach, describe, expect, it } from 'vitest'
import { useState } from 'react'
import { act, cleanup, render } from '@react-facet/dom-fiber-testing-library'
import { LAYER_ID, Layer } from './layer'

afterEach(cleanup)

describe('Layer', () => {
  it('renders children into the body layer', () => {
    const { container } = render(
      <Layer>
        <div className="floating" />
      </Layer>,
    )
    expect(container.querySelector('.floating')).toBeNull()
    expect(document.getElementById(LAYER_ID)?.querySelector('.floating')).not.toBeNull()
  })

  it('keeps the floating node across parent renders', () => {
    let bump = () => {}
    const Parent = () => {
      const [count, setCount] = useState(0)
      bump = () => setCount(count + 1)
      return (
        <Layer>
          <div className="floating">{count}</div>
        </Layer>
      )
    }
    render(<Parent />)
    const first = document.querySelector('.floating')
    act(() => bump())
    expect(document.querySelector('.floating')).toBe(first)
    expect(first?.textContent).toBe('1')
  })
})
